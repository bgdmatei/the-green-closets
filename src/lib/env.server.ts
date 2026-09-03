import "server-only";

import { z } from "zod";

/**
 * Server-only environment.
 *
 * Split from `env.ts` deliberately: that module is safe to import anywhere,
 * this one holds secrets. The `server-only` import makes importing it from a
 * client component a build error rather than a silent leak into the bundle,
 * and it is the only place `process.env` is read for a secret.
 *
 * Validated in independent groups, not as one object. Prerendering needs the
 * database but knows nothing about OAuth, so a build must not fail for want of
 * a GitHub client secret. Each group is checked only when something actually
 * needs it.
 */

const parse = <T extends z.ZodTypeAny>(
  schema: T,
  input: unknown,
  label: string,
): z.infer<T> => {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new Error(
      `Invalid ${label} environment: ${result.error.issues
        .map((issue) => `${issue.path.join(".")} — ${issue.message}`)
        .join("; ")}`,
    );
  }

  return result.data;
};

const databaseEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (value) =>
        value.startsWith("postgres://") || value.startsWith("postgresql://"),
      "DATABASE_URL must be a PostgreSQL connection string",
    ),
});

const authEnvSchema = z.object({
  GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),
  /**
   * The single GitHub account permitted to sign in to the backoffice.
   *
   * Without this, anyone with a GitHub account could complete the OAuth flow
   * and be issued an admin session — OAuth proves who someone is, not that they
   * are allowed in. This is the authorization half.
   */
  ADMIN_GITHUB_LOGIN: z.string().min(1, "ADMIN_GITHUB_LOGIN is required"),
});

export type DatabaseEnv = z.infer<typeof databaseEnvSchema>;
export type AuthEnv = z.infer<typeof authEnvSchema>;

let cachedDatabaseEnv: DatabaseEnv | null = null;
let cachedAuthEnv: AuthEnv | null = null;

/** Read lazily so importing this module never requires the variables. */
export const getDatabaseEnv = (): DatabaseEnv => {
  cachedDatabaseEnv ??= parse(
    databaseEnvSchema,
    { DATABASE_URL: process.env.DATABASE_URL },
    "database",
  );
  return cachedDatabaseEnv;
};

export const getAuthEnv = (): AuthEnv => {
  cachedAuthEnv ??= parse(
    authEnvSchema,
    {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
      ADMIN_GITHUB_LOGIN: process.env.ADMIN_GITHUB_LOGIN,
    },
    "auth",
  );
  return cachedAuthEnv;
};
