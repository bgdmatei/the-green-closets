import { cache } from "react";

import { posts } from "@/features/blog/data/posts";
import type { BlogCategory, BlogPost } from "@/features/blog/types/blog.types";
import type { Locale } from "@/lib/i18n";

/**
 * Returns all posts for a locale sorted by newest first.
 */
export const getPosts = cache(async (): Promise<BlogPost[]> => {
  const filtered = posts
    .toSorted((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  return filtered;
});

/**
 * Returns one post by slug and locale.
 */
export const getPostBySlug = cache(async (locale: Locale, slug: string): Promise<BlogPost | null> => {
  const post = posts.find((item) => item.locale === locale && item.slug === slug);
  return post ?? null;
});

/**
 * Returns all categories that have posts for a locale.
 */
export const getCategoriesByLocale = cache(async (locale: Locale): Promise<BlogCategory[]> => {
  const localePosts = await getPosts();
  const map = new Map<string, BlogCategory>();

  for (const post of localePosts) {
    if (!map.has(post.categorySlug)) {
      map.set(post.categorySlug, {
        slug: post.categorySlug,
        locale,
        name: post.categoryName,
      });
    }
  }

  return [...map.values()];
});

/**
 * Returns posts belonging to a category for a locale.
 */
export const getPostsByCategory = cache(
  async (locale: Locale, categorySlug: string): Promise<BlogPost[]> => {
    const localePosts = await getPosts();
    return localePosts.filter((post) => post.categorySlug === categorySlug);
  }
);
