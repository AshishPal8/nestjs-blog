import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as userSchema from "./schema/user.schema";
import * as postsSchema from "./schema/posts.schema";
import * as tagsSchema from "./schema/tags.schema";
import * as postTagsSchema from "./schema/post-tags.schema";
import * as activitySchema from "./schema/activity.schema";
import * as userStatsSchema from "./schema/user-stats.schema";
import * as quizzesSchema from "./schema/quizzes.schema";
import * as quizQuestionsSchema from "./schema/quiz-questions.schema";
import * as quizAttemptsSchema from "./schema/quiz-attempts.schema";
import * as quizAttemptSessionsSchema from "./schema/quiz-attempt-sessions.schema";
import * as flashcardDecksSchema from "./schema/flashcard-decks.schema";
import * as flashcardCardsSchema from "./schema/flashcard-cards.schema";
import * as flashcardAttemptsSchema from "./schema/flashcard-attempts.schema";

import { envConfig } from "src/config/env.config";

const connectionString = envConfig.database.url;
const client = postgres(connectionString);

export const db = drizzle(client, {
  schema: {
    ...userSchema,
    ...postsSchema,
    ...tagsSchema,
    ...postTagsSchema,
    ...activitySchema,
    ...userStatsSchema,
    ...quizzesSchema,
    ...quizQuestionsSchema,
    ...quizAttemptsSchema,
    ...quizAttemptSessionsSchema,
    ...flashcardDecksSchema,
    ...flashcardCardsSchema,
    ...flashcardAttemptsSchema,
  },
});
