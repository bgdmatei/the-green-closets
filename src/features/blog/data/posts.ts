import type { BlogPost } from "@/features/blog/types/blog.types";

export const enum ArticleTypes {
  TopPage = "top-page",
  WeeksPicks = "weeks-picks",
  LatestArticle = "latest-article",
}

export const posts: BlogPost[] = [
  {
    slug: "what-is-sustainable-fashion",
    locale: "en",
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
    locale: "en",
    type: ArticleTypes.LatestArticle,
    title: "SEO Checklist for Content Websites",
    excerpt: "Canonical URLs, hreflang, and metadata in one clean setup.",
    contentHtml:
      "For multilingual blogs, canonical and hreflang are mandatory. Keep your metadata centralized. For multilingual blogs, canonical and hreflang are mandatory. Keep your metadata centralized. For multilingual blogs, canonical and hreflang are mandatory. Keep your metadata centralized.",
    categorySlug: "seo",
    categoryName: "SEO",
    publishedAt: "2026-03-18",
  },
  {
    slug: "arquitectura-blog-nextjs",
    type: ArticleTypes.LatestArticle,
    title: "Arquitectura de Blog en Next.js",
    excerpt: "Como estructurar un blog pequeno, rapido y mantenible.",
    contentHtml:
      "<p>Este articulo presenta una base sencilla para un blog en el frontend con enfoque en seguridad y SEO.</p>",
    categorySlug: "arquitectura",
    categoryName: "Arquitectura",
    publishedAt: "2026-03-20",
  },
];
