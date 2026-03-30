import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET ?? "trails-dev-secret";

router.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password, display_name } = req.body;
    if (!username || !email || !password || !display_name) {
      res.status(400).json({ error: "Minden mező kötelező" });
      return;
    }
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, username));
    if (existing.length > 0) {
      res.status(409).json({ error: "A felhasználónév már foglalt" });
      return;
    }
    const existingEmail = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existingEmail.length > 0) {
      res.status(409).json({ error: "Az email cím már regisztrálva van" });
      return;
    }
    const password_hash = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(usersTable)
      .values({ username, email, password_hash, display_name })
      .returning({ id: usersTable.id, username: usersTable.username, display_name: usersTable.display_name, email: usersTable.email, bio: usersTable.bio, avatar_url: usersTable.avatar_url, created_at: usersTable.created_at });
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "30d" });
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Felhasználónév és jelszó kötelező" });
      return;
    }
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));
    if (!user) {
      res.status(401).json({ error: "Hibás felhasználónév vagy jelszó" });
      return;
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "Hibás felhasználónév vagy jelszó" });
      return;
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "30d" });
    const { password_hash: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Nem hitelesített" });
      return;
    }
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: number };
    const [user] = await db
      .select({ id: usersTable.id, username: usersTable.username, display_name: usersTable.display_name, email: usersTable.email, bio: usersTable.bio, avatar_url: usersTable.avatar_url, created_at: usersTable.created_at })
      .from(usersTable)
      .where(eq(usersTable.id, payload.userId));
    if (!user) {
      res.status(404).json({ error: "Felhasználó nem található" });
      return;
    }
    res.json(user);
  } catch {
    res.status(401).json({ error: "Érvénytelen token" });
  }
});

export default router;
export { JWT_SECRET };
