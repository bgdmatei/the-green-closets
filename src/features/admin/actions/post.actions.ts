"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { slugify } from "@/features/admin/lib/slug";
import { postInputSchema, readPostForm } from "@/features/admin/lib/post-schema";
import { sanitizeRichHtml } from "@/lib/sanitize-html";
import { renderMarkdown } from "@/lib/markdown";
import { requireAdmin } from "@/server/auth/dal";
import { getDb } from "@/server/db/client";
import {
  createPost,
  deletePost,
  findOrCreateCategory,
  findPostById,
  slugTakenByOther,
  updatePost,
} from "@/server/db/posts.admin.repository";

export interface ActionState {
  error?: string;
}

/**
 * Repaints the pages a post can appear on.
 *
 * Called after every mutation because the public site is prerendered — without
 * this, a published post would not appear until the next full build.
 */
const revalidatePost = (slug: string, categorySlug?: string) => {
  revalidatePath("/");
  revalidatePath("/journal");
  revalidatePath("/sitemap.xml");
  revalidatePath(`/articles/${slug}`);
  if (categorySlug) revalidatePath(`/category/${categorySlug}`);
};

/**
 * Validates a submission and resolves it to database-ready values.
 *
 * The Markdown is rendered and sanitized here purely as a *rejection check* —
 * the result is thrown away. If the body sanitizes to nothing it was entirely
 * markup that will be stripped, and saving it would publish a blank article.
 * The stored value stays the author's Markdown, unmodified.
 */
const parseSubmission = async (formData: FormData, excludePostId?: string) => {
  const parsed = postInputSchema.safeParse(readPostForm(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "That post is not valid" };
  }

  const values = parsed.data;
  const db = getDb();

  if (await slugTakenByOther(db, values.slug, excludePostId)) {
    return { error: `The slug "${values.slug}" is already used by another post` };
  }

  if (sanitizeRichHtml(renderMarkdown(values.content)).trim().length === 0) {
    return { error: "The body is empty once formatting is removed" };
  }

  const categorySlug = slugify(values.categoryName);
  if (!categorySlug) {
    return { error: "That category name cannot be turned into a URL" };
  }

  const categoryId = await findOrCreateCategory(
    db,
    values.categoryName,
    categorySlug,
  );

  return { values, categoryId, categorySlug };
};

export const createPostAction = async (
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  // A Server Action is reachable by direct POST without ever loading a page, so
  // authorization is re-checked here rather than inherited from the form's UI.
  await requireAdmin();

  const result = await parseSubmission(formData);
  if ("error" in result) return result;

  const { values, categoryId, categorySlug } = result;
  await createPost(getDb(), {
    slug: values.slug,
    title: values.title,
    excerpt: values.excerpt,
    content: values.content,
    status: values.status,
    categoryId,
    coverImageUrl: values.coverImageUrl,
    coverImageAlt: values.coverImageAlt,
    featured: values.featured,
  });

  revalidatePost(values.slug, categorySlug);
  redirect("/admin");
};

export const updatePostAction = async (
  postId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();

  const existing = await findPostById(getDb(), postId);
  if (!existing) return { error: "That post no longer exists" };

  const result = await parseSubmission(formData, postId);
  if ("error" in result) return result;

  const { values, categoryId, categorySlug } = result;
  await updatePost(getDb(), postId, {
    slug: values.slug,
    title: values.title,
    excerpt: values.excerpt,
    content: values.content,
    status: values.status,
    categoryId,
    coverImageUrl: values.coverImageUrl,
    coverImageAlt: values.coverImageAlt,
    featured: values.featured,
  });

  // The old slug's page must be repainted too, or a rename leaves the previous
  // URL serving a stale copy of the article.
  revalidatePost(existing.slug);
  revalidatePost(values.slug, categorySlug);
  redirect("/admin");
};

export const deletePostAction = async (formData: FormData): Promise<void> => {
  await requireAdmin();

  const postId = String(formData.get("postId") ?? "");
  const existing = await findPostById(getDb(), postId);
  if (!existing) redirect("/admin");

  await deletePost(getDb(), postId);
  revalidatePost(existing.slug);
  redirect("/admin");
};
