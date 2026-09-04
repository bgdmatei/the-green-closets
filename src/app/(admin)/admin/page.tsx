import type { Metadata } from "next";
import Link from "next/link";

import { requireAdminOrRedirect } from "@/server/auth/dal";
import { getDb } from "@/server/db/client";
import { listPosts } from "@/server/db/posts.admin.repository";
import { formatPublishedDate } from "@/features/blog/lib/format-date";

export const metadata: Metadata = { title: "Posts" };
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const session = await requireAdminOrRedirect("/admin");
  const posts = await listPosts(getDb());

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-step--2 uppercase tracking-[0.1em] text-ink-muted">
            Backoffice
          </p>
          <h1 className="mt-3 text-step-3 font-normal text-ink">Posts</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/posts/new"
            className="inline-flex h-10 items-center bg-ink px-5 text-step-0 text-surface transition-colors hover:bg-ink/85"
          >
            New post
          </Link>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="h-10 border border-border px-4 text-step-0 text-ink transition-colors hover:bg-ink hover:text-surface"
            >
              Sign out {session.githubLogin}
            </button>
          </form>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 border border-border bg-surface p-6 text-step-0 text-ink-muted">
          No posts yet. Write the first one.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {posts.map((post) => (
            <li key={post.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4">
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
                  ? formatPublishedDate(post.publishedAt.toISOString().slice(0, 10))
                  : "unpublished"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
