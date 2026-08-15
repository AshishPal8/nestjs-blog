import { pgTable, integer, date, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const userStats = pgTable("user_stats", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  totalPoints: integer("total_points").default(0).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastActiveDate: date("last_active_date"),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UserStats = typeof userStats.$inferSelect;
export type NewUserStats = typeof userStats.$inferInsert;
