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

/**
 * Admin sessions.
 *
 * Opaque server-side sessions rather than JWTs, so signing out or a suspected
 * compromise revokes access immediately — a JWT stays valid until it expires,
 * which is exactly the wrong property when you want it gone now.
 *
 * `tokenHash` is a SHA-256 of the token, never the token itself. The raw value
 * exists only in the user's cookie, so a database leak does not hand over live
 * sessions, the same reason a password is never stored in the clear.
 */
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tokenHash: text("token_hash").notNull(),
    /** GitHub's numeric user id — stable across a username change. */
    githubUserId: text("github_user_id").notNull(),
    githubLogin: text("github_login").notNull(),
    /** Absolute expiry. There is no sliding renewal; a session has a hard end. */
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_idx").on(table.tokenHash),
    index("sessions_expires_at_idx").on(table.expiresAt),
  ],
);

export type SessionRow = typeof sessions.$inferSelect;
