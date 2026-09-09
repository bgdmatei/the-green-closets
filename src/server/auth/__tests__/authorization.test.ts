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

  describe("with more than one account configured", () => {
    it("admits every account on the list", async () => {
      const { isAllowedAdmin } = await load("bgdmatei,second-admin");

      expect(isAllowedAdmin({ githubUserId: "1", githubLogin: "bgdmatei" })).toBe(true);
      expect(isAllowedAdmin({ githubUserId: "2", githubLogin: "second-admin" })).toBe(true);
    });

    it("still refuses everyone else", async () => {
      const { isAllowedAdmin } = await load("bgdmatei,second-admin");

      expect(isAllowedAdmin({ githubUserId: "3", githubLogin: "third" })).toBe(false);
    });

    it("tolerates the spacing a human types", async () => {
      const { isAllowedAdmin } = await load("  bgdmatei , second-admin ,, ");

      expect(isAllowedAdmin({ githubUserId: "1", githubLogin: "bgdmatei" })).toBe(true);
      expect(isAllowedAdmin({ githubUserId: "2", githubLogin: "second-admin" })).toBe(true);
    });

    it("never treats the whole list as one login", async () => {
      // The bug this replaces: an exact match against the raw variable, which
      // matched nobody the moment a comma was added and locked everyone out.
      const { isAllowedAdmin } = await load("bgdmatei,second-admin");

      expect(
        isAllowedAdmin({ githubUserId: "9", githubLogin: "bgdmatei,second-admin" }),
      ).toBe(false);
    });
  });

  describe("matching on the numeric user id", () => {
    it("admits the account with that id, whatever it is called now", async () => {
      const { isAllowedAdmin } = await load("id:583231");

      expect(isAllowedAdmin({ githubUserId: "583231", githubLogin: "renamed" })).toBe(true);
    });

    it("refuses a different account, even one using the id as its login", async () => {
      // A GitHub username may be all digits, which is why an id entry carries
      // the prefix: "583231" is a valid login and must not match an id.
      const { isAllowedAdmin } = await load("id:583231");

      expect(isAllowedAdmin({ githubUserId: "42", githubLogin: "583231" })).toBe(false);
    });

    it("does not let an id entry match a login of the same text", async () => {
      const { isAllowedAdmin } = await load("id:583231");

      expect(isAllowedAdmin({ githubUserId: "0", githubLogin: "id:583231" })).toBe(false);
    });

    it("mixes ids and logins in one list", async () => {
      const { isAllowedAdmin } = await load("bgdmatei, id:583231");

      expect(isAllowedAdmin({ githubUserId: "1", githubLogin: "bgdmatei" })).toBe(true);
      expect(isAllowedAdmin({ githubUserId: "583231", githubLogin: "someone" })).toBe(true);
      expect(isAllowedAdmin({ githubUserId: "2", githubLogin: "nobody" })).toBe(false);
    });

    it("closes the renamed-account hole a login list leaves open", async () => {
      // Listing a login hands admin to whoever later claims that name. An id
      // entry does not: the account that had it keeps it.
      const byLogin = await load("bgdmatei");
      expect(
        byLogin.isAllowedAdmin({ githubUserId: "99999", githubLogin: "bgdmatei" }),
      ).toBe(true);

      const byId = await load("id:583231");
      expect(
        byId.isAllowedAdmin({ githubUserId: "99999", githubLogin: "bgdmatei" }),
      ).toBe(false);
    });
  });

  it("refuses a list that names nobody, rather than admitting anyone", async () => {
    // A value like "," passes a length check but parses to no entries. It must
    // fail loudly when read, not deny every login with no explanation.
    const { isAllowedAdmin } = await load(" , ,, ");

    expect(() =>
      isAllowedAdmin({ githubUserId: "1", githubLogin: "bgdmatei" }),
    ).toThrow(/ADMIN_GITHUB_LOGIN/);
  });
});
