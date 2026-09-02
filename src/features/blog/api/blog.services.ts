import { cache } from "react";

import { posts } from "@/features/blog/data/posts";
import type { BlogCategory, BlogPost } from "@/features/blog/types/blog.types";

/**
 * Returns all posts sorted by newest first.
 */
export const getPosts = cache(async (): Promise<BlogPost[]> => {
  const filtered = posts.toSorted(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
  return filtered;
});

/**
 * Returns one post by slug.
 */
export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const post = posts.find((item) => item.slug === slug);
  return post ?? null;
});

/**
 * Returns all categories that have posts.
 */
export const getCategories = cache(async (): Promise<BlogCategory[]> => {
  const allPosts = await getPosts();
  const map = new Map<string, BlogCategory>();

  for (const post of allPosts) {
    if (!map.has(post.categorySlug)) {
      map.set(post.categorySlug, {
        slug: post.categorySlug,
        name: post.categoryName,
      });
    }
  }

  return [...map.values()];
});

/**
 * Returns posts belonging to a category.
 */
export const getPostsByCategory = cache(
  async (categorySlug: string): Promise<BlogPost[]> => {
    const allPosts = await getPosts();
    return allPosts.filter((post) => post.categorySlug === categorySlug);
  },
);
