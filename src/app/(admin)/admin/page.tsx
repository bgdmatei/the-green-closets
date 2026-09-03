import type { Metadata } from "next";

import { requireAdminOrRedirect } from "@/server/auth/dal";

export const metadata: Metadata = { title: "Posts" };

// Authenticated, so it renders per request. Public routes stay static.
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  // The gate. Not in the layout: layouts do not re-render on navigation, so a
  // check there would not run as the admin moves between routes.
  const session = await requireAdminOrRedirect("/admin");

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-step--2 uppercase tracking-[0.1em] text-ink-muted">
            Backoffice
          </p>
          <h1 className="mt-3 text-step-3 font-normal text-ink">Posts</h1>
        </div>

        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="h-9 border border-border px-4 text-step-0 text-ink transition-colors hover:bg-ink hover:text-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Sign out {session.githubLogin}
          </button>
        </form>
      </div>

      <div className="mt-8 border border-border bg-surface p-6">
        <p className="text-step-0 text-ink-muted">
          Signed in. The post list and editor are the next step — nothing here
          reads or writes a post yet.
        </p>
      </div>
    </main>
  );
}
