export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown source, as authored in the backoffice. */
  content: string;
  /** Optional cover image, an absolute URL. */
  coverImageUrl: string | null;
  /** Empty string means decorative. */
  coverImageAlt: string | null;
  /** Surfaces the post on the front page. */
  featured: boolean;
  categorySlug: string;
  categoryName: string;
  /** ISO 8601 date (`YYYY-MM-DD`). Format for display with `formatPublishedDate`. */
  publishedAt: string;
}

export interface BlogCategory {
  slug: string;
  name: string;
}
