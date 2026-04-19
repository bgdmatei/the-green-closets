import type { MetadataRoute } from "next";

import { getPostsByLocale } from "@/features/blog/api/blog.services";
import { getEnv } from "@/lib/env";
import { locales } from "@/lib/i18n";

/**
 * Generates sitemap entries for locale pages and blog detail pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const env = getEnv();
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;

  const localeEntries = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const postEntries = (
    await Promise.all(
      locales.map(async (locale) => {
        const posts = await getPostsByLocale(locale);
        return posts.map((post) => ({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.publishedAt,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
      })
    )
  ).flat();

  return [...localeEntries, ...postEntries];
}
