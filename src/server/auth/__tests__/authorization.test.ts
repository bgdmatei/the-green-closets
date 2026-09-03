// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { isSafeReturnPath } from "@/server/auth/dal";

describe("isSafeReturnPath", () => {
  it("allows paths inside the backoffice", () => {
    expect(isSafeReturnPath("/admin")).toBe(true);
    expect(isSafeReturnPath("/admin/posts/new")).toBe(true);
  });

  it("rejects a protocol-relative URL, which would leave the origin", () => {
    // The classic open-redirect payload: browsers treat "//host" as absolute.
    expect(isSafeReturnPath("//evil.example.com")).toBe(false);
    expect(isSafeReturnPath("//evil.example.com/admin")).toBe(false);
  });

  it("rejects absolute URLs", () => {
    expect(isSafeReturnPath("https://evil.example.com/admin")).toBe(false);
    expect(isSafeReturnPath("http://evil.example.com")).toBe(false);
  });

  it("rejects paths outside the backoffice", () => {
    expect(isSafeReturnPath("/journal")).toBe(false);
    expect(isSafeReturnPath("/")).toBe(false);
    expect(isSafeReturnPath("")).toBe(false);
  });
});

describe("isAllowedAdmin", () => {
  const load = async (adminLogin: string) => {
    vi.resetModules();
    process.env.GITHUB_CLIENT_ID = "id";
    process.env.GITHUB_CLIENT_SECRET = "secret";
    process.env.ADMIN_GITHUB_LOGIN = adminLogin;
    return import("@/server/auth/github");
  };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    delete process.env.GITHUB_CLIENT_ID;
    delete process.env.GITHUB_CLIENT_SECRET;
    delete process.env.ADMIN_GITHUB_LOGIN;
  });

  it("admits the configured account", async () => {
    const { isAllowedAdmin } = await load("bgdmatei");

    expect(
      isAllowedAdmin({ githubUserId: "1", githubLogin: "bgdmatei" }),
    ).toBe(true);
  });

  it("matches case-insensitively, as GitHub logins are", async () => {
    const { isAllowedAdmin } = await load("bgdmatei");

    expect(
      isAllowedAdmin({ githubUserId: "1", githubLogin: "BgdMatei" }),
    ).toBe(true);
  });

  it("refuses every other GitHub account", async () => {
    const { isAllowedAdmin } = await load("bgdmatei");

    // The whole point: completing OAuth proves identity, not permission. Any
    // GitHub user in the world can authenticate; only this one is authorized.
    for (const login of ["someone-else", "bgdmatei2", "bgdmate", "", "admin"]) {
      expect(
        isAllowedAdmin({ githubUserId: "999", githubLogin: login }),
      ).toBe(false);
    }
  });

  it("does not admit a lookalike that merely contains the login", async () => {
    const { isAllowedAdmin } = await load("bgdmatei");

    expect(
      isAllowedAdmin({ githubUserId: "2", githubLogin: "not-bgdmatei-really" }),
    ).toBe(false);
  });
});
