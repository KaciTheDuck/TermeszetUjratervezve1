import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  display_name: text("display_name").notNull(),
  bio: text("bio").default(""),
  avatar_url: text("avatar_url"),
  is_public: boolean("is_public").default(true).notNull(),
  notifications_enabled: boolean("notifications_enabled").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
