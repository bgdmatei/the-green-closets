import {
  ArticleTypes,
  type BlogPost,
} from "@/features/blog/types/blog.types";

export const posts: BlogPost[] = [
  {
    slug: "what-is-sustainable-fashion",
    type: ArticleTypes.TopPick,
    title: "What Is Sustainable Fashion?",
    excerpt: "Let's make our shopping easy and sustainable.",
    contentHtml:
      "<p>Sustainable fashion asks a simple question of every garment: what did it cost to make, and what will it cost to throw away?</p><p>The answer rarely appears on the label, so this guide walks through the three things that actually move the needle — fibre choice, production transparency, and how long you keep a piece in rotation.</p>",
    categorySlug: "basics",
    categoryName: "Basics",
    publishedAt: "2026-04-19",
  },
  {
    slug: "seo-checklist-for-content-sites",
    type: ArticleTypes.Latest,
    title: "SEO Checklist for Content Websites",
    excerpt: "Canonical URLs and metadata in one clean setup.",
    contentHtml:
      "<p>Canonical URLs and structured metadata are mandatory for a healthy content site. Keep your metadata centralized so every route inherits the same defaults.</p><p>Start with a canonical URL per page, a single source of truth for Open Graph tags, and a sitemap generated from the same data your pages render.</p>",
    categorySlug: "seo",
    categoryName: "SEO",
    publishedAt: "2026-03-18",
  },
  {
    slug: "building-a-capsule-wardrobe",
    type: ArticleTypes.WeeksPick,
    title: "Building a Capsule Wardrobe",
    excerpt: "Thirty pieces, worn often, chosen once.",
    contentHtml:
      "<p>A capsule wardrobe is less about restraint than about repetition: a small set of pieces you reach for without thinking.</p><p>The work happens up front — picking a palette, settling on silhouettes that suit you, and being honest about the life you actually lead rather than the one you shop for.</p>",
    categorySlug: "basics",
    categoryName: "Basics",
    publishedAt: "2026-02-02",
  },
];
