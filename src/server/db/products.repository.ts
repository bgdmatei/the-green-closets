import "server-only";

import { and, desc, eq, ne } from "drizzle-orm";

import { brands, products } from "./schema";
import type { Database } from "./client";
import type { ProductWithBrand } from "@/features/shop/types/shop.types";

/**
 * The catalogue, for readers and for the backoffice.
 *
 * Unlike posts there is no draft state — a product is either carried or it is
 * not — so these reads are shared rather than split into public and admin
 * modules. Writes still go through actions that verify a session first.
 */

const selection = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  colour: products.colour,
  priceCents: products.priceCents,
  currency: products.currency,
  imageUrl: products.imageUrl,
  hoverImageUrl: products.hoverImageUrl,
  productUrl: products.productUrl,
  isWeeklyPick: products.isWeeklyPick,
  createdAt: products.createdAt,
  brandId: brands.id,
  brandSlug: brands.slug,
  brandName: brands.name,
  brandStoreUrl: brands.storeUrl,
};

type Row = Awaited<ReturnType<typeof selectProducts>>[number];

const selectProducts = (db: Database, where?: ReturnType<typeof eq>) =>
  db
    .select(selection)
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(where)
    .orderBy(desc(products.createdAt));

const toProduct = (row: Row): ProductWithBrand => ({
  slug: row.slug,
  name: row.name,
  colour: row.colour ?? undefined,
  brandSlug: row.brandSlug,
  priceCents: row.priceCents,
  currency: row.currency as "EUR",
  imageUrl: row.imageUrl,
  hoverImageUrl: row.hoverImageUrl ?? undefined,
  productUrl: row.productUrl,
  isWeeklyPick: row.isWeeklyPick,
  addedAt: row.createdAt.toISOString().slice(0, 10),
  brand: {
    slug: row.brandSlug,
    name: row.brandName,
    summary: "",
    storeUrl: row.brandStoreUrl ?? row.productUrl,
  },
});

export const findProducts = async (db: Database): Promise<ProductWithBrand[]> =>
  (await selectProducts(db)).map(toProduct);

export const findWeeklyPicks = async (
  db: Database,
): Promise<ProductWithBrand[]> =>
  (await selectProducts(db, eq(products.isWeeklyPick, true))).map(toProduct);

export const findBrands = async (db: Database) =>
  db
    .select({ slug: brands.slug, name: brands.name, storeUrl: brands.storeUrl })
    .from(brands)
    .orderBy(brands.name);

/* ---------- backoffice ---------- */

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  brandName: string;
  priceCents: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  isWeeklyPick: boolean;
  createdAt: Date;
}

export const listProductsForAdmin = async (
  db: Database,
): Promise<AdminProduct[]> => {
  const rows = await selectProducts(db);
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    brandName: row.brandName,
    priceCents: row.priceCents,
    currency: row.currency,
    imageUrl: row.imageUrl,
    productUrl: row.productUrl,
    isWeeklyPick: row.isWeeklyPick,
    createdAt: row.createdAt,
  }));
};

export const findProductById = async (
  db: Database,
  id: string,
): Promise<AdminProduct | null> => {
  const rows = await selectProducts(db, eq(products.id, id));
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brandName: row.brandName,
    priceCents: row.priceCents,
    currency: row.currency,
    imageUrl: row.imageUrl,
    productUrl: row.productUrl,
    isWeeklyPick: row.isWeeklyPick,
    createdAt: row.createdAt,
  };
};

export const findOrCreateBrand = async (
  db: Database,
  name: string,
  slug: string,
  storeUrl: string | null,
): Promise<string> => {
  const existing = await db
    .select({ id: brands.id })
    .from(brands)
    .where(eq(brands.slug, slug))
    .limit(1);

  if (existing[0]) return existing[0].id;

  const [created] = await db
    .insert(brands)
    .values({ slug, name, storeUrl })
    .returning({ id: brands.id });
  return created.id;
};

export const productSlugTaken = async (
  db: Database,
  slug: string,
  excludeId?: string,
): Promise<boolean> => {
  const rows = await db
    .select({ id: products.id })
    .from(products)
    .where(
      excludeId
        ? and(eq(products.slug, slug), ne(products.id, excludeId))
        : eq(products.slug, slug),
    )
    .limit(1);
  return rows.length > 0;
};

export interface ProductInput {
  slug: string;
  name: string;
  brandId: string;
  priceCents: number;
  imageUrl: string;
  productUrl: string;
  isWeeklyPick: boolean;
}

export const createProduct = async (db: Database, input: ProductInput) => {
  await db.insert(products).values(input);
};

export const updateProduct = async (
  db: Database,
  id: string,
  input: ProductInput,
) => {
  await db
    .update(products)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(products.id, id));
};

export const deleteProduct = async (db: Database, id: string) => {
  await db.delete(products).where(eq(products.id, id));
};
