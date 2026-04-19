# Bogdan Project Blog Status

## Scope
- Frontend-only multilingual blog built with Next.js App Router.
- Locales: `en`, `es`.
- Content source: local typed data module (`src/features/blog/data/posts.ts`).

## Security Defaults
- HTML sanitization for rich content in `src/lib/sanitize-html.ts`.
- Security headers in `next.config.ts`:
  - CSP
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy
- Strict image host allowlist in `next.config.ts`.

## SEO
- Metadata helper in `src/lib/metadata.ts`.
- Per-page metadata in locale, detail, and category pages.
- `robots.ts` and `sitemap.ts` implemented.

## Environment
- Required variable:
  - `NEXT_PUBLIC_SITE_URL`
- Local development:
  - set in `.env.local`
  - template available in `.env.example`

## Checks
- Lint: `pnpm lint`
- Types: `pnpm type-check`
- Unit tests: `pnpm test`
- E2E: `pnpm e2e`
