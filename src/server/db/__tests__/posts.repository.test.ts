// @vitest-environment node
import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  findCategoriesWithPublishedPosts,
  findCategoryBySlug,
  findPublishedPostBySlug,
  findPublishedPosts,
  findPublishedPostsByCategory,
} from "@/server/db/posts.repository";
import { categories, posts } from "@/server/db/schema";
import { createTestDatabase } from "@/server/db/test-database";
import type { Database } from "@/server/db/client";

let db: Database;
let close: () => Promise<void>;

const seed = async () => {
  const [basics, seo, empty] = await db
    .insert(categories)
    .values([
      { slug: "basics", name: "Basics" },
      { slug: "seo", name: "SEO" },
      { slug: "empty", name: "Empty" },
    ])
    .returning();

  await db.insert(posts).values([
    {
      slug: "newest",
      title: "Newest",
      excerpt: "The most recent one.",
      content: "<p>newest</p>",
      status: "published",
      categoryId: basics.id,
      publishedAt: new Date("2026-04-19T00:00:00Z"),
    },
    {
      slug: "older",
      title: "Older",
      excerpt: "An earlier one.",
      content: "<p>older</p>",
      status: "published",
      categoryId: seo.id,
      publishedAt: new Date("2026-03-18T00:00:00Z"),
    },
    {
      slug: "a-draft",
      title: "A Draft",
      excerpt: "Not for readers.",
      content: "<p>secret</p>",
      status: "draft",
      categoryId: basics.id,
    },
  ]);

  return { basics, seo, empty };
};

beforeEach(async () => {
  const created = await createTestDatabase();
  db = created.db as unknown as Database;
  close = () => created.client.close();
});

afterEach(async () => {
  await close();
});

describe("published post reads", () => {
  it("returns published posts newest first", async () => {
    await seed();
    const result = await findPublishedPosts(db);

    expect(result.map((post) => post.slug)).toStrictEqual(["newest", "older"]);
  });

  it("never returns a draft", async () => {
    await seed();

    expect(await findPublishedPostBySlug(db, "a-draft")).toBeNull();
    const all = await findPublishedPosts(db);
    expect(all.some((post) => post.slug === "a-draft")).toBe(false);
  });

  it("joins the category through the foreign key", async () => {
    await seed();
    const post = await findPublishedPostBySlug(db, "newest");

    expect(post?.categorySlug).toBe("basics");
    expect(post?.categoryName).toBe("Basics");
  });

  it("formats publishedAt as an ISO date, matching the old data shape", async () => {
    await seed();
    const post = await findPublishedPostBySlug(db, "newest");

    expect(post?.publishedAt).toBe("2026-04-19");
  });

  it("returns null for an unknown slug", async () => {
    await seed();
    expect(await findPublishedPostBySlug(db, "nope")).toBeNull();
  });
});

describe("category reads", () => {
  it("filters posts to one category", async () => {
    await seed();
    const result = await findPublishedPostsByCategory(db, "basics");

    expect(result.map((post) => post.slug)).toStrictEqual(["newest"]);
  });

  it("omits categories that only contain drafts or nothing at all", async () => {
    await seed();
    const slugs = (await findCategoriesWithPublishedPosts(db)).map((c) => c.slug);

    expect(slugs).toContain("basics");
    expect(slugs).toContain("seo");
    // "empty" has no posts; a category whose only post is a draft is likewise
    // invisible, so the journal never links to an empty listing.
    expect(slugs).not.toContain("empty");
  });

  it("returns null for a category with no published posts", async () => {
    await seed();
    expect(await findCategoryBySlug(db, "empty")).toBeNull();
  });
});

describe("schema constraints", () => {
  it("rejects a duplicate slug", async () => {
    const { basics } = await seed();

    await expect(
      db.insert(posts).values({
        slug: "newest",
        title: "Clash",
        excerpt: "x",
        content: "x",
        categoryId: basics.id,
      }),
    ).rejects.toThrow();
  });

  it("refuses to delete a category that still has posts", async () => {
    const { basics } = await seed();

    await expect(
      db.delete(categories).where(eq(categories.id, basics.id)),
    ).rejects.toThrow();
  });

  it("rejects an invalid status value at the database level", async () => {
    const { basics } = await seed();

    // Cast rather than @ts-expect-error: the point is that Postgres itself
    // refuses the value, which still has to hold for anything that reaches the
    // database without passing through TypeScript — a raw SQL fix-up, say.
    const invalidStatus = "sort-of-published" as unknown as "draft";

    await expect(
      db.insert(posts).values({
        slug: "bad-status",
        title: "Bad",
        excerpt: "x",
        content: "x",
        status: invalidStatus,
        categoryId: basics.id,
      }),
    ).rejects.toThrow();
  });
});
