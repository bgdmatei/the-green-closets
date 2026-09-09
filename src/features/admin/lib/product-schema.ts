import { z } from "zod";

import { parsePriceToCents } from "@/features/shop/lib/parse-price";
import { slugify } from "./slug";

const isHttpUrl = (value: string): boolean => {
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
};

const httpUrl = (message: string) =>
  z.string().trim().min(1, message).max(2000).refine(isHttpUrl, message);

/**
 * Same parsing, but an empty field is a legitimate answer and becomes `null`
 * rather than an error — the column is nullable and the card only renders the
 * second shot when there is one.
 */
const optionalHttpUrl = (message: string) =>
  z
    .string()
    .trim()
    .max(2000)
    .refine((value) => value === "" || isHttpUrl(value), message)
    .transform((value) => (value === "" ? null : value));

/**
 * The validation boundary for catalogue entries.
 *
 * A Server Action is a public POST endpoint, so this runs on data that may not
 * have come from the form. Both URLs are parsed rather than pattern-matched, so
 * `javascript:` and `data:` cannot reach an `img` or an anchor, and the price is
 * converted from what a human types into the minor units the column stores.
 */
export const productInputSchema = z.object({
  name: z.string().trim().min(1, "Give the product a title").max(200),
  brandName: z.string().trim().min(1, "Name the brand").max(80),
  imageUrl: httpUrl("The image must be a full http(s) address"),
  hoverImageUrl: optionalHttpUrl(
    "The hover image must be a full http(s) address",
  ),
  productUrl: httpUrl("The website must be a full http(s) address"),
  price: z
    .string()
    .trim()
    .min(1, "Give the product a price")
    .transform((value, ctx) => {
      const cents = parsePriceToCents(value);
      if (cents === null) {
        ctx.addIssue({
          code: "custom",
          message: 'Price should look like 150 or 19.99 — no thousands separators',
        });
        return z.NEVER;
      }
      return cents;
    }),
  isWeeklyPick: z.boolean(),
});

export type ParsedProductInput = z.output<typeof productInputSchema>;

export const readProductForm = (formData: FormData) => ({
  name: String(formData.get("name") ?? ""),
  brandName: String(formData.get("brandName") ?? ""),
  imageUrl: String(formData.get("imageUrl") ?? ""),
  hoverImageUrl: String(formData.get("hoverImageUrl") ?? ""),
  productUrl: String(formData.get("productUrl") ?? ""),
  price: String(formData.get("price") ?? ""),
  // An unchecked checkbox submits nothing at all.
  isWeeklyPick: formData.get("isWeeklyPick") === "on",
});

/** The slug is derived, never accepted from the client. */
export const productSlug = (brandName: string, name: string): string =>
  slugify(`${brandName} ${name}`);
