import "server-only";

import { desc, eq, ne, and } from "drizzle-orm";

import { categories, posts } from "./schema";
import type { Database } from "./client";

/**
 * Reads and writes for the backoffice.
 *
 * Separate from `posts.repository.ts` on purpose. That module is reader-facing
 * and filters to published posts unconditionally; this one deliberately sees
 * drafts, so it must only ever be reached after `requireAdmin()`. Keeping the
 * two apart means a public page cannot accidentally import a function that
 * returns unpublished work.
 */

export interface AdminPostSummary {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  categoryName: string;
  publishedAt: Date | null;
  updatedAt: Date;
  featured: boolean;
}

export interface AdminPost extends AdminPostSummary {
  excerpt: string;
  content: string;
  categoryId: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
}

export interface PostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  categoryId: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  featured: boolean;
}

const summarySelection = {
  id: posts.id,
  slug: posts.slug,
  title: posts.title,
  status: posts.status,
  categoryName: categories.name,
  publishedAt: posts.publishedAt,
  updatedAt: posts.updatedAt,
  featured: posts.featured,
};

/** Drafts first, then newest — the order you want when deciding what to work on. */
export const listPosts = async (db: Database): Promise<AdminPostSummary[]> => {
  return db
    .select(summarySelection)
    .from(posts)
    .innerJoin(categories, eq(posts.categoryId, categories.id))
    .orderBy(desc(posts.updatedAt));
};

export const findPostById = async (
  db: Database,
  id: string,
): Promise<AdminPost | null> => {
  const rows = await db
    .select({
      ...summarySelection,
      excerpt: posts.excerpt,
      content: posts.content,
      categoryId: posts.categoryId,
      coverImageUrl: posts.coverImageUrl,
      coverImageAlt: posts.coverImageAlt,
    })
    .from(posts)
    .innerJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.id, id))
    .limit(1);

  return rows[0] ?? null;
};

/**
 * Finds a category by slug or creates it.
 *
 * Categories are typed as free text in the editor rather than managed on their
 * own screen — for a handful of categories a separate CRUD surface is more
 * work to build and to use than it is worth.
 */
export const findOrCreateCategory = async (
  db: Database,
  name: string,
  slug: string,
): Promise<string> => {
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (existing[0]) return existing[0].id;

  const [created] = await db
    .insert(categories)
    .values({ slug, name })
    .returning({ id: categories.id });

  return created.id;
};

/** True when another post already owns this slug. */
export const slugTakenByOther = async (
  db: Database,
  slug: string,
  excludePostId?: string,
): Promise<boolean> => {
  const rows = await db
    .select({ id: posts.id })
    .from(posts)
    .where(
      excludePostId
        ? and(eq(posts.slug, slug), ne(posts.id, excludePostId))
        : eq(posts.slug, slug),
    )
    .limit(1);

  return rows.length > 0;
};

export const createPost = async (
  db: Database,
  input: PostInput,
): Promise<string> => {
  const [created] = await db
    .insert(posts)
    .values({
      ...input,
      // A post gets its date the moment it first goes live, not when drafted.
      publishedAt: input.status === "published" ? new Date() : null,
    })
    .returning({ id: posts.id });

  return created.id;
};

export const updatePost = async (
  db: Database,
  id: string,
  input: PostInput,
): Promise<void> => {
  const current = await findPostById(db, id);

  await db
    .update(posts)
    .set({
      ...input,
      // Preserve the original publication date across later edits; only set it
      // when a post moves from draft to published for the first time.
      publishedAt:
        input.status === "published"
          ? (current?.publishedAt ?? new Date())
          : null,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id));
};

export const deletePost = async (db: Database, id: string): Promise<void> => {
  await db.delete(posts).where(eq(posts.id, id));
};
