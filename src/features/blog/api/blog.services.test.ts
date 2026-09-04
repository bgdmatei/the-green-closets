// @vitest-environment node
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { categories, posts } from "@/server/db/schema";
import { createTestDatabase } from "@/server/db/test-database";

/**
 * Exercises the public service layer end to end — services, through the
 * repository, into a real Postgres — by pointing `getDb` at an in-process
 * PGlite database. Only the connection is substituted; the queries under test
 * are the ones production runs.
 */
const holder = vi.hoisted(() => ({ db: null as never }));
vi.mock("@/server/db/client", () => ({ getDb: () => holder.db }));

const {
  getFeaturedPosts,
  getCategories,
  getCategoryBySlug,
  getPostBySlug,
  getPosts,
  getPostsByCategory,
} = await import("@/features/blog/api/blog.services");

let close: () => Promise<void>;

beforeEach(async () => {
  const created = await createTestDatabase();
  holder.db = created.db as never;
  close = () => created.client.close();

  const [basics, seo] = await created.db
    .insert(categories)
    .values([
      { slug: "basics", name: "Basics" },
      { slug: "seo", name: "SEO" },
    ])
    .returning();

  await created.db.insert(posts).values([
    {
      slug: "newest",
      title: "Newest",
      excerpt: "Most recent.",
      content: "<p>a</p>",
      status: "published",
      featured: true,
      coverImageUrl: "https://example.com/cover.jpg",
      coverImageAlt: "A cover",
      categoryId: basics.id,
      publishedAt: new Date("2026-04-19T00:00:00Z"),
    },
    {
      slug: "older",
      title: "Older",
      excerpt: "Earlier.",
      content: "<p>b</p>",
      status: "published",
      categoryId: seo.id,
      publishedAt: new Date("2026-03-18T00:00:00Z"),
    },
    {
      slug: "unpublished",
      title: "Draft",
      excerpt: "Not live.",
      content: "<p>c</p>",
      status: "draft",
      // Featured *and* unpublished: the published filter must still win.
      featured: true,
      categoryId: basics.id,
    },
  ]);
});

afterEach(async () => {
  await close();
});

describe("getPosts", () => {
  it("returns published posts newest first", async () => {
    const result = await getPosts();

    expect(result.map((post) => post.slug)).toStrictEqual(["newest", "older"]);
    const timestamps = result.map((post) => Date.parse(post.publishedAt));
    expect(timestamps.every(Number.isFinite)).toBe(true);
    expect(timestamps).toStrictEqual([...timestamps].sort((a, b) => b - a));
  });

  it("omits drafts", async () => {
    const result = await getPosts();
    expect(result.some((post) => post.slug === "unpublished")).toBe(false);
  });
});

describe("getFeaturedPosts", () => {
  it("returns only posts flagged as featured", async () => {
    const result = await getFeaturedPosts();

    expect(result.map((post) => post.slug)).toStrictEqual(["newest"]);
  });

  it("never returns a featured draft", async () => {
    // The dangerous combination: flagged for the front page but not published.
    const slugs = (await getFeaturedPosts()).map((post) => post.slug);

    expect(slugs).not.toContain("unpublished");
  });

  it("carries the cover image through", async () => {
    const [post] = await getFeaturedPosts();

    expect(post.coverImageUrl).toBe("https://example.com/cover.jpg");
    expect(post.coverImageAlt).toBe("A cover");
  });

  it("respects the limit", async () => {
    expect(await getFeaturedPosts(0)).toHaveLength(0);
  });
});

describe("getPostBySlug", () => {
  it("returns the matching post with its category resolved", async () => {
    const result = await getPostBySlug("newest");

    expect(result?.title).toBe("Newest");
    expect(result?.categoryName).toBe("Basics");
  });

  it("returns null for an unknown slug", async () => {
    expect(await getPostBySlug("missing-post")).toBeNull();
  });

  it("returns null for a draft, so a direct URL cannot leak one", async () => {
    expect(await getPostBySlug("unpublished")).toBeNull();
  });
});

describe("getCategories", () => {
  it("returns each category once", async () => {
    const slugs = (await getCategories()).map((category) => category.slug);

    expect(slugs.length).toBeGreaterThan(0);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("covers every category referenced by a published post", async () => {
    const slugs = new Set((await getCategories()).map((c) => c.slug));

    for (const post of await getPosts()) {
      expect(slugs.has(post.categorySlug)).toBe(true);
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
    const result = await getPostsByCategory("basics");

    expect(result.map((post) => post.slug)).toStrictEqual(["newest"]);
  });

  it("returns an empty array for an unknown category", async () => {
    expect(await getPostsByCategory("missing-category")).toStrictEqual([]);
  });
});
