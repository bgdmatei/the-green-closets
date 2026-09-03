import type { Metadata } from "next";

export const metadata: Metadata = { title: "Posts" };

/**
 * Placeholder. Scaffolding only — no data layer and no authentication yet, so
 * this deliberately renders nothing that reads or writes a post.
 */
export default function AdminHomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="text-step--2 uppercase tracking-[0.1em] text-ink-muted">
        Backoffice
      </p>
      <h1 className="mt-3 text-step-3 font-normal text-ink">Posts</h1>
      <p className="mt-4 max-w-prose text-step-1 leading-relaxed text-ink-muted">
        Scaffolding only. This route group is a separate root layout from the
        public site — no header, no footer, no shared client state. Data access
        and authentication are not wired up yet.
      </p>
      <div className="mt-8 border border-border bg-surface p-6">
        <p className="text-step-0 text-ink-muted">
          Next: the database schema, then the session boundary, then the editor.
        </p>
      </div>
    </main>
  );
}
