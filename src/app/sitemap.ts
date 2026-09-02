import type { MetadataRoute } from "next";

import { getPosts } from "@/features/blog/api/blog.services";
import { getEnv } from "@/lib/env";

/**
 * Generates sitemap entries for the homepage and blog detail pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const env = getEnv();
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  const posts = await getPosts();

  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/articles/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...postEntries,
  ];
}
