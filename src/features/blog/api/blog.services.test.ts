import { describe, expect, it } from "vitest";

import { getPostBySlug, getPostsByLocale } from "@/features/blog/api/blog.services";

describe("blog.services", () => {
  it("returns locale posts sorted by date desc", async () => {
    const result = await getPostsByLocale("en");
    expect(result.length).toBeGreaterThan(1);
    expect(result[0]?.publishedAt >= result[1]?.publishedAt).toBe(true);
  });

  it("returns null for unknown slug", async () => {
    const result = await getPostBySlug("en", "missing-post");
    expect(result).toBeNull();
  });
});
