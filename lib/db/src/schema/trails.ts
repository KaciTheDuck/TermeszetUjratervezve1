import {
  pgTable,
  serial,
  text,
  real,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const trailsTable = pgTable("trails", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull().default(""),
  distance: real("distance").notNull(),
  elevation: integer("elevation").notNull().default(0),
  difficulty: text("difficulty").notNull().default("Közepes"),
  duration: text("duration").notNull().default(""),
  start_lat: real("start_lat"),
  start_lon: real("start_lon"),
  end_lat: real("end_lat"),
  end_lon: real("end_lon"),
  coordinates: jsonb("coordinates").$type<[number, number][]>().default([]),
  points_of_interest: jsonb("points_of_interest")
    .$type<{ name: string; lat: number; lon: number; description?: string }[]>()
    .default([]),
  tags: text("tags").array().default([]),
  image_url: text("image_url"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertTrailSchema = createInsertSchema(trailsTable).omit({
  id: true,
  created_at: true,
});

export const selectTrailSchema = createSelectSchema(trailsTable);

export type Trail = typeof trailsTable.$inferSelect;
export type InsertTrail = typeof trailsTable.$inferInsert;
