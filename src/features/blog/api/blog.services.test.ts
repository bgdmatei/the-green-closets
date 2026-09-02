import { describe, expect, it } from "vitest";

import {
  getCategories,
  getCategoryBySlug,
  getPostBySlug,
  getPosts,
  getPostsByCategory,
} from "@/features/blog/api/blog.services";

describe("getPosts", () => {
  it("sorts posts newest first", async () => {
    const result = await getPosts();

    expect(result.length).toBeGreaterThan(1);

    const timestamps = result.map((post) => Date.parse(post.publishedAt));
    expect(timestamps.every((time) => Number.isFinite(time))).toBe(true);
    expect(timestamps).toStrictEqual([...timestamps].sort((a, b) => b - a));
  });
});

describe("getPostBySlug", () => {
  it("returns the matching post", async () => {
    const result = await getPostBySlug("seo-checklist-for-content-sites");
    expect(result?.title).toBe("SEO Checklist for Content Websites");
  });

  it("returns null for an unknown slug", async () => {
    expect(await getPostBySlug("missing-post")).toBeNull();
  });
});

describe("getCategories", () => {
  it("returns each category once", async () => {
    const categories = await getCategories();
    const slugs = categories.map((category) => category.slug);

    expect(slugs.length).toBeGreaterThan(0);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("covers every category referenced by a post", async () => {
    const posts = await getPosts();
    const categorySlugs = new Set(
      (await getCategories()).map((category) => category.slug),
    );

    for (const post of posts) {
      expect(categorySlugs.has(post.categorySlug)).toBe(true);
    }
  });
});

describe("getCategoryBySlug", () => {
  it("returns null for an unknown slug", async () => {
    expect(await getCategoryBySlug("missing-category")).toBeNull();
  });
});

describe("getPostsByCategory", () => {
  it("returns only posts in that category", async () => {
    const [category] = await getCategories();
    const result = await getPostsByCategory(category.slug);

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((post) => post.categorySlug === category.slug)).toBe(
      true,
    );
  });

  it("returns an empty array for an unknown category", async () => {
    expect(await getPostsByCategory("missing-category")).toStrictEqual([]);
  });
});
