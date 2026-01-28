import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema/user.schema";
import { envConfig } from "src/config/env.config";

const connectionString = envConfig.database.url;
const client = postgres(connectionString);

export const db = drizzle(client, { schema });
