import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  deletePostAction,
  updatePostAction,
} from "@/features/admin/actions/post.actions";
import { PostForm } from "@/features/admin/components/post-form";
import { requireAdminOrRedirect } from "@/server/auth/dal";
import { getDb } from "@/server/db/client";
import { findPostById } from "@/server/db/posts.admin.repository";

export const metadata: Metadata = { title: "Edit post" };
export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  await requireAdminOrRedirect(`/admin/posts/${id}`);

  const post = await findPostById(getDb(), id);
  if (!post) notFound();

  // The action needs the id, which the form does not carry — bind it here
  // rather than putting it in a hidden field a caller could change.
  const action = updatePostAction.bind(null, post.id);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-step--2 uppercase tracking-[0.1em] text-ink-muted">
            Backoffice
          </p>
          <h1 className="mt-3 text-step-3 font-normal text-ink">Edit post</h1>
        </div>
        {post.status === "published" ? (
          <Link
            href={`/articles/${post.slug}`}
            className="text-step-0 text-ink-muted hover:text-ink"
          >
            View live &rarr;
          </Link>
        ) : null}
      </div>

      <PostForm
        action={action}
        submitLabel="Save changes"
        initial={{
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          type: post.type,
          status: post.status,
          categoryName: post.categoryName,
        }}
      />

      <form action={deletePostAction} className="mt-12 border-t border-border pt-6">
        <input type="hidden" name="postId" value={post.id} />
        <button
          type="submit"
          className="h-9 border border-border px-4 text-step-0 text-ink-muted transition-colors hover:border-ink hover:text-ink"
        >
          Delete this post
        </button>
      </form>
    </main>
  );
}
