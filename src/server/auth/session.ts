import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";

import { sessions } from "@/server/db/schema";
import type { Database } from "@/server/db/client";

export const SESSION_COOKIE = "tgc_admin_session";

/** Absolute lifetime. A session ends at a fixed time; it is never extended. */
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export interface AdminSession {
  githubUserId: string;
  githubLogin: string;
  expiresAt: Date;
}

/**
 * 256 bits from a CSPRNG. The token is the only credential, so it has to be
 * unguessable; base64url keeps it cookie-safe without escaping.
 */
const generateToken = (): string => randomBytes(32).toString("base64url");

/**
 * Sessions are looked up by hash, so the raw token never touches the database.
 * SHA-256 without a salt is deliberate and correct here: the input is already
 * high-entropy random, so there is nothing to brute-force and the slow hashing
 * a password needs would only add latency to every request.
 */
export const hashToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

/**
 * Constant-time comparison, for callers that must compare two secrets in
 * application code rather than via an indexed lookup.
 */
export const safeEqual = (a: string, b: string): boolean => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  // timingSafeEqual throws on a length mismatch, which would itself leak length.
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
};

/**
 * Issues a session and returns the raw token for the cookie.
 *
 * Always creates a new row rather than reusing one, so a login cannot inherit a
 * session identifier an attacker already knows (session fixation).
 */
export const createSession = async (
  db: Database,
  user: { githubUserId: string; githubLogin: string },
): Promise<{ token: string; expiresAt: Date }> => {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  await db.insert(sessions).values({
    tokenHash: hashToken(token),
    githubUserId: user.githubUserId,
    githubLogin: user.githubLogin,
    expiresAt,
  });

  return { token, expiresAt };
};

/**
 * Resolves a raw token to a live session, or null.
 *
 * Expiry is part of the query rather than a check afterwards, so an expired row
 * can never be treated as valid by a caller that forgets to look.
 */
export const findValidSession = async (
  db: Database,
  token: string,
): Promise<AdminSession | null> => {
  if (!token) return null;

  const rows = await db
    .select({
      githubUserId: sessions.githubUserId,
      githubLogin: sessions.githubLogin,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.tokenHash, hashToken(token)),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
};

export const deleteSession = async (
  db: Database,
  token: string,
): Promise<void> => {
  if (!token) return;
  await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
};

/** Housekeeping: expired rows serve no purpose and should not accumulate. */
export const deleteExpiredSessions = async (db: Database): Promise<void> => {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
};
