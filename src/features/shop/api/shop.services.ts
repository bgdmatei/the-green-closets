import { cache } from "react";

import { brands, products } from "@/features/shop/data/shop.data";
import type {
  Brand,
  ProductWithBrand,
} from "@/features/shop/types/shop.types";

const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]));

/**
 * Attaches each product's brand. A product whose brand is missing is dropped
 * rather than rendered half-resolved — once this data comes from a live feed,
 * a dangling `brandSlug` is a feed error, not something to surface to readers.
 */
const withBrand = (): ProductWithBrand[] =>
  products.flatMap((product) => {
    const brand = brandBySlug.get(product.brandSlug);
    return brand ? [{ ...product, brand }] : [];
  });

/**
 * Returns all products, most recently added first.
 */
export const getProducts = cache(async (): Promise<ProductWithBrand[]> => {
  return withBrand().toSorted(
    (a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt),
  );
});

/**
 * Returns the newest products, for the "New in the closet" strip.
 */
export const getNewArrivals = cache(
  async (limit = 8): Promise<ProductWithBrand[]> => {
    const all = await getProducts();
    return all.slice(0, limit);
  },
);

/**
 * Returns the curated weekly edit.
 */
export const getWeeklyPicks = cache(async (): Promise<ProductWithBrand[]> => {
  const all = await getProducts();
  return all.filter((product) => product.isWeeklyPick);
});

/**
 * Returns all brands carried by the shop.
 */
export const getBrands = cache(async (): Promise<Brand[]> => {
  return brands;
});

/**
 * Returns one brand by slug.
 */
export const getBrandBySlug = cache(
  async (slug: string): Promise<Brand | null> => {
    return brandBySlug.get(slug) ?? null;
  },
);

/**
 * Returns the products carried for one brand.
 */
export const getProductsByBrand = cache(
  async (brandSlug: string): Promise<ProductWithBrand[]> => {
    const all = await getProducts();
    return all.filter((product) => product.brandSlug === brandSlug);
  },
);
