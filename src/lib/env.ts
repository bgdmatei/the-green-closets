import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  /**
   * Cloudinary account name our own photography is served from. Optional: a
   * deploy without our own photography can leave this unset, which just omits
   * Cloudinary from the image optimizer's allow-list.
   */
  NEXT_PUBLIC_CLOUDINARY_ACCOUNT: z.string().min(1).optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

/**
 * Validates and returns required public environment variables.
 */
export const getEnv = (): AppEnv => {
  return envSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CLOUDINARY_ACCOUNT: process.env.NEXT_PUBLIC_CLOUDINARY_ACCOUNT,
  });
};
