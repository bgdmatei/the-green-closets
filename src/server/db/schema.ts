import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

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
    status: postStatusEnum("status").notNull().default("draft"),
    /**
     * Restricting deletes: a category with posts in it cannot be removed out
     * from under them, which would otherwise orphan or silently drop articles.
     */
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    /**
     * Optional cover image, stored as an absolute URL.
     *
     * Deliberately not routed through `next/image`: allowing arbitrary hosts in
     * `remotePatterns` would turn the optimizer into an open image proxy that
     * anyone could drive with our bandwidth. Rendered unoptimized instead, so
     * any URL works without opening that door.
     */
    coverImageUrl: text("cover_image_url"),
    /** Empty string means decorative; null means no image at all. */
    coverImageAlt: text("cover_image_alt"),
    /**
     * Surfaces the post on the front page. Independent of `status`: an
     * unpublished post is never shown, featured or not, because every
     * reader-facing query filters on published first.
     */
    featured: boolean("featured").notNull().default(false),
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

/**
 * Brands whose products the shop carries.
 *
 * Like categories, these are typed as free text in the editor and found or
 * created on save — a separate management screen would cost more than a handful
 * of brands justifies.
 */
export const brands = pgTable(
  "brands",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    /** The brand's own store. Every product link ultimately lands here. */
    storeUrl: text("store_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("brands_slug_idx").on(table.slug)],
);

/**
 * The catalogue.
 *
 * The shop holds no stock: every row is a pointer at an item on the brand's own
 * store, which is why `productUrl` is required and there is no inventory,
 * variant or fulfilment data here.
 *
 * `isWeeklyPick` is a flag rather than a separate table, so a pick is always a
 * real catalogue item. Note the consequence: once a live product feed exists it
 * will own these rows, and hand-curated entries will need reconciling with it.
 */
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    /** Colourway. Not in the editor; carried for feed-sourced rows. */
    colour: text("colour"),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict" }),
    /** Minor units, so money is never held in a float. */
    priceCents: integer("price_cents").notNull(),
    currency: text("currency").notNull().default("EUR"),
    imageUrl: text("image_url").notNull(),
    /** Secondary shot revealed on hover. Not in the editor. */
    hoverImageUrl: text("hover_image_url"),
    /** Where the reader is sent. The shop never completes a sale itself. */
    productUrl: text("product_url").notNull(),
    isWeeklyPick: boolean("is_weekly_pick").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("products_slug_idx").on(table.slug),
    index("products_is_weekly_pick_idx").on(table.isWeeklyPick),
    index("products_brand_id_idx").on(table.brandId),
    index("products_created_at_idx").on(table.createdAt),
  ],
);

export type BrandRow = typeof brands.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
