import type { MetadataRoute } from "next";

import { getCategories, getPosts } from "@/features/blog/api/blog.services";
import { getBrands } from "@/features/shop/api/shop.services";
import { getEnv } from "@/lib/env";

/**
 * Generates sitemap entries for every prerendered route.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { NEXT_PUBLIC_SITE_URL: baseUrl } = getEnv();
  const now = new Date();

  const [posts, categories, brands] = await Promise.all([
    getPosts(),
    getCategories(),
    getBrands(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: baseUrl, changeFrequency: "daily", priority: 1 },
      { url: `${baseUrl}/shop`, changeFrequency: "daily", priority: 0.9 },
      { url: `${baseUrl}/week-picks`, changeFrequency: "weekly", priority: 0.8 },
      { url: `${baseUrl}/journal`, changeFrequency: "weekly", priority: 0.8 },
      { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.4 },
    ] as const
  ).map((entry) => ({ ...entry, lastModified: now }));

  return [
    ...staticRoutes,
    ...brands.map((brand) => ({
      url: `${baseUrl}/brands/${brand.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/articles/${post.slug}`,
      lastModified: new Date(`${post.publishedAt}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
