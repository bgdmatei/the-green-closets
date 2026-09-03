import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDb } from "@/server/db/client";
import { findValidSession, SESSION_COOKIE } from "./session";
import type { AdminSession } from "./session";

/**
 * The authorization boundary.
 *
 * Next's own guidance is explicit about why it lives here rather than anywhere
 * more convenient:
 *
 *   - **Not in a layout.** Layouts do not re-render on navigation, so a session
 *     checked there is not re-checked as the user moves between admin routes.
 *   - **Not in middleware/proxy.** That runs on every request including
 *     prefetches and is documented as suitable for optimistic redirects only,
 *     never as the check that actually protects data.
 *   - **Not in the page alone.** A Server Action is a public POST endpoint that
 *     does not go through any page.
 *
 * So every function that reads or writes admin data calls `requireAdmin()`
 * itself. That makes an unguarded query a thing you have to actively write,
 * rather than something you get by forgetting.
 *
 * `cache` deduplicates the lookup within a single request, so calling it in
 * both a page and the action it invokes costs one query.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  return findValidSession(getDb(), token);
});

/**
 * Returns the session or redirects to the login page. Use this in pages and
 * layouts, where a redirect is the right response to being signed out.
 */
export const requireAdminOrRedirect = async (
  returnTo?: string,
): Promise<AdminSession> => {
  const session = await getAdminSession();
  if (session) return session;

  const target = returnTo && isSafeReturnPath(returnTo) ? returnTo : undefined;
  redirect(target ? `/admin/login?next=${encodeURIComponent(target)}` : "/admin/login");
};

/**
 * Returns the session or throws. Use this at the top of every Server Action and
 * mutation: an action reached directly by POST must fail, not redirect.
 */
export const requireAdmin = async (): Promise<AdminSession> => {
  const session = await getAdminSession();

  if (!session) {
    // Deliberately terse: an unauthenticated caller learns nothing about what
    // exists behind the boundary.
    throw new Error("Unauthorized");
  }

  return session;
};

/**
 * Guards against an open redirect through the `next` parameter.
 *
 * Only a path within the backoffice is allowed. Anything protocol-relative
 * (`//evil.com`) or absolute would otherwise let a crafted login link bounce a
 * signed-in admin to another origin.
 */
export const isSafeReturnPath = (value: string): boolean =>
  value.startsWith("/admin") && !value.startsWith("//");
