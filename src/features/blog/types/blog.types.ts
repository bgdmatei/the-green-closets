import { ArticleTypes } from "../data/posts";

export interface BlogPost {
  slug: string;
  type: ArticleTypes;
  title: string;
  excerpt: string;
  contentHtml: string;
  categorySlug: string;
  categoryName: string;
  publishedAt: string;
}

export interface BlogCategory {
  slug: string;
  name: string;
}
