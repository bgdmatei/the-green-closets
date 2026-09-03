import "server-only";

import type { NextRequest } from "next/server";

/**
 * Cookie flags shared by every cookie this app sets.
 *
 * `httpOnly` is the one that matters most: it keeps the session token out of
 * reach of any script on the page, so an XSS bug cannot exfiltrate it.
 *
 * `sameSite: "lax"` rather than `"strict"` is required, not a preference — the
 * OAuth callback is a top-level navigation from github.com, and a strict cookie
 * would not be sent on it, breaking the state check on every login.
 */
export const secureCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

/**
 * The OAuth callback URL, derived from the request rather than configuration,
 * so it is correct on localhost, on a Netlify deploy preview, and in production
 * without three different values to keep in sync.
 */
export const callbackUrl = (request: NextRequest): string =>
  new URL("/api/auth/github/callback", request.nextUrl.origin).toString();
