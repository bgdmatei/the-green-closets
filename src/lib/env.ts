import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
});

export type AppEnv = z.infer<typeof envSchema>;

/**
 * Validates and returns required public environment variables.
 */
export const getEnv = (): AppEnv => {
  return envSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
};
