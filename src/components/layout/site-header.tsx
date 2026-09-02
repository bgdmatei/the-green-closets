import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { TextLink } from "@/components/ui/link";

const NAV_LINKS = [
  { href: "/shop", label: "Shop all" },
  { href: "/week-picks", label: "Week's picks" },
  { href: "/journal", label: "Journal" },
  { href: "/brands/armedangels", label: "Armedangels" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="font-display text-step-2 leading-none text-ink">
            The Green Closets
          </span>
          <Eyebrow as="span" className="hidden sm:block">
            Ethical shop
          </Eyebrow>
        </Link>

        {/*
          The link set is short enough to stay visible at every width; it
          scrolls horizontally on narrow screens rather than hiding behind a
          menu button, which would need client-side JavaScript on an otherwise
          fully static page.
        */}
        {/*
          `min-w-0` is load-bearing: a flex child defaults to `min-width: auto`,
          so without it the nav refuses to shrink below its content width, the
          inner `overflow-x-auto` never engages, and the whole page scrolls
          sideways on a narrow screen.
        */}
        <nav aria-label="Primary" className="min-w-0">
          <ul className="-mx-1 flex items-center gap-x-5 overflow-x-auto px-1 sm:gap-x-7">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="shrink-0">
                <TextLink href={link.href} tone="default" underline="hover">
                  {link.label}
                </TextLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
