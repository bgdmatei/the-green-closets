import type { BlogPost } from "@/features/blog/types/blog.types";

export const posts: BlogPost[] = [
  {
    slug: "nextjs-blog-architecture",
    locale: "en",
    title: "A Small, Scalable Next.js Blog Architecture",
    excerpt: "A practical structure for a frontend-only multilingual blog.",
    contentHtml:
      "<p>This article shows a minimal architecture for a secure and fast frontend-only blog.</p><h2>Why this setup works</h2><p>It keeps routing, rendering, and feature modules focused.</p>",
    categorySlug: "architecture",
    categoryName: "Architecture",
    publishedAt: "2026-03-20",
  },
  {
    slug: "seo-checklist-for-content-sites",
    locale: "en",
    title: "SEO Checklist for Content Websites",
    excerpt: "Canonical URLs, hreflang, and metadata in one clean setup.",
    contentHtml:
      "<p>For multilingual blogs, canonical and hreflang are mandatory. Keep your metadata centralized.</p>",
    categorySlug: "seo",
    categoryName: "SEO",
    publishedAt: "2026-03-18",
  },
  {
    slug: "arquitectura-blog-nextjs",
    locale: "es",
    title: "Arquitectura de Blog en Next.js",
    excerpt: "Como estructurar un blog pequeno, rapido y mantenible.",
    contentHtml:
      "<p>Este articulo presenta una base sencilla para un blog en el frontend con enfoque en seguridad y SEO.</p>",
    categorySlug: "arquitectura",
    categoryName: "Arquitectura",
    publishedAt: "2026-03-20",
  },
];
