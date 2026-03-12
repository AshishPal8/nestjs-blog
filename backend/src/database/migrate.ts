import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool);

async function main() {
  console.log("Running migrations...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations done!");
  } catch (error: any) {
    if (error?.message?.includes("already exists")) {
      console.log("Tables already exist, skipping...");
    } else {
      throw error;
    }
  } finally {
    await pool.end();
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Error running migrations:", err);
  process.exit(1);
});
