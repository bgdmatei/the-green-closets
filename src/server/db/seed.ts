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
/**
 * Load `.env.local` for command-line use.
 *
 * Next.js loads it automatically for the app, but drizzle-kit and the seed
 * script are plain Node processes and do not. `loadEnvFile` is built in, so
 * this needs no dependency; it is optional because CI supplies the variable
 * through the real environment instead.
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  // No local env file — rely on the ambient environment.
}

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { posts as staticPosts } from "@/features/blog/data/posts";
import {
  brands as staticBrands,
  products as staticProducts,
} from "@/features/shop/data/shop.data";
import { brands, categories, posts, products } from "@/server/db/schema";

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
      content: post.content,
      coverImageUrl: post.coverImageUrl,
      coverImageAlt: post.coverImageAlt,
      featured: post.featured,
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

  // --- shop ---
  await db
    .insert(brands)
    .values(
      staticBrands.map((brand) => ({
        slug: brand.slug,
        name: brand.name,
        storeUrl: brand.storeUrl,
      })),
    )
    .onConflictDoNothing({ target: brands.slug });

  const brandRows = await db.select().from(brands);
  const brandIdBySlug = new Map(brandRows.map((row) => [row.slug, row.id]));

  for (const product of staticProducts) {
    const brandId = brandIdBySlug.get(product.brandSlug);
    if (!brandId) throw new Error(`No brand row for "${product.brandSlug}"`);

    const values = {
      slug: product.slug,
      name: product.name,
      colour: product.colour ?? null,
      brandId,
      priceCents: product.priceCents,
      currency: product.currency,
      imageUrl: product.imageUrl,
      hoverImageUrl: product.hoverImageUrl ?? null,
      productUrl: product.productUrl,
      isWeeklyPick: product.isWeeklyPick,
      updatedAt: new Date(),
    };

    await db
      .insert(products)
      .values(values)
      .onConflictDoUpdate({ target: products.slug, set: values });
  }

  console.log(
    `Seeded ${uniqueCategories.size} categories, ${staticPosts.length} posts, ` +
      `${staticBrands.length} brands and ${staticProducts.length} products.`,
  );
};

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
