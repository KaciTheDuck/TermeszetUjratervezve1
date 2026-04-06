import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable, postsTable, friendshipsTable } from "@workspace/db";
import { eq, or, and, count } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middleware/auth";

const router: IRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET ?? "trails-dev-secret";

// ── Register ─────────────────────────────────────────────────────────────────
router.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password, display_name } = req.body;
    if (!username || !email || !password || !display_name) {
      res.status(400).json({ error: "Minden mező kötelező" });
      return;
    }
    const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.username, username));
    if (existing.length > 0) { res.status(409).json({ error: "A felhasználónév már foglalt" }); return; }
    const existingEmail = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email));
    if (existingEmail.length > 0) { res.status(409).json({ error: "Az email cím már regisztrálva van" }); return; }
    const password_hash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({ username, email, password_hash, display_name }).returning({
      id: usersTable.id, username: usersTable.username, display_name: usersTable.display_name,
      email: usersTable.email, bio: usersTable.bio, avatar_url: usersTable.avatar_url,
      is_public: usersTable.is_public, notifications_enabled: usersTable.notifications_enabled,
      created_at: usersTable.created_at,
    });
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "30d" });
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

// ── Login ─────────────────────────────────────────────────────────────────────
router.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) { res.status(400).json({ error: "Felhasználónév és jelszó kötelező" }); return; }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
    if (!user) { res.status(401).json({ error: "Hibás felhasználónév vagy jelszó" }); return; }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) { res.status(401).json({ error: "Hibás felhasználónév vagy jelszó" }); return; }
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "30d" });
    const { password_hash: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

// ── Me ────────────────────────────────────────────────────────────────────────
router.get("/auth/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Nem hitelesített" }); return; }
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: number };
    const [user] = await db
      .select({
        id: usersTable.id, username: usersTable.username, display_name: usersTable.display_name,
        email: usersTable.email, bio: usersTable.bio, avatar_url: usersTable.avatar_url,
        is_public: usersTable.is_public, notifications_enabled: usersTable.notifications_enabled,
        created_at: usersTable.created_at,
      })
      .from(usersTable)
      .where(eq(usersTable.id, payload.userId));
    if (!user) { res.status(404).json({ error: "Felhasználó nem található" }); return; }
    res.json(user);
  } catch {
    res.status(401).json({ error: "Érvénytelen token" });
  }
});

// ── Stats ─────────────────────────────────────────────────────────────────────
router.get("/auth/stats", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const [postCount] = await db.select({ count: count() }).from(postsTable).where(eq(postsTable.user_id, userId));
    const [friendCount] = await db.select({ count: count() }).from(friendshipsTable).where(
      and(
        or(eq(friendshipsTable.requester_id, userId), eq(friendshipsTable.receiver_id, userId)),
        eq(friendshipsTable.status, "accepted")
      )
    );
    res.json({ posts: postCount?.count ?? 0, friends: friendCount?.count ?? 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

// ── Update profile ────────────────────────────────────────────────────────────
router.patch("/auth/profile", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { display_name, bio, avatar_url } = req.body;
    const updates: Record<string, unknown> = {};
    if (display_name !== undefined) updates.display_name = String(display_name).trim();
    if (bio !== undefined) updates.bio = String(bio).trim();
    if (avatar_url !== undefined) updates.avatar_url = avatar_url || null;
    if (Object.keys(updates).length === 0) { res.status(400).json({ error: "Nincs módosítandó adat" }); return; }
    const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, userId)).returning({
      id: usersTable.id, username: usersTable.username, display_name: usersTable.display_name,
      email: usersTable.email, bio: usersTable.bio, avatar_url: usersTable.avatar_url,
      is_public: usersTable.is_public, notifications_enabled: usersTable.notifications_enabled,
      created_at: usersTable.created_at,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

// ── Change password ───────────────────────────────────────────────────────────
router.post("/auth/change-password", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) { res.status(400).json({ error: "Minden mező kötelező" }); return; }
    if (String(new_password).length < 6) { res.status(400).json({ error: "Az új jelszónak legalább 6 karakter hosszúnak kell lennie" }); return; }
    const [user] = await db.select({ password_hash: usersTable.password_hash }).from(usersTable).where(eq(usersTable.id, userId));
    if (!user) { res.status(404).json({ error: "Felhasználó nem található" }); return; }
    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) { res.status(401).json({ error: "Jelenlegi jelszó helytelen" }); return; }
    const password_hash = await bcrypt.hash(new_password, 10);
    await db.update(usersTable).set({ password_hash }).where(eq(usersTable.id, userId));
    res.json({ message: "Jelszó sikeresen megváltoztatva" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

// ── Update settings ───────────────────────────────────────────────────────────
router.patch("/auth/settings", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { is_public, notifications_enabled } = req.body;
    const updates: Record<string, unknown> = {};
    if (is_public !== undefined) updates.is_public = Boolean(is_public);
    if (notifications_enabled !== undefined) updates.notifications_enabled = Boolean(notifications_enabled);
    if (Object.keys(updates).length === 0) { res.status(400).json({ error: "Nincs módosítandó adat" }); return; }
    const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, userId)).returning({
      is_public: usersTable.is_public,
      notifications_enabled: usersTable.notifications_enabled,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

export default router;
export { JWT_SECRET };
