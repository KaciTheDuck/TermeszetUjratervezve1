import { Router, type IRouter } from "express";
import { db, postsTable, usersTable, likesTable, commentsTable } from "@workspace/db";
import { eq, desc, sql, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middleware/auth";

const router: IRouter = Router();

router.get("/posts", async (req: AuthRequest, res) => {
  try {
    const authHeader = req.headers.authorization;
    let currentUserId: number | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const jwt = await import("jsonwebtoken");
        const { JWT_SECRET } = await import("./auth");
        const p = jwt.default.verify(authHeader.slice(7), JWT_SECRET) as { userId: number };
        currentUserId = p.userId;
      } catch {}
    }

    const posts = await db
      .select({
        id: postsTable.id,
        content: postsTable.content,
        image_url: postsTable.image_url,
        trail_name: postsTable.trail_name,
        created_at: postsTable.created_at,
        user_id: postsTable.user_id,
        author_username: usersTable.username,
        author_display_name: usersTable.display_name,
        author_avatar_url: usersTable.avatar_url,
        likes_count: sql<number>`(SELECT COUNT(*) FROM likes WHERE likes.post_id = ${postsTable.id})::int`,
        comments_count: sql<number>`(SELECT COUNT(*) FROM comments WHERE comments.post_id = ${postsTable.id})::int`,
        is_liked: currentUserId
          ? sql<boolean>`EXISTS(SELECT 1 FROM likes WHERE likes.post_id = ${postsTable.id} AND likes.user_id = ${currentUserId})`
          : sql<boolean>`false`,
      })
      .from(postsTable)
      .leftJoin(usersTable, eq(postsTable.user_id, usersTable.id))
      .orderBy(desc(postsTable.created_at))
      .limit(50);

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.post("/posts", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { content, image_url, trail_name } = req.body;
    if (!content?.trim()) {
      res.status(400).json({ error: "A szöveg kötelező" });
      return;
    }
    const [post] = await db
      .insert(postsTable)
      .values({ user_id: req.userId!, content: content.trim(), image_url: image_url ?? null, trail_name: trail_name ?? null })
      .returning();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.delete("/posts/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [post] = await db.select({ user_id: postsTable.user_id }).from(postsTable).where(eq(postsTable.id, id));
    if (!post) { res.status(404).json({ error: "Nem található" }); return; }
    if (post.user_id !== req.userId) { res.status(403).json({ error: "Nincs jogosultság" }); return; }
    await db.delete(postsTable).where(eq(postsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.post("/posts/:id/like", requireAuth, async (req: AuthRequest, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const existing = await db.select().from(likesTable).where(
      and(eq(likesTable.user_id, req.userId!), eq(likesTable.post_id, postId))
    );
    if (existing.length > 0) {
      await db.delete(likesTable).where(and(eq(likesTable.user_id, req.userId!), eq(likesTable.post_id, postId)));
      res.json({ liked: false });
    } else {
      await db.insert(likesTable).values({ user_id: req.userId!, post_id: postId });
      res.json({ liked: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.get("/posts/:id/comments", async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const comments = await db
      .select({
        id: commentsTable.id,
        content: commentsTable.content,
        created_at: commentsTable.created_at,
        user_id: commentsTable.user_id,
        author_username: usersTable.username,
        author_display_name: usersTable.display_name,
        author_avatar_url: usersTable.avatar_url,
      })
      .from(commentsTable)
      .leftJoin(usersTable, eq(commentsTable.user_id, usersTable.id))
      .where(eq(commentsTable.post_id, postId))
      .orderBy(commentsTable.created_at);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.post("/posts/:id/comments", requireAuth, async (req: AuthRequest, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const { content } = req.body;
    if (!content?.trim()) { res.status(400).json({ error: "Üres hozzászólás" }); return; }
    const [comment] = await db.insert(commentsTable).values({ user_id: req.userId!, post_id: postId, content: content.trim() }).returning();
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

export default router;
