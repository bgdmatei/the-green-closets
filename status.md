# THE GREEN CLOSETS — project status

## Scope

- Frontend-only curated shop plus journal, on the Next.js App Router (16.x,
  React 19).
- Single locale: English. There is no i18n routing, no `[lang]` segment and no proxy.
- Posts live in **Postgres (Neon)**. `src/features/blog/data/posts.ts` is now
  only the seed fixture for `pnpm db:seed`; no page imports it.
- Shop data is still a local typed module standing in for a future feed:
  `src/features/shop/data/shop.data.ts`.
- Routes: `/`, `/shop`, `/week-picks`, `/brands/[slug]`, `/journal`,
  `/articles/[slug]`, `/category/[slug]`, `/about`.
- Two client components only — `ThemeToggle` and `NavLinks` (the latter purely
  to mark the current section). Everything else is a Server Component, and all
  routes still prerender static.

## Shop model

The shop holds no stock and processes no payment. Every product deep-links to
the brand's own store, where checkout happens, and product imagery is referenced
from the brand's CDN rather than copied — which is how the live feed will supply
it once the backend exists. Nothing outside `shop.data.ts` assumes the catalogue
is local; every view goes through `shop.services`.

## Rendering

Every route is prerendered at build time — `○ (Static)` or `● (SSG)`. There is
no `revalidate`, no `cacheComponents`, and no request-time API on the public
site, so a `ƒ (Dynamic)` marker for a `(site)` route in `next build` output is a
regression.

- `generateStaticParams` prerenders every post and category that exists at build
  time, querying Postgres to do so.
- `dynamicParams = true`: posts are published from the backoffice, so the set is
  open. A slug that did not exist at build time renders on demand and is then
  cached, instead of 404ing until the next full build.

**The build now requires `DATABASE_URL`.** Prerendering reads the database, so a
build without it fails at page-data collection. Netlify needs the variable set
for builds, not just at runtime.

## Design system

- Tokens: `src/app/tokens.css` — semantic colour roles (`surface`, `ink`,
  `brand`, `border`), a type scale (`--text-step-*`), radii and shadows. Light
  lives on `:root`; dark restates only the colour values under
  `:root[data-theme="dark"]`.
- The palette is a warm near-neutral cream, so photography supplies all the
  colour. **Radii are zero by design** — the layout reads as printed matter.
  They remain tokens so softening them later is one edit.
- **Light is the default theme for everyone**, whatever their OS is set to.
  Dark is opt-in through `data-theme="dark"` on `<html>`, never
  `prefers-color-scheme`. The toggle lives in the header, persists to
  `localStorage` under `tgc-theme`, and an inline script in the root layout
  applies the stored value before first paint so dark readers see no flash.
  `ThemeToggle` subscribes to the `<html>` attribute via `useSyncExternalStore`
  rather than mirroring it in React state, which also syncs across tabs.
- `--on-light-muted` is deliberately *not* restated for dark mode: it colours
  text on a light chip over a photograph, and a photograph does not change with
  the viewer's colour scheme.
- Primitives: `src/components/ui/` — `Text`, `Heading`, `Eyebrow`, `Card`,
  `Button`, `TextLink`/`ButtonLink`, `Badge`, `Divider`, `Container`,
  `FullBleed`, `MediaTile`, `SectionHeader`. Variants use
  `class-variance-authority`; `as` polymorphism goes through `PolymorphicProps`.
- `Heading` takes an `accent` prop rendered in the display italic — "Read the
  *journal*". That mixed roman/italic line is the signature of the design, so
  it is a first-class prop rather than markup each caller reproduces. `accent`
  only appends; for an italic that falls mid-sentence ("Notes from a *greener*
  closet.") compose with the exported `<Accent>` instead.
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
scale value to that config** — `text-lede` is in there for exactly this
reason.

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

## Backoffice editor

`/admin` lists every post including drafts, and `/admin/posts/new` and
`/admin/posts/[id]` create and edit them.

- **Posts are written in Markdown.** `content` holds the author's Markdown
  exactly as typed — sanitizing on write would mean storing HTML and destroying
  the source. Rendering goes Markdown → HTML → sanitize, and **render time is
  the only security boundary**, so nothing may assume the column is clean.
- Actions call `requireAdmin()` themselves. A Server Action is a public POST
  endpoint reachable without ever loading a page, so the form's UI guarantees
  nothing.
- Input is validated with Zod and the slug is re-slugified server-side rather
  than trusted, so a crafted request cannot put a path separator into a URL.
- Categories are a free-text field, found or created on save. A separate CRUD
  screen would be more work to build and use than a handful of categories
  justifies.
- Every mutation calls `revalidatePath` for the affected pages. A rename
  repaints the old slug too, or the previous URL keeps serving a stale copy.
- `publishedAt` is set when a post first goes live and preserved across later
  edits.

## Backoffice authentication

GitHub OAuth. No password is stored, so there is no reset flow, nothing to leak,
and the account's own 2FA is inherited. Brute force is not a threat because
there is no credential to guess here.

- **Identity is not permission.** Any GitHub user can complete the OAuth flow,
  so `ADMIN_GITHUB_LOGIN` is what actually grants access. Without it the
  callback would issue an admin session to anyone.
- **Sessions are opaque and server-side**, not JWTs, so signing out revokes
  access immediately. Only a SHA-256 of the token is stored — a database leak
  yields no usable cookie. Expiry is absolute and part of the lookup query, so
  an expired row cannot be mistaken for valid.
- **`state` is the CSRF defence** on the OAuth round trip, compared in constant
  time and single-use. `sameSite: "lax"` is required rather than preferred:
  `strict` would withhold the cookie on the top-level redirect back from GitHub
  and break every login.
- **The authorization boundary is the DAL** (`src/server/auth/dal.ts`), not a
  layout, not middleware. Layouts do not re-render on navigation, middleware is
  documented as suitable only for optimistic redirects, and a Server Action is a
  public POST endpoint that bypasses pages entirely. **Every server action and
  admin query must call `requireAdmin()` itself.**
- `requireAdminOrRedirect` is for pages; `requireAdmin` throws and is for
  actions, where a redirect would be the wrong answer to a direct POST.
- The `next` parameter is validated by `isSafeReturnPath`, so a crafted login
  link cannot turn sign-in into an open redirect.
- Logout is POST-only; a GET would let any page sign the admin out with an
  image tag.

**Known gap:** admin pages still run under the site-wide CSP, which allows
inline scripts. The session cookie is `httpOnly`, so an XSS bug could not
exfiltrate it, but a nonce-based CSP for the `(admin)` group is worth adding
before the editor renders any user-authored content.

## SEO

- `metadataBase` in the root layout; `buildPageMetadata` (`src/lib/metadata.ts`)
  emits relative canonical and Open Graph URLs so previews resolve correctly.
- Open Graph card generated at build time by `src/app/opengraph-image.tsx`.
- `robots.ts` and `sitemap.ts` cover posts and categories.

## Environment

- Public: `NEXT_PUBLIC_SITE_URL` (validated by `src/lib/env.ts`).
- Server-only: `DATABASE_URL` (validated by `src/lib/env.server.ts`, which
  imports `server-only` so it cannot be pulled into a client bundle). Never
  prefix a secret with `NEXT_PUBLIC_`.
- Local: set in `.env.local`; template in `.env.example`. `neon link` writes the
  Neon variables there.
- Database commands (`db:migrate`, `db:seed`) are plain Node processes and load
  `.env.local` themselves via `process.loadEnvFile`; Next does it automatically
  for the app.

## Checks

- Lint: `pnpm lint`
- Types: `pnpm type-check`
- Unit: `pnpm test`
- E2E: `pnpm e2e` — runs against a **production** server (`build && start`),
  because the CSP differs in dev.
