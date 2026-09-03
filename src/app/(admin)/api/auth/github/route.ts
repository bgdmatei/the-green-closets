import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { isSafeReturnPath } from "@/server/auth/dal";
import {
  buildAuthorizeUrl,
  OAUTH_RETURN_COOKIE,
  OAUTH_STATE_COOKIE,
} from "@/server/auth/github";
import { callbackUrl, secureCookie } from "@/server/auth/cookies";

/**
 * Starts the OAuth flow.
 *
 * The `state` value is the CSRF defence: it is generated here, stored in a
 * short-lived cookie, and must come back unchanged. Without it an attacker
 * could feed the callback their own authorization code and bind the admin's
 * browser to the attacker's GitHub account.
 */
export const GET = async (request: NextRequest) => {
  const state = randomBytes(32).toString("base64url");
  const jar = await cookies();

  jar.set(OAUTH_STATE_COOKIE, state, {
    ...secureCookie,
    // Only needs to survive the round trip to GitHub and back.
    maxAge: 60 * 10,
  });

  // Remember where to land afterwards, validated so a crafted link cannot turn
  // the login into an open redirect.
  const requested = request.nextUrl.searchParams.get("next");
  if (requested && isSafeReturnPath(requested)) {
    jar.set(OAUTH_RETURN_COOKIE, requested, { ...secureCookie, maxAge: 60 * 10 });
  }

  return NextResponse.redirect(
    buildAuthorizeUrl(state, callbackUrl(request)),
  );
};
