import { z } from "zod";

import { slugify } from "./slug";

/**
 * The validation boundary for authored posts.
 *
 * A Server Action is a public POST endpoint, so this runs on data that may not
 * have come from the form at all. Everything is length-bounded, and the slug is
 * re-slugified server-side rather than trusted, so a hand-crafted request
 * cannot put a path separator or a space into a URL.
 */
export const postInputSchema = z.object({
  title: z.string().trim().min(1, "Give the post a title").max(200),
  slug: z
    .string()
    .trim()
    .max(80)
    .transform((value) => slugify(value))
    .refine((value) => value.length > 0, "Slug cannot be empty"),
  excerpt: z
    .string()
    .trim()
    .min(1, "Write a short excerpt — it is the standfirst on the journal")
    .max(300),
  content: z.string().trim().min(1, "The post has no body yet").max(100_000),
  categoryName: z.string().trim().min(1, "Choose a category").max(80),
  status: z.enum(["draft", "published"]),
  /**
   * Any host is permitted, by decision. The URL is still parsed and its scheme
   * checked, so `javascript:` or `data:` cannot reach an `img` tag.
   */
  coverImageUrl: z
    .string()
    .trim()
    .max(2000)
    .refine((value) => {
      if (value.length === 0) return true;
      try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    }, "The image URL must be a full http(s) address")
    .transform((value) => (value.length > 0 ? value : null)),
  coverImageAlt: z
    .string()
    .trim()
    .max(300)
    .transform((value) => (value.length > 0 ? value : null)),
  featured: z.coerce.boolean(),
});

export type PostFormValues = z.input<typeof postInputSchema>;
export type ParsedPostInput = z.output<typeof postInputSchema>;

/**
 * Builds form values from raw `FormData`, filling the slug from the title when
 * it was left blank.
 */
export const readPostForm = (formData: FormData) => {
  const title = String(formData.get("title") ?? "");
  const rawSlug = String(formData.get("slug") ?? "").trim();

  return {
    title,
    slug: rawSlug.length > 0 ? rawSlug : title,
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    categoryName: String(formData.get("categoryName") ?? ""),
    status: String(formData.get("status") ?? "draft"),
    coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
    coverImageAlt: String(formData.get("coverImageAlt") ?? ""),
    // An unchecked checkbox submits nothing at all.
    featured: formData.get("featured") === "on",
  };
};
