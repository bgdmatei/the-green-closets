import type { Brand, Product } from "@/features/shop/types/shop.types";

/**
 * Sample catalogue.
 *
 * This is a stand-in for the live product feed. Once the backend exists it will
 * pull this shape from each brand's own store, so nothing outside this file
 * assumes the data is local — every view goes through `shop.services`.
 *
 * Imagery is referenced from the brand's own CDN rather than copied, which is
 * how the feed will supply it too. Prices are indicative and go stale; the
 * brand's store is the source of truth, which is why every item deep-links out
 * to it for checkout.
 */

const ARMEDANGELS_CDN =
  "https://cdn.shopify.com/s/files/1/0915/0850/6949/files";

export const brands: Brand[] = [
  {
    slug: "armedangels",
    name: "ARMEDANGELS",
    summary:
      "Cologne-based, GOTS-certified and Fair Wear accredited. Organic cotton, recycled fibres and a supply chain they publish in full.",
    storeUrl: "https://www.armedangels.com",
  },
];

export const products: Product[] = [
  {
    slug: "ryaano-boxershorts-night-sky",
    name: "RYAANO BOXERSHORTS",
    colour: "night sky",
    brandSlug: "armedangels",
    priceCents: 2000,
    currency: "EUR",
    imageUrl: `${ARMEDANGELS_CDN}/30005732-1237_101.jpg?v=1787758652`,
    productUrl: "https://www.armedangels.com",
    isWeeklyPick: false,
    addedAt: "2026-08-28",
  },
  {
    slug: "kiaano-tweed-strickpullover-dark-earth",
    name: "KIAANO TWEED-STRICKPULLOVER",
    colour: "dark earth tweed",
    brandSlug: "armedangels",
    priceCents: 15000,
    currency: "EUR",
    imageUrl: `${ARMEDANGELS_CDN}/30007412-3696_111.jpg?v=1787848867`,
    hoverImageUrl: `${ARMEDANGELS_CDN}/30007412-3696_211.jpg?v=1787848867`,
    productUrl: "https://www.armedangels.com",
    isWeeklyPick: true,
    addedAt: "2026-08-27",
  },
  {
    slug: "kiaano-tweed-strickpullover-sandstone",
    name: "KIAANO TWEED-STRICKPULLOVER",
    colour: "sandstone tweed",
    brandSlug: "armedangels",
    priceCents: 15000,
    currency: "EUR",
    imageUrl: `${ARMEDANGELS_CDN}/30007412-3695_111.jpg?v=1787848870`,
    productUrl: "https://www.armedangels.com",
    isWeeklyPick: false,
    addedAt: "2026-08-26",
  },
  {
    slug: "kiaano-tweed-strickpullover-black",
    name: "KIAANO TWEED-STRICKPULLOVER",
    colour: "black",
    brandSlug: "armedangels",
    priceCents: 15000,
    currency: "EUR",
    imageUrl: `${ARMEDANGELS_CDN}/30007412-105_111.jpg?v=1787848867`,
    hoverImageUrl: `${ARMEDANGELS_CDN}/30007412-105_211.jpg?v=1787848867`,
    productUrl: "https://www.armedangels.com",
    isWeeklyPick: true,
    addedAt: "2026-08-25",
  },
  {
    slug: "athenaas-high-waist-wide-jeans-ligure",
    name: "ATHENAAS HIGH WAIST WIDE JEANS",
    colour: "ligure",
    brandSlug: "armedangels",
    priceCents: 15000,
    currency: "EUR",
    imageUrl: `${ARMEDANGELS_CDN}/30008782-3672_111.jpg?v=1787758724`,
    hoverImageUrl: `${ARMEDANGELS_CDN}/30008782-3672_211.jpg?v=1787758724`,
    productUrl: "https://www.armedangels.com",
    isWeeklyPick: true,
    addedAt: "2026-08-24",
  },
  {
    slug: "strukturierte-jeansjacke-ligure",
    name: "STRUKTURIERTE JEANSJACKE",
    colour: "ligure",
    brandSlug: "armedangels",
    priceCents: 16000,
    currency: "EUR",
    imageUrl: `${ARMEDANGELS_CDN}/30008781-3672_111.jpg?v=1787758687`,
    hoverImageUrl: `${ARMEDANGELS_CDN}/30008781-3672_211.jpg?v=1787758687`,
    productUrl: "https://www.armedangels.com",
    isWeeklyPick: false,
    addedAt: "2026-08-23",
  },
  {
    slug: "yenaas-heavy-cord-kappe-amberwood",
    name: "YENAAS HEAVY CORD-KAPPE",
    colour: "amberwood",
    brandSlug: "armedangels",
    priceCents: 6000,
    currency: "EUR",
    imageUrl: `${ARMEDANGELS_CDN}/30009064-3641_111.jpg?v=1787767432`,
    hoverImageUrl: `${ARMEDANGELS_CDN}/30009064-3641_211.jpg?v=1787767432`,
    productUrl: "https://www.armedangels.com",
    isWeeklyPick: true,
    addedAt: "2026-08-22",
  },
  {
    slug: "gestreiftes-troyer-sweatshirt-claystone",
    name: "GESTREIFTES TROYER SWEATSHIRT",
    colour: "claystone / sandstone",
    brandSlug: "armedangels",
    priceCents: 13000,
    currency: "EUR",
    imageUrl: `${ARMEDANGELS_CDN}/30008914-3781_111.jpg?v=1787758705`,
    hoverImageUrl: `${ARMEDANGELS_CDN}/30008914-3781_211.jpg?v=1787758705`,
    productUrl: "https://www.armedangels.com",
    isWeeklyPick: false,
    addedAt: "2026-08-21",
  },
];
