import { Router, type IRouter } from "express";
import { db, trailsTable } from "@workspace/db";
import { ilike, or, and, lte, gte, eq, sql } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const querySchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  difficulty: z.string().optional(),
  minDistance: z.coerce.number().optional(),
  maxDistance: z.coerce.number().optional(),
  tags: z.string().optional(),
});

router.get("/trails", async (req, res) => {
  try {
    const query = querySchema.parse(req.query);
    const conditions: ReturnType<typeof ilike>[] = [];

    if (query.name) {
      conditions.push(ilike(trailsTable.name, `%${query.name}%`));
    }
    if (query.location) {
      conditions.push(ilike(trailsTable.location, `%${query.location}%`));
    }
    if (query.difficulty) {
      conditions.push(eq(trailsTable.difficulty, query.difficulty));
    }
    if (query.maxDistance !== undefined) {
      conditions.push(lte(trailsTable.distance, query.maxDistance));
    }
    if (query.minDistance !== undefined) {
      conditions.push(gte(trailsTable.distance, query.minDistance));
    }

    let trails;
    if (conditions.length > 0) {
      trails = await db
        .select()
        .from(trailsTable)
        .where(and(...conditions))
        .orderBy(trailsTable.name);
    } else {
      trails = await db.select().from(trailsTable).orderBy(trailsTable.name);
    }

    if (query.tags) {
      const tagList = query.tags.split(",").map((t) => t.trim().toLowerCase());
      trails = trails.filter((t) =>
        tagList.some((tag) =>
          (t.tags ?? []).map((x) => x.toLowerCase()).includes(tag)
        )
      );
    }

    res.json(trails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.get("/trails/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Érvénytelen azonosító" });
      return;
    }
    const [trail] = await db
      .select()
      .from(trailsTable)
      .where(eq(trailsTable.id, id));

    if (!trail) {
      res.status(404).json({ error: "Túraútvonal nem található" });
      return;
    }
    res.json(trail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

router.post("/trails", async (req, res) => {
  try {
    const [trail] = await db.insert(trailsTable).values(req.body).returning();
    res.status(201).json(trail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

export default router;
