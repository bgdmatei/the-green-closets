import "server-only";

import type { NextRequest } from "next/server";

/**
 * The externally visible origin of this request.
 *
 * `request.nextUrl` cannot be used for this. Measured against a running
 * server, `nextUrl.hostname` is always the bind address — it reflects neither
 * the `Host` header nor `X-Forwarded-Host`. Behind Netlify's proxy that would
 * mean building the OAuth `redirect_uri` and every redirect target from
 * "localhost", which breaks sign-in in production while working perfectly in
 * development.
 *
 * The forwarded headers are what actually describe how the client reached us.
 */
export const requestOrigin = (request: NextRequest): string => {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    request.nextUrl.host;
  const proto =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "");

  return `${proto}://${host}`;
};

const LOOPBACK = /^(localhost|127\.0\.0\.1|\[::1\]|::1)(:\d+)?$/i;

/**
 * Cookie flags shared by every cookie this app sets.
 *
 * `httpOnly` is the one that matters most: it keeps the session token out of
 * reach of any script on the page, so an XSS bug cannot exfiltrate it.
 *
 * `sameSite: "lax"` rather than `"strict"` is required, not a preference — the
 * OAuth callback is a top-level navigation from github.com, and a strict cookie
 * would not be sent on it, breaking the state check on every login.
 *
 * `secure` is decided per request rather than from `NODE_ENV`, because
 * `next start` runs in production mode over plain HTTP locally. It fails
 * closed: anything that is not a loopback host gets the flag, even if the proto
 * header is absent.
 */
export const cookieOptions = (request: NextRequest) => {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  const isHttps = request.headers.get("x-forwarded-proto") === "https";

  return {
    httpOnly: true,
    secure: isHttps || !LOOPBACK.test(host),
    sameSite: "lax",
    path: "/",
  } as const;
};

/**
 * The OAuth callback URL, derived from the request so it is correct on
 * localhost, on a Netlify deploy preview, and in production without three
 * different values to keep in sync.
 */
export const callbackUrl = (request: NextRequest): string =>
  new URL("/api/auth/github/callback", requestOrigin(request)).toString();
