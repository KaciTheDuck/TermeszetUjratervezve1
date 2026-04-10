import pg from "pg";

const { Client } = pg;

const devUrl = process.env.DATABASE_URL;
const prodUrl = process.env.PROD_DATABASE_URL;

if (!devUrl) throw new Error("DATABASE_URL not set");
if (!prodUrl) throw new Error("PROD_DATABASE_URL not set");

const dev = new Client({ connectionString: devUrl });
const prod = new Client({ connectionString: prodUrl });

await dev.connect();
await prod.connect();

console.log("Connected to both databases");

const { rows: trails } = await dev.query("SELECT * FROM trails ORDER BY id");
console.log(`Found ${trails.length} trails in development`);

const { rows: prodTrails } = await prod.query("SELECT COUNT(*) as count FROM trails");
console.log(`Production currently has ${prodTrails[0].count} trails`);

if (trails.length === 0) {
  console.log("No trails to migrate");
  await dev.end();
  await prod.end();
  process.exit(0);
}

await prod.query("BEGIN");

try {
  for (const trail of trails) {
    await prod.query(
      `INSERT INTO trails 
        (id, name, location, description, distance, elevation, difficulty, duration,
         start_lat, start_lon, end_lat, end_lon, coordinates, points_of_interest, tags, image_url, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         location = EXCLUDED.location,
         description = EXCLUDED.description,
         distance = EXCLUDED.distance,
         elevation = EXCLUDED.elevation,
         difficulty = EXCLUDED.difficulty,
         duration = EXCLUDED.duration,
         start_lat = EXCLUDED.start_lat,
         start_lon = EXCLUDED.start_lon,
         end_lat = EXCLUDED.end_lat,
         end_lon = EXCLUDED.end_lon,
         coordinates = EXCLUDED.coordinates,
         points_of_interest = EXCLUDED.points_of_interest,
         tags = EXCLUDED.tags,
         image_url = EXCLUDED.image_url`,
      [
        trail.id, trail.name, trail.location, trail.description,
        trail.distance, trail.elevation, trail.difficulty, trail.duration,
        trail.start_lat, trail.start_lon, trail.end_lat, trail.end_lon,
        trail.coordinates ? JSON.stringify(trail.coordinates) : null,
        trail.points_of_interest ? JSON.stringify(trail.points_of_interest) : null,
        trail.tags, trail.image_url, trail.created_at,
      ]
    );
  }

  // Sync the sequence so future inserts don't conflict
  const maxId = Math.max(...trails.map((t) => t.id));
  await prod.query(`SELECT setval(pg_get_serial_sequence('trails', 'id'), $1)`, [maxId]);

  await prod.query("COMMIT");
  console.log(`Successfully migrated ${trails.length} trails to production`);
} catch (err) {
  await prod.query("ROLLBACK");
  console.error("Migration failed, rolled back:", err.message);
  process.exit(1);
}

await dev.end();
await prod.end();
