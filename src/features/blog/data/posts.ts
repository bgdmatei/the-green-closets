import type { BlogPost } from "@/features/blog/types/blog.types";

/**
 * Seed fixture only.
 *
 * The site reads posts from Postgres; this is what `pnpm db:seed` loads into a
 * fresh database. It is not imported by any page, and new posts are written
 * through the backoffice rather than added here.
 */

export const posts: BlogPost[] = [
  {
    slug: "what-is-sustainable-fashion",
    coverImageUrl:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    coverImageAlt: "Folded knitwear in muted tones",
    featured: true,
    title: "What Is Sustainable Fashion?",
    excerpt: "Let's make our shopping easy and sustainable.",
    content:
      "Sustainable fashion asks a simple question of every garment: what did it cost to make, and what will it cost to throw away?\n\nThe answer rarely appears on the label, so this guide walks through the three things that actually move the needle — fibre choice, production transparency, and how long you keep a piece in rotation.",
    categorySlug: "basics",
    categoryName: "Basics",
    publishedAt: "2026-04-19",
  },
  {
    slug: "seo-checklist-for-content-sites",
    coverImageUrl: null,
    coverImageAlt: null,
    featured: false,
    title: "SEO Checklist for Content Websites",
    excerpt: "Canonical URLs and metadata in one clean setup.",
    content:
      "Canonical URLs and structured metadata are mandatory for a healthy content site. Keep your metadata centralized so every route inherits the same defaults.\n\nStart with a canonical URL per page, a single source of truth for Open Graph tags, and a sitemap generated from the same data your pages render.",
    categorySlug: "seo",
    categoryName: "SEO",
    publishedAt: "2026-03-18",
  },
  {
    slug: "building-a-capsule-wardrobe",
    coverImageUrl:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
    coverImageAlt: "A sparse rail of neutral garments",
    featured: true,
    title: "Building a Capsule Wardrobe",
    excerpt: "Thirty pieces, worn often, chosen once.",
    content:
      "A capsule wardrobe is less about restraint than about repetition: a small set of pieces you reach for without thinking.\n\nThe work happens up front — picking a palette, settling on silhouettes that suit you, and being honest about the life you actually lead rather than the one you shop for.",
    categorySlug: "basics",
    categoryName: "Basics",
    publishedAt: "2026-02-02",
  },
];
