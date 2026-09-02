import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { NavLinks } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";

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

        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          {/*
            `min-w-0` is load-bearing: a flex child defaults to `min-width: auto`,
            so without it the nav refuses to shrink below its content width, the
            inner `overflow-x-auto` never engages, and the whole page scrolls
            sideways on a narrow screen.
          */}
          <nav aria-label="Primary" className="min-w-0">
            <NavLinks />
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
