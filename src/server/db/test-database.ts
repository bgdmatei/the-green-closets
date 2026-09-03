import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

import * as schema from "./schema";

/**
 * A real Postgres for tests, compiled to WebAssembly and run in-process.
 *
 * This executes the same migration SQL that production will, against the same
 * engine, with no database server to install or clean up. Anything these tests
 * prove about the schema — constraints, enums, foreign keys, indexes — holds
 * for Neon too.
 */
export const createTestDatabase = async () => {
  const client = new PGlite();
  const db = drizzle(client, { schema });

  const migrationsDir = path.join(process.cwd(), "drizzle");
  const files = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = readFileSync(path.join(migrationsDir, file), "utf8");
    // drizzle-kit separates statements with this marker; PGlite's exec runs a
    // whole script, but splitting keeps failures pinned to one statement.
    for (const statement of sql.split("--> statement-breakpoint")) {
      const trimmed = statement.trim();
      if (trimmed) await client.exec(trimmed);
    }
  }

  return { db, client };
};
