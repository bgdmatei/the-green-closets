import "server-only";

import { cache } from "react";

import type { Brand, ProductWithBrand } from "@/features/shop/types/shop.types";
import { getDb } from "@/server/db/client";
import {
  findBrands,
  findProducts,
  findWeeklyPicks,
} from "@/server/db/products.repository";

/**
 * The public site's view of the shop.
 *
 * Every page reads through here, so this is the only place that knows the
 * catalogue lives in Postgres. `cache` is React's per-request memo: several
 * components ask for products while rendering one page, and this collapses
 * those into a single query.
 */

export const getProducts = cache(async (): Promise<ProductWithBrand[]> => {
  return findProducts(getDb());
});

/** The newest items, for the "New in the closet" strip. */
export const getNewArrivals = cache(
  async (limit = 8): Promise<ProductWithBrand[]> => {
    return (await getProducts()).slice(0, limit);
  },
);

export const getWeeklyPicks = cache(async (): Promise<ProductWithBrand[]> => {
  return findWeeklyPicks(getDb());
});

export const getBrands = cache(async (): Promise<Brand[]> => {
  const rows = await findBrands(getDb());
  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    summary: "",
    storeUrl: row.storeUrl ?? "",
  }));
});
