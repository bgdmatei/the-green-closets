import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Where a post sits on the homepage. Kept as a database enum so an invalid
 * value cannot be written at all, rather than being caught in application code.
 */
export const articleTypeEnum = pgEnum("article_type", [
  "top-pick",
  "weeks-pick",
  "latest",
]);

/**
 * Drafts are invisible to the public site. Every reader-facing query filters on
 * this, which is why it is an enum and not a nullable `published_at`: "is this
 * live" should be one unambiguous column.
 */
export const postStatusEnum = pgEnum("post_status", ["draft", "published"]);

/**
 * Categories are their own table rather than a string on the post.
 *
 * The previous shape carried both `categorySlug` and `categoryName` on every
 * post — renaming a category meant rewriting every row that referenced it, and
 * any missed row silently disagreed with the others. A foreign key makes a
 * rename one update.
 */
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("categories_slug_idx").on(table.slug)],
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    /**
     * The article body. Held as opaque text so the authoring format (HTML today,
     * most likely markdown once the editor exists) is a rendering decision
     * rather than a migration.
     */
    content: text("content").notNull(),
    type: articleTypeEnum("type").notNull().default("latest"),
    status: postStatusEnum("status").notNull().default("draft"),
    /**
     * Restricting deletes: a category with posts in it cannot be removed out
     * from under them, which would otherwise orphan or silently drop articles.
     */
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    /** Null until first published, so drafts have no date to display. */
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("posts_slug_idx").on(table.slug),
    // The public index is "published, newest first" on every page that lists.
    index("posts_status_published_at_idx").on(table.status, table.publishedAt),
    index("posts_category_id_idx").on(table.categoryId),
  ],
);

export type PostRow = typeof posts.$inferSelect;
export type NewPostRow = typeof posts.$inferInsert;
export type CategoryRow = typeof categories.$inferSelect;
export type NewCategoryRow = typeof categories.$inferInsert;
