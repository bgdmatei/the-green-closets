import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAdminSession, isSafeReturnPath } from "@/server/auth/dal";

export const metadata: Metadata = { title: "Sign in" };

// Reads cookies to decide what to show, so it cannot be prerendered.
export const dynamic = "force-dynamic";

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, error } = await searchParams;

  // Already signed in — no reason to show a login form.
  if (await getAdminSession()) {
    redirect(next && isSafeReturnPath(next) ? next : "/admin");
  }

  const authorizeHref =
    next && isSafeReturnPath(next)
      ? `/api/auth/github?next=${encodeURIComponent(next)}`
      : "/api/auth/github";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="text-step--2 uppercase tracking-[0.1em] text-ink-muted">
        The Green Closets
      </p>
      <h1 className="mt-3 text-step-3 font-normal text-ink">Backoffice</h1>
      <p className="mt-3 text-step-0 leading-relaxed text-ink-muted">
        Sign in with the GitHub account that owns this site.
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-6 border border-border bg-surface p-4 text-step-0 text-ink"
        >
          That sign-in did not work. Check you are using the right GitHub
          account, then try again.
        </p>
      ) : null}

      {/*
        A link, not a form: starting OAuth is a GET that mutates nothing, and
        the state cookie set on the way out is what protects the callback.
      */}
      <a
        href={authorizeHref}
        className="mt-8 inline-flex h-11 items-center justify-center gap-2 bg-ink px-5 text-step-0 text-surface transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.19c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
        Continue with GitHub
      </a>
    </main>
  );
}
