import {
  boolean,
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),

  isActive: boolean("is_active").default(true),
  isDeleted: boolean("is_deleted").default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Category = typeof categories.$inferSelect;
