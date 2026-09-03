import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { deleteSession, SESSION_COOKIE } from "@/server/auth/session";
import { getDb } from "@/server/db/client";

/**
 * Signing out.
 *
 * POST only: a GET would let any page log the admin out with an image tag, and
 * would be prefetchable. The session row is deleted rather than just the
 * cookie cleared, so a copied token is dead too — the reason sessions are
 * server-side in the first place.
 */
export const POST = async (request: NextRequest) => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (token) {
    await deleteSession(getDb(), token);
  }

  jar.delete(SESSION_COOKIE);
  return NextResponse.redirect(new URL("/admin/login", request.nextUrl.origin), {
    // 303 so the browser follows with GET rather than repeating the POST.
    status: 303,
  });
};
