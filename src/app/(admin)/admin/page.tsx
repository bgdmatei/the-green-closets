import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Text } from "@/components/ui/text";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/link";
import { List, ListItem } from "@/components/ui/list";
import { requireAdminOrRedirect } from "@/server/auth/dal";
import { getDb } from "@/server/db/client";
import { listPosts } from "@/server/db/posts.admin.repository";
import { formatPublishedDate } from "@/features/blog/lib/format-date";

export const metadata: Metadata = { title: "Posts" };

export default async function AdminHomePage() {
  // Still gated here: the layout reads the session but does not enforce it.
  await requireAdminOrRedirect("/admin");
  const posts = await listPosts(getDb());

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14">
      <h1 className="text-step-3 font-normal text-ink">Posts</h1>

      {/*
        The add action sits with the table it acts on rather than in the page
        header, where it competed with the title and the sign-out control.
      */}
      <div className="mt-12 flex items-baseline justify-between gap-4">
        <Eyebrow as="h2">
          {posts.length} post{posts.length === 1 ? "" : "s"}
        </Eyebrow>
        <ButtonLink href="/admin/posts/new" variant="subtle" size="sm">
          New post
        </ButtonLink>
      </div>

      {posts.length === 0 ? (
        <Text size="sm" tone="muted" className="mt-4 border border-border bg-surface p-6">
          No posts yet. Write the first one.
        </Text>
      ) : (
        <List layout="divided" gap="none" className="mt-4 border-y border-border">
          {posts.map((post) => (
            <ListItem key={post.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4">
              <Link
                href={`/admin/posts/${post.id}`}
                className="text-step-1 text-ink hover:underline underline-offset-4"
              >
                {post.title}
              </Link>

              <span
                className={
                  post.status === "published"
                    ? "text-step--2 uppercase tracking-[0.1em] text-ink-muted"
                    : "text-step--2 uppercase tracking-[0.1em] text-brand"
                }
              >
                {post.status}
              </span>

              <span className="text-step--2 uppercase tracking-[0.1em] text-ink-muted">
                {post.categoryName}
              </span>

              <span className="ml-auto text-step--1 text-ink-muted">
                {post.publishedAt
                  ? formatPublishedDate(post.publishedAt)
                  : "unpublished"}
              </span>
            </ListItem>
          ))}
        </List>
      )}
    </main>
  );
}
