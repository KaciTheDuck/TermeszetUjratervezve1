import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  image_url: text("image_url"),
  trail_name: text("trail_name"),
  created_at: timestamp("created_at").defaultNow(),
});

export const likesTable = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    post_id: integer("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow(),
  },
  (t) => [unique().on(t.user_id, t.post_id)]
);

export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  post_id: integer("post_id")
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const friendshipsTable = pgTable("friendships", {
  id: serial("id").primaryKey(),
  requester_id: integer("requester_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  receiver_id: integer("receiver_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"),
  created_at: timestamp("created_at").defaultNow(),
});

export type Post = typeof postsTable.$inferSelect;
export type Like = typeof likesTable.$inferSelect;
export type Comment = typeof commentsTable.$inferSelect;
export type Friendship = typeof friendshipsTable.$inferSelect;
