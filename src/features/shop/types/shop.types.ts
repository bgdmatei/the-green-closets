export interface Brand {
  slug: string;
  /** Display name, shown in the wide-tracked uppercase label. */
  name: string;
  /** One-line description used on the brand page. */
  summary: string;
  /** The brand's own store, where checkout happens. */
  storeUrl: string;
}

export interface Product {
  slug: string;
  name: string;
  /** Colourway, e.g. "night sky". Shown after the name on detail surfaces. */
  colour?: string;
  brandSlug: string;
  /** Minor units, so money is never held in a float. */
  priceCents: number;
  currency: "EUR";
  /** Primary shot. */
  imageUrl: string;
  /** Secondary shot, revealed on hover. */
  hoverImageUrl?: string;
  /** Deep link to this item on the brand's own store. */
  productUrl: string;
  /** Surfaced in the curated "This week's picks" edit. */
  isWeeklyPick: boolean;
  /** ISO 8601 date the item entered the shop; drives "New in the closet". */
  addedAt: string;
}

/** A product with its brand resolved, which is what every view actually wants. */
export interface ProductWithBrand extends Product {
  brand: Brand;
}
