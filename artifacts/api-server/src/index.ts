import app from "./app";
import { logger } from "./lib/logger";
import { db, trailsTable } from "@workspace/db";
import { seedTrails } from "@workspace/db/seed-trails";
import { count } from "drizzle-orm";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function autoSeedIfEmpty() {
  try {
    const [{ value }] = await db.select({ value: count() }).from(trailsTable);
    if (value === 0) {
      logger.info("Trails table is empty — seeding trail data...");
      await seedTrails();
      logger.info("Trail seeding complete");
    }
  } catch (err) {
    logger.warn({ err }, "Auto-seed check failed, continuing without seed");
  }
}

autoSeedIfEmpty().then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
});
