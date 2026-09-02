import { describe, expect, it } from "vitest";

import { getPostBySlug, getPosts } from "@/features/blog/api/blog.services";

describe("blog.services", () => {
  it("returns posts sorted by date desc", async () => {
    const result = await getPosts();
    expect(result.length).toBeGreaterThan(1);
    expect(result[0]?.publishedAt >= result[1]?.publishedAt).toBe(true);
  });

  it("returns null for unknown slug", async () => {
    const result = await getPostBySlug("missing-post");
    expect(result).toBeNull();
  });
});
