import {
  pgTable,
  serial,
  integer,
  jsonb,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { quizzes } from "./quizzes.schema";
import { users } from "./user.schema";

interface QuizAnswerRecord {
  questionId: number;
  selectedIndex: number;
  correct: boolean;
}

export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id: serial("id").primaryKey(),

    quizId: integer("quiz_id")
      .references(() => quizzes.id, { onDelete: "cascade" })
      .notNull(),

    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    score: integer("score").notNull(),
    totalQuestions: integer("total_questions").notNull(),
    answers: jsonb("answers").$type<QuizAnswerRecord[]>().notNull(),
    pointsEarned: integer("points_earned").default(0).notNull(),

    startedAt: timestamp("started_at"),
    timeTakenSeconds: integer("time_taken_seconds"),
    timedOut: boolean("timed_out").default(false).notNull(),

    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("quiz_attempts_user_id_idx").on(table.userId),
    quizIdIdx: index("quiz_attempts_quiz_id_idx").on(table.quizId),
  }),
);

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type NewQuizAttempt = typeof quizAttempts.$inferInsert;
