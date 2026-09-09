"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { List, ListItem } from "@/components/ui/list";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/journal", label: "Journal" },
  { href: "/week-picks", label: "Week's picks" },
  { href: "/shop", label: "Shop all" },
  { href: "/about", label: "About" },
];

/**
 * A client component only so the current route can be highlighted.
 *
 * These are same-origin routes, so `next/link` is the right tool: it prefetches
 * each destination as it enters the viewport and navigates client-side. The
 * component already ships to the browser for `usePathname`, so this costs
 * nothing extra.
 */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <List layout="inline" gap="none" className="-mx-1 gap-x-5 overflow-x-auto px-1 sm:gap-x-7">
      {NAV_LINKS.map((link) => {
        // A section is current for its own page and anything nested under it.
        const isCurrent =
          pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <ListItem key={link.href} className="shrink-0">
            <Link
              href={link.href}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "text-step-0 transition-colors hover:underline underline-offset-4",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                isCurrent ? "text-brand" : "text-ink hover:text-ink-muted",
              )}
            >
              {link.label}
            </Link>
          </ListItem>
        );
      })}
    </List>
  );
}
