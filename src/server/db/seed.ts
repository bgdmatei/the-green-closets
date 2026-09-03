/**
 * Seeds a database from the static content module.
 *
 * One-shot migration aid for moving the existing posts into Postgres, and a way
 * to fill a fresh Neon dev branch. Safe to re-run: categories are inserted only
 * if absent, and posts are matched on their slug and updated in place, so it
 * never duplicates rows.
 *
 *   pnpm db:seed
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { posts as staticPosts } from "@/features/blog/data/posts";
import { categories, posts } from "@/server/db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env.local.");
  process.exit(1);
}

const db = drizzle(neon(connectionString), { schema: { categories, posts } });

const seed = async () => {
  // Categories are denormalised onto posts in the static module; collapse them
  // to a unique set before inserting, since they become their own table.
  const uniqueCategories = new Map(
    staticPosts.map((post) => [
      post.categorySlug,
      { slug: post.categorySlug, name: post.categoryName },
    ]),
  );

  await db
    .insert(categories)
    .values([...uniqueCategories.values()])
    .onConflictDoNothing({ target: categories.slug });

  const categoryRows = await db.select().from(categories);
  const categoryIdBySlug = new Map(
    categoryRows.map((row) => [row.slug, row.id]),
  );

  for (const post of staticPosts) {
    const categoryId = categoryIdBySlug.get(post.categorySlug);
    if (!categoryId) {
      throw new Error(`No category row for "${post.categorySlug}"`);
    }

    const values = {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.contentHtml,
      type: post.type,
      // Everything already on the live site is, by definition, published.
      status: "published" as const,
      categoryId,
      publishedAt: new Date(`${post.publishedAt}T00:00:00Z`),
      updatedAt: new Date(),
    };

    await db
      .insert(posts)
      .values(values)
      .onConflictDoUpdate({ target: posts.slug, set: values });
  }

  console.log(
    `Seeded ${uniqueCategories.size} categories and ${staticPosts.length} posts.`,
  );
};

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
