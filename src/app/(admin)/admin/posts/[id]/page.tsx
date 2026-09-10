import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  deletePostAction,
  updatePostAction,
} from "@/features/admin/actions/post.actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PostForm } from "@/features/admin/components/post-form";
import { requireAdminOrRedirect } from "@/server/auth/dal";
import { getDb } from "@/server/db/client";
import { findPostById } from "@/server/db/posts.admin.repository";

export const metadata: Metadata = { title: "Edit post" };

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
      <h1 className="text-step-3 font-normal text-ink">Edit post</h1>

      <PostForm
        action={action}
        submitLabel="Save changes"
        initial={{
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
          categoryName: post.categoryName,
          coverImageUrl: post.coverImageUrl,
          coverImageAlt: post.coverImageAlt,
          featured: post.featured,
        }}
      />

      <div className="mt-12 border-t border-border pt-6">
        <ConfirmDialog
          trigger="Delete this post"
          title="Delete this post?"
          description={`"${post.title}" will be removed from the journal and any link to it will stop working. This cannot be undone.`}
          confirmLabel="Delete post"
          action={deletePostAction}
          field={{ name: "postId", value: post.id }}
        />
      </div>
    </main>
  );
}
