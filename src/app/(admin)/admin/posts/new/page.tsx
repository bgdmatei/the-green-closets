import type { Metadata } from "next";

import { createPostAction } from "@/features/admin/actions/post.actions";
import { PostForm } from "@/features/admin/components/post-form";
import { requireAdminOrRedirect } from "@/server/auth/dal";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  await requireAdminOrRedirect("/admin/posts/new");

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      <h1 className="text-step-3 font-normal text-ink">New post</h1>

      <PostForm action={createPostAction} submitLabel="Create post" />
    </main>
  );
}
