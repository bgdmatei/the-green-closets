import "server-only";

import { and, asc, desc, eq, type SQL } from "drizzle-orm";

import type { BlogCategory, BlogPost } from "@/features/blog/types/blog.types";
import type { ArticleType } from "@/features/blog/types/blog.types";
import { categories, posts } from "./schema";
import type { Database } from "./client";

/**
 * Reads for the public site.
 *
 * Every function here filters to published posts. Draft visibility is not a
 * flag a caller may pass — a reader-facing query must not be able to leak an
 * unpublished post by accident. The backoffice will get its own module whose
 * functions verify a session first.
 *
 * The database is the boundary: rows are mapped to the `BlogPost` shape the
 * components already consume, so nothing above this layer learns that posts
 * moved out of a TypeScript file.
 */

/** Column list shared by every post read, so the row shape is defined once. */
const postSelection = {
  slug: posts.slug,
  title: posts.title,
  excerpt: posts.excerpt,
  content: posts.content,
  type: posts.type,
  publishedAt: posts.publishedAt,
  categorySlug: categories.slug,
  categoryName: categories.name,
};

type PostSelectionRow = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  type: ArticleType;
  publishedAt: Date | null;
  categorySlug: string;
  categoryName: string;
};

/**
 * A published post always has a date; the column is nullable only because
 * drafts have none, and drafts never reach this mapper.
 */
const toBlogPost = (row: PostSelectionRow): BlogPost => ({
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  content: row.content,
  type: row.type,
  categorySlug: row.categorySlug,
  categoryName: row.categoryName,
  publishedAt: (row.publishedAt ?? new Date(0)).toISOString().slice(0, 10),
});

/**
 * The published-posts query, with any extra condition folded into the single
 * `where` — Drizzle's builder takes one, so callers cannot chain a second.
 * That also makes the published filter impossible to drop by accident: it is
 * always ANDed in here rather than being the caller's responsibility.
 */
const publishedPosts = (db: Database, extra?: SQL) =>
  db
    .select(postSelection)
    .from(posts)
    .innerJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.status, "published"), extra));

export const findPublishedPosts = async (
  db: Database,
): Promise<BlogPost[]> => {
  const rows = await publishedPosts(db).orderBy(desc(posts.publishedAt));
  return rows.map(toBlogPost);
};

export const findPublishedPostBySlug = async (
  db: Database,
  slug: string,
): Promise<BlogPost | null> => {
  const rows = await publishedPosts(db, eq(posts.slug, slug)).limit(1);
  return rows.length > 0 ? toBlogPost(rows[0]) : null;
};

export const findPublishedPostsByCategory = async (
  db: Database,
  categorySlug: string,
): Promise<BlogPost[]> => {
  const rows = await publishedPosts(db, eq(categories.slug, categorySlug))
    .orderBy(desc(posts.publishedAt));
  return rows.map(toBlogPost);
};

/**
 * Only categories that actually have a published post, so the journal never
 * links to an empty listing.
 */
export const findCategoriesWithPublishedPosts = async (
  db: Database,
): Promise<BlogCategory[]> => {
  const rows = await db
    .selectDistinct({ slug: categories.slug, name: categories.name })
    .from(categories)
    .innerJoin(posts, eq(posts.categoryId, categories.id))
    .where(eq(posts.status, "published"))
    .orderBy(asc(categories.name));

  return rows;
};

export const findCategoryBySlug = async (
  db: Database,
  slug: string,
): Promise<BlogCategory | null> => {
  const all = await findCategoriesWithPublishedPosts(db);
  return all.find((category) => category.slug === slug) ?? null;
};
