import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const userActivities = pgTable(
  "user_activities",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    type: varchar("type", { length: 50 }).notNull(),

    points: integer("points").default(0).notNull(),

    refType: varchar("ref_type", { length: 50 }),
    refId: integer("ref_id"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdCreatedAtIdx: index("user_activities_user_id_created_at_idx").on(
      table.userId,
      table.createdAt,
    ),
    userIdTypeIdx: index("user_activities_user_id_type_idx").on(
      table.userId,
      table.type,
    ),
  }),
);

export type UserActivity = typeof userActivities.$inferSelect;
export type NewUserActivity = typeof userActivities.$inferInsert;
