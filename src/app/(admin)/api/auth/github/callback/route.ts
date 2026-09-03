import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { isSafeReturnPath } from "@/server/auth/dal";
import { callbackUrl, secureCookie } from "@/server/auth/cookies";
import {
  exchangeCodeForToken,
  fetchGitHubUser,
  isAllowedAdmin,
  OAUTH_RETURN_COOKIE,
  OAUTH_STATE_COOKIE,
} from "@/server/auth/github";
import {
  createSession,
  safeEqual,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from "@/server/auth/session";
import { getDb } from "@/server/db/client";

/** One generic failure for every rejection, so probing reveals nothing. */
const deny = (request: NextRequest) =>
  NextResponse.redirect(new URL("/admin/login?error=1", request.nextUrl.origin));

export const GET = async (request: NextRequest) => {
  const jar = await cookies();
  const expectedState = jar.get(OAUTH_STATE_COOKIE)?.value;
  const returnTo = jar.get(OAUTH_RETURN_COOKIE)?.value;

  // Single-use whatever happens next: a replayed state must not be accepted.
  jar.delete(OAUTH_STATE_COOKIE);
  jar.delete(OAUTH_RETURN_COOKIE);

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  // The CSRF check. Compared in constant time; a mismatch, a missing cookie or
  // a missing code are all equally fatal.
  if (!code || !state || !expectedState || !safeEqual(state, expectedState)) {
    return deny(request);
  }

  try {
    const accessToken = await exchangeCodeForToken(code, callbackUrl(request));
    const user = await fetchGitHubUser(accessToken);

    // Authentication succeeded; authorization is a separate question. Any
    // GitHub account can get this far, so this is the gate that matters.
    if (!isAllowedAdmin(user)) {
      console.warn(`Rejected admin login for GitHub user "${user.githubLogin}"`);
      return deny(request);
    }

    const { token } = await createSession(getDb(), user);

    jar.set(SESSION_COOKIE, token, {
      ...secureCookie,
      maxAge: SESSION_TTL_SECONDS,
    });

    const destination =
      returnTo && isSafeReturnPath(returnTo) ? returnTo : "/admin";
    return NextResponse.redirect(new URL(destination, request.nextUrl.origin));
  } catch (error) {
    // Log server-side; tell the browser nothing beyond "that did not work".
    console.error("GitHub OAuth callback failed:", error);
    return deny(request);
  }
};
