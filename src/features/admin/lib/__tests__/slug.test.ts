import { describe, expect, it } from "vitest";

import { slugify } from "@/features/admin/lib/slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("What Is Sustainable Fashion?")).toBe(
      "what-is-sustainable-fashion",
    );
  });

  it("keeps accented letters as their base character", () => {
    expect(slugify("Rückblick auf München")).toBe("ruckblick-auf-munchen");
  });

  it("drops apostrophes rather than turning them into hyphens", () => {
    expect(slugify("This week's picks")).toBe("this-weeks-picks");
  });

  it("strips characters that would break a URL path", () => {
    // The important case: a crafted slug must not escape its path segment.
    expect(slugify("../../etc/passwd")).toBe("etc-passwd");
    expect(slugify("a/b?c=d#e")).toBe("a-b-c-d-e");
    expect(slugify("  spaced  out  ")).toBe("spaced-out");
  });

  it("never leaves leading or trailing hyphens", () => {
    expect(slugify("!!! hello !!!")).toBe("hello");
  });

  it("bounds the length", () => {
    expect(slugify("a".repeat(200)).length).toBeLessThanOrEqual(80);
  });
});
