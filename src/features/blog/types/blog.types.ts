import type { Locale } from "@/lib/i18n";

export interface BlogPost {
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  contentHtml: string;
  categorySlug: string;
  categoryName: string;
  publishedAt: string;
}

export interface BlogCategory {
  slug: string;
  locale: Locale;
  name: string;
}
