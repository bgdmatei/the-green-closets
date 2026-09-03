import "server-only";

import { z } from "zod";

/**
 * Server-only environment.
 *
 * Split from `env.ts` deliberately: that module is safe to import anywhere,
 * this one holds secrets. The `server-only` import makes importing it from a
 * client component a build error rather than a silent leak into the bundle,
 * and it is the only place `process.env` is read for a secret.
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (value) => value.startsWith("postgres://") || value.startsWith("postgresql://"),
      "DATABASE_URL must be a PostgreSQL connection string",
    ),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

/**
 * Validates and returns the server environment, failing fast and loudly.
 *
 * Read lazily rather than at module load so that importing this file — during a
 * build that does not touch the database, for instance — does not require the
 * variable to be present.
 */
export const getServerEnv = (): ServerEnv => {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment: ${parsed.error.issues
        .map((issue) => `${issue.path.join(".")} — ${issue.message}`)
        .join("; ")}`,
    );
  }

  cached = parsed.data;
  return cached;
};
