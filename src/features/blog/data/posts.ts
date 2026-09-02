import type { BlogPost } from "@/features/blog/types/blog.types";

export const enum ArticleTypes {
  TopPage = "top-page",
  WeeksPicks = "weeks-picks",
  LatestArticle = "latest-article",
}

export const posts: BlogPost[] = [
  {
    slug: "what-is-sustainable-fashion",
    type: ArticleTypes.TopPage,
    title: "What Is Sustainable Fashion?",
    excerpt: "Let's make our shopping easy and sustainable",
    contentHtml: "- [x] Finish my changes",
    categorySlug: "architecture",
    categoryName: "Architecture",
    publishedAt: "19th of April",
  },
  {
    slug: "seo-checklist-for-content-sites",
    type: ArticleTypes.LatestArticle,
    title: "SEO Checklist for Content Websites",
    excerpt: "Canonical URLs and metadata in one clean setup.",
    contentHtml:
      "Canonical URLs and structured metadata are mandatory for a healthy content site. Keep your metadata centralized. Canonical URLs and structured metadata are mandatory for a healthy content site. Keep your metadata centralized.",
    categorySlug: "seo",
    categoryName: "SEO",
    publishedAt: "2026-03-18",
  },
];
