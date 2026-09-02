# THE GREEN CLOSETS — project status

## Scope

- Frontend-only editorial blog on the Next.js App Router (16.x, React 19).
- Single locale: English. There is no i18n routing, no `[lang]` segment and no proxy.
- Content source: local typed data module (`src/features/blog/data/posts.ts`).
- Routes: `/`, `/articles/[slug]`, `/category/[slug]`.

## Rendering

Every route is prerendered at build time — `○ (Static)` or `● (SSG)`. There is
no `revalidate`, no `cacheComponents`, and no request-time API anywhere, so a
`ƒ (Dynamic)` marker in `next build` output is a regression.

- `generateStaticParams` on both dynamic routes.
- `dynamicParams = false`: the content set is closed, so an unlisted slug is a
  genuine 404 rather than a request-time render.

## Design system

- Tokens: `src/app/tokens.css` — semantic colour roles (`surface`, `ink`,
  `brand`, `border`), a fluid type scale (`--text-step-*`), radii and shadows.
  Light and dark palettes are both defined; only `:root` values are restated
  under `prefers-color-scheme: dark`.
- Primitives: `src/components/ui/` — `Text`, `Heading`, `Card`, `Button`,
  `TextLink`/`ButtonLink`, `Badge`, `Divider`, `Container`, `FullBleed`.
  Variants are built with `class-variance-authority`; `as` polymorphism goes
  through `PolymorphicProps`.
- Fonts: Playfair Display (`--font-display`) for headings, Source Serif 4
  (`--font-body`) for copy, both self-hosted via `next/font`.
- Layout rule: the root layout sets **no** width. Sections opt into
  `Container`; edge-to-edge bands use `FullBleed` at the top level. Do not nest
  a `FullBleed` inside a `Container`.
- Article bodies use `@tailwindcss/typography` with every `--tw-prose-*`
  variable mapped to a token (`prose prose-article`).

## Security

- HTML sanitization for rich content in `src/lib/sanitize-html.ts`, applied at
  render in `PostContent`.
- Headers in `next.config.ts`: CSP, HSTS, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
  `poweredByHeader` is off.
- **CSP allows inline scripts by design.** Nonce-based CSP requires per-request
  rendering, which would cost the static shell. The site takes no user input,
  loads no third-party script, and sanitizes all rich content, so the residual
  XSS surface does not justify that trade. `unsafe-eval` is dev-only.
- `img-src` matches the `remotePatterns` allowlist rather than allowing all of
  `https:`.
- Only `NEXT_PUBLIC_*` env vars exist; `.env*` is gitignored.

## SEO

- `metadataBase` in the root layout; `buildPageMetadata` (`src/lib/metadata.ts`)
  emits relative canonical and Open Graph URLs so previews resolve correctly.
- Open Graph card generated at build time by `src/app/opengraph-image.tsx`.
- `robots.ts` and `sitemap.ts` cover posts and categories.

## Environment

- Required: `NEXT_PUBLIC_SITE_URL` (validated by `src/lib/env.ts`, fails fast).
- Local: set in `.env.local`; template in `.env.example`.

## Checks

- Lint: `pnpm lint`
- Types: `pnpm type-check`
- Unit: `pnpm test`
- E2E: `pnpm e2e` — runs against a **production** server (`build && start`),
  because the CSP differs in dev.
