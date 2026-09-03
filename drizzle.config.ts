import { defineConfig } from "drizzle-kit";

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
