import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as userSchema from "./schema/user.schema";
import * as postsSchema from "./schema/posts.schema";
import * as tagsSchema from "./schema/tags.schema";
import * as postTagsSchema from "./schema/post-tags.schema";

import { envConfig } from "src/config/env.config";

const connectionString = envConfig.database.url;
const client = postgres(connectionString);

export const db = drizzle(client, {
  schema: {
    ...userSchema,
    ...postsSchema,
    ...tagsSchema,
    ...postTagsSchema,
  },
});
