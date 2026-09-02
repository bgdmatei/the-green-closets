# THE GREEN CLOSETS — project status

## Scope

- Frontend-only curated shop plus journal, on the Next.js App Router (16.x,
  React 19).
- Single locale: English. There is no i18n routing, no `[lang]` segment and no proxy.
- Content sources, both local typed data modules standing in for a future
  backend: `src/features/blog/data/posts.ts` and
  `src/features/shop/data/shop.data.ts`.
- Routes: `/`, `/shop`, `/week-picks`, `/brands/[slug]`, `/journal`,
  `/articles/[slug]`, `/category/[slug]`, `/about`.

## Shop model

The shop holds no stock and processes no payment. Every product deep-links to
the brand's own store, where checkout happens, and product imagery is referenced
from the brand's CDN rather than copied — which is how the live feed will supply
it once the backend exists. Nothing outside `shop.data.ts` assumes the catalogue
is local; every view goes through `shop.services`.

## Rendering

Every route is prerendered at build time — `○ (Static)` or `● (SSG)`. There is
no `revalidate`, no `cacheComponents`, and no request-time API anywhere, so a
`ƒ (Dynamic)` marker in `next build` output is a regression.

- `generateStaticParams` on both dynamic routes.
- `dynamicParams = false`: the content set is closed, so an unlisted slug is a
  genuine 404 rather than a request-time render.

## Design system

- Tokens: `src/app/tokens.css` — semantic colour roles (`surface`, `ink`,
  `brand`, `border`), a type scale (`--text-step-*`), radii and shadows. Light
  and dark palettes are both defined; only `:root` values are restated under
  `prefers-color-scheme: dark`.
- The palette is a warm near-neutral cream, so photography supplies all the
  colour. **Radii are zero by design** — the layout reads as printed matter.
  They remain tokens so softening them later is one edit.
- `--on-light-muted` is deliberately *not* restated for dark mode: it colours
  text on a light chip over a photograph, and a photograph does not change with
  the viewer's colour scheme.
- Primitives: `src/components/ui/` — `Text`, `Heading`, `Eyebrow`, `Card`,
  `Button`, `TextLink`/`ButtonLink`, `Badge`, `Divider`, `Container`,
  `FullBleed`, `MediaTile`, `SectionHeader`. Variants use
  `class-variance-authority`; `as` polymorphism goes through `PolymorphicProps`.
- `Heading` takes an `accent` prop rendered in the display italic — "Read the
  *journal*". That mixed roman/italic line is the signature of the design, so
  it is a first-class prop rather than markup each caller reproduces.
- Fonts: Instrument Serif (`--font-display`, roman **and italic**) for display
  type, Inter (`--font-body`) for UI and copy, self-hosted via `next/font`.
- Layout rule: the root layout sets **no** width. Sections opt into
  `Container`; edge-to-edge bands use `FullBleed` at the top level. Do not nest
  a `FullBleed` inside a `Container`.
- Article bodies use `@tailwindcss/typography` with every `--tw-prose-*`
  variable mapped to a token (`prose prose-article`).

### `cn()` is configured, not plain `twMerge`

`src/lib/utils.ts` registers the `text-step-*` scale as font sizes via
`extendTailwindMerge`. Without it, tailwind-merge cannot tell `text-step-4`
(a size) from `text-ink-inverse` (a colour) — both are `text-*` — so it treats
them as one group and keeps only the last, silently dropping the colour. That
rendered overlay headings in the near-black body ink, invisible against the
photograph. `src/lib/utils.test.ts` guards this; **add any new custom `text-*`
scale value to that config.**

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
  `https:` — currently `images.unsplash.com` and `cdn.shopify.com` (brand
  product imagery). Adding an image host means editing **both**.
- Outbound product links carry `rel="noopener noreferrer nofollow"`.
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
