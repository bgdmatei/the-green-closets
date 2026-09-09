import { NextResponse, type NextRequest } from "next/server";

/**
 * A strict, nonce-based Content Security Policy for the backoffice.
 *
 * The public site is prerendered, which rules out nonces there: a nonce must be
 * unique per request, and static HTML is generated once. Those pages keep the
 * policy in `next.config.ts`, which permits inline scripts — acceptable because
 * they render no authored content and take no user input.
 *
 * The backoffice is different on both counts. It is authenticated, so it renders
 * per request and a nonce is possible; and the editor now displays content
 * someone typed. So it gets the stricter policy, and the two never overlap —
 * `next.config.ts` excludes these paths, because two CSP headers are enforced
 * as an intersection and the combination would block Next's own scripts.
 *
 * `strict-dynamic` means scripts loaded *by* a nonced script are trusted too,
 * which is what lets Next's runtime pull in its chunks without listing each one.
 */
const buildCsp = (nonce: string, isDev: boolean): string =>
  [
    "default-src 'self'",
    // 'unsafe-eval' is dev-only: React uses eval there to rebuild server error
    // stacks. Neither React nor Next needs it in production.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Styles keep 'unsafe-inline' deliberately. Injected CSS cannot exfiltrate a
    // httpOnly cookie or execute code, and the alternative breaks Next's own
    // inlined styles for a marginal gain.
    "style-src 'self' 'unsafe-inline'",
    // Product and cover images may be hosted anywhere, as on the public site.
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    // The OAuth flow posts to github.com, so form submissions are not 'self'
    // only — but nothing here should be able to post anywhere else.
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

export function proxy(request: NextRequest) {
  // Web Crypto rather than node:crypto — this runs in the edge runtime.
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce, process.env.NODE_ENV === "development");

  // Next reads the nonce back out of this header and stamps it onto its own
  // script tags, so nothing has to thread it through the component tree.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  /**
   * Backoffice paths only.
   *
   * Deliberately narrow: running on the public site would either force those
   * pages out of static rendering or hand them a nonce their prerendered HTML
   * cannot carry. Prefetches are excluded too — the docs note the proxy runs on
   * those as well, and a prefetch does not need a policy of its own.
   */
  matcher: [
    {
      source: "/admin/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source: "/api/auth/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
