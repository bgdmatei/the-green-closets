// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";

import {
  createSession,
  deleteExpiredSessions,
  deleteSession,
  findValidSession,
  hashToken,
  safeEqual,
} from "@/server/auth/session";
import { sessions } from "@/server/db/schema";
import { createTestDatabase } from "@/server/db/test-database";
import type { Database } from "@/server/db/client";

let db: Database;
let close: () => Promise<void>;

const admin = { githubUserId: "42", githubLogin: "bgdmatei" };

beforeEach(async () => {
  const created = await createTestDatabase();
  db = created.db as unknown as Database;
  close = () => created.client.close();
});

afterEach(async () => {
  await close();
});

describe("token handling", () => {
  it("never stores the raw token", async () => {
    const { token } = await createSession(db, admin);
    const [row] = await db.select().from(sessions);

    expect(row.tokenHash).not.toBe(token);
    expect(row.tokenHash).toBe(hashToken(token));
    // A database dump must not contain anything usable as a cookie value.
    expect(JSON.stringify(row)).not.toContain(token);
  });

  it("issues a distinct, high-entropy token each time", async () => {
    const first = await createSession(db, admin);
    const second = await createSession(db, admin);

    expect(first.token).not.toBe(second.token);
    // 32 random bytes in base64url.
    expect(first.token.length).toBeGreaterThanOrEqual(43);
  });

  it("compares in constant time without throwing on length mismatch", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "much longer value")).toBe(false);
    expect(safeEqual("", "")).toBe(true);
  });
});

describe("session lifecycle", () => {
  it("resolves a freshly issued token", async () => {
    const { token } = await createSession(db, admin);
    const session = await findValidSession(db, token);

    expect(session?.githubLogin).toBe("bgdmatei");
  });

  it("rejects an unknown token", async () => {
    await createSession(db, admin);
    expect(await findValidSession(db, "not-a-real-token")).toBeNull();
  });

  it("rejects an empty token rather than matching an empty hash", async () => {
    await createSession(db, admin);
    expect(await findValidSession(db, "")).toBeNull();
  });

  it("rejects an expired session", async () => {
    const { token } = await createSession(db, admin);

    await db
      .update(sessions)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(sessions.tokenHash, hashToken(token)));

    expect(await findValidSession(db, token)).toBeNull();
  });

  it("revokes immediately on sign-out, so a copied token is dead", async () => {
    const { token } = await createSession(db, admin);
    expect(await findValidSession(db, token)).not.toBeNull();

    await deleteSession(db, token);

    expect(await findValidSession(db, token)).toBeNull();
  });

  it("signing out one session leaves the others alone", async () => {
    const laptop = await createSession(db, admin);
    const phone = await createSession(db, admin);

    await deleteSession(db, laptop.token);

    expect(await findValidSession(db, laptop.token)).toBeNull();
    expect(await findValidSession(db, phone.token)).not.toBeNull();
  });

  it("prunes only expired rows", async () => {
    const live = await createSession(db, admin);
    const stale = await createSession(db, admin);
    await db
      .update(sessions)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(sessions.tokenHash, hashToken(stale.token)));

    await deleteExpiredSessions(db);

    expect(await db.select().from(sessions)).toHaveLength(1);
    expect(await findValidSession(db, live.token)).not.toBeNull();
  });
});
