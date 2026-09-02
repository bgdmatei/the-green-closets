import type { MetadataRoute } from "next";

import { getCategories, getPosts } from "@/features/blog/api/blog.services";
import { getEnv } from "@/lib/env";

/**
 * Generates sitemap entries for the homepage, categories and blog detail pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { NEXT_PUBLIC_SITE_URL: baseUrl } = getEnv();

  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/articles/${post.slug}`,
      lastModified: new Date(`${post.publishedAt}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
