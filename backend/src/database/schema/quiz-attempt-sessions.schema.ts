import {
  pgTable,
  serial,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { quizzes } from "./quizzes.schema";
import { users } from "./user.schema";

export const quizAttemptSessions = pgTable(
  "quiz_attempt_sessions",
  {
    id: serial("id").primaryKey(),

    quizId: integer("quiz_id")
      .references(() => quizzes.id, { onDelete: "cascade" })
      .notNull(),

    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    startedAt: timestamp("started_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"),
    consumedAt: timestamp("consumed_at"),
  },
  (table) => ({
    quizUserIdx: index("quiz_attempt_sessions_quiz_user_idx").on(
      table.quizId,
      table.userId,
    ),
  }),
);

export type QuizAttemptSession = typeof quizAttemptSessions.$inferSelect;
export type NewQuizAttemptSession = typeof quizAttemptSessions.$inferInsert;
