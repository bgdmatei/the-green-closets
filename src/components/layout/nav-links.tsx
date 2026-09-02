"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/shop", label: "Shop all" },
  { href: "/week-picks", label: "Week's picks" },
  { href: "/journal", label: "Journal" },
  { href: "/brands/armedangels", label: "Armedangels" },
  { href: "/about", label: "About" },
];

/**
 * A client component only so the current route can be highlighted. Plain
 * anchors rather than next/link: these are top-level destinations, and the
 * whole site is statically prerendered, so a full navigation costs nothing and
 * keeps the shipped JS to the `usePathname` read.
 */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="-mx-1 flex items-center gap-x-5 overflow-x-auto px-1 sm:gap-x-7">
      {NAV_LINKS.map((link) => {
        // A section is current for its own page and anything nested under it.
        const isCurrent =
          pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <li key={link.href} className="shrink-0">
            <a
              href={link.href}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "text-step-0 transition-colors hover:underline underline-offset-4",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                isCurrent ? "text-brand" : "text-ink hover:text-ink-muted",
              )}
            >
              {link.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
