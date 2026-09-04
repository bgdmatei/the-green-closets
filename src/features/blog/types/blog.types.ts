/**
 * How a post is positioned on the homepage. Declared here rather than in the
 * data module so types never depend on data.
 */
export const ArticleTypes = {
  TopPick: "top-pick",
  WeeksPick: "weeks-pick",
  Latest: "latest",
} as const;

export type ArticleType = (typeof ArticleTypes)[keyof typeof ArticleTypes];

export interface BlogPost {
  slug: string;
  type: ArticleType;
  title: string;
  excerpt: string;
  /** Markdown source, as authored in the backoffice. */
  content: string;
  categorySlug: string;
  categoryName: string;
  /** ISO 8601 date (`YYYY-MM-DD`). Format for display with `formatPublishedDate`. */
  publishedAt: string;
}

export interface BlogCategory {
  slug: string;
  name: string;
}
