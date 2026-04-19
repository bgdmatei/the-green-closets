import type { MetadataRoute } from "next";

import { getEnv } from "@/lib/env";

/**
 * Returns robots directives for indexing public pages.
 */
export default function robots(): MetadataRoute.Robots {
  const env = getEnv();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
