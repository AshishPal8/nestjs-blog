import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  fileId: varchar("file_id", { length: 255 }).unique().notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 255 }).notNull(),
  size: integer("size").notNull(),
  width: integer("width"),
  height: integer("height"),
  uploadBy: integer("upload_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
