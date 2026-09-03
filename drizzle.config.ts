import { defineConfig } from "drizzle-kit";

/**
 * Load `.env.local` for command-line use.
 *
 * Next.js loads it automatically for the app, but drizzle-kit and the seed
 * script are plain Node processes and do not. `loadEnvFile` is built in, so
 * this needs no dependency; it is optional because CI supplies the variable
 * through the real environment instead.
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  // No local env file — rely on the ambient environment.
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Only needed for `drizzle-kit push`/`studio`; `generate` works without it.
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
