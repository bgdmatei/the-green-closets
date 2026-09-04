import "server-only";

import { cache } from "react";

import type { BlogCategory, BlogPost } from "@/features/blog/types/blog.types";
import { getDb } from "@/server/db/client";
import {
  findCategoriesWithPublishedPosts,
  findFeaturedPosts,
  findCategoryBySlug,
  findPublishedPostBySlug,
  findPublishedPosts,
  findPublishedPostsByCategory,
} from "@/server/db/posts.repository";

/**
 * The public site's view of the blog.
 *
 * Every page reads through here, so this is the only place that knows posts
 * live in Postgres. The repository beneath it filters to published posts
 * unconditionally, which is why nothing in this module takes a "include drafts"
 * flag — a reader-facing path must not be able to ask for one.
 *
 * `cache` is React's per-request memo: several components call `getPosts` while
 * rendering one page, and this collapses those into a single query. It is not a
 * persistent cache — pages are prerendered, and a publish invalidates them
 * explicitly.
 */

/** Published posts flagged to appear on the front page. */
export const getFeaturedPosts = cache(
  async (limit = 2): Promise<BlogPost[]> => {
    return findFeaturedPosts(getDb(), limit);
  },
);

export const getPosts = cache(async (): Promise<BlogPost[]> => {
  return findPublishedPosts(getDb());
});

export const getPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    return findPublishedPostBySlug(getDb(), slug);
  },
);

export const getCategories = cache(async (): Promise<BlogCategory[]> => {
  return findCategoriesWithPublishedPosts(getDb());
});

export const getCategoryBySlug = cache(
  async (slug: string): Promise<BlogCategory | null> => {
    return findCategoryBySlug(getDb(), slug);
  },
);

export const getPostsByCategory = cache(
  async (categorySlug: string): Promise<BlogPost[]> => {
    return findPublishedPostsByCategory(getDb(), categorySlug);
  },
);
