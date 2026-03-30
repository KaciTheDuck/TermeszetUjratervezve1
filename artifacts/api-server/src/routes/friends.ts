import { Router, type IRouter } from "express";
import { db, friendshipsTable, usersTable } from "@workspace/db";
import { eq, or, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middleware/auth";

const router: IRouter = Router();

router.get("/friends", requireAuth, async (req: AuthRequest, res) => {
  try {
    const rows = await db
      .select({
        id: friendshipsTable.id,
        status: friendshipsTable.status,
        requester_id: friendshipsTable.requester_id,
        receiver_id: friendshipsTable.receiver_id,
        created_at: friendshipsTable.created_at,
      })
      .from(friendshipsTable)
      .where(
        or(
          eq(friendshipsTable.requester_id, req.userId!),
          eq(friendshipsTable.receiver_id, req.userId!)
        )
      );

    const enriched = await Promise.all(
      rows.map(async (r) => {
        const otherId = r.requester_id === req.userId ? r.receiver_id : r.requester_id;
        const [other] = await db
          .select({ id: usersTable.id, username: usersTable.username, display_name: usersTable.display_name, avatar_url: usersTable.avatar_url })
          .from(usersTable)
          .where(eq(usersTable.id, otherId));
        return { ...r, other_user: other };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.post("/friends/request", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { receiver_id } = req.body;
    if (!receiver_id || receiver_id === req.userId) {
      res.status(400).json({ error: "Érvénytelen kérés" });
      return;
    }
    const existing = await db
      .select()
      .from(friendshipsTable)
      .where(
        or(
          and(eq(friendshipsTable.requester_id, req.userId!), eq(friendshipsTable.receiver_id, receiver_id)),
          and(eq(friendshipsTable.requester_id, receiver_id), eq(friendshipsTable.receiver_id, req.userId!))
        )
      );
    if (existing.length > 0) {
      res.status(409).json({ error: "Már létezik kapcsolat" });
      return;
    }
    const [friendship] = await db.insert(friendshipsTable).values({ requester_id: req.userId!, receiver_id }).returning();
    res.status(201).json(friendship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.post("/friends/:id/accept", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [f] = await db.select().from(friendshipsTable).where(eq(friendshipsTable.id, id));
    if (!f || f.receiver_id !== req.userId) { res.status(403).json({ error: "Nincs jogosultság" }); return; }
    await db.update(friendshipsTable).set({ status: "accepted" }).where(eq(friendshipsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.post("/friends/:id/reject", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(friendshipsTable).where(eq(friendshipsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.get("/users/search", requireAuth, async (req: AuthRequest, res) => {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q || q.length < 2) { res.json([]); return; }
    const { ilike } = await import("drizzle-orm");
    const users = await db
      .select({ id: usersTable.id, username: usersTable.username, display_name: usersTable.display_name, avatar_url: usersTable.avatar_url })
      .from(usersTable)
      .where(ilike(usersTable.username, `%${q}%`))
      .limit(10);
    res.json(users.filter((u) => u.id !== req.userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

export default router;
