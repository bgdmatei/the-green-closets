"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { List, ListItem } from "@/components/ui/list";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

/**
 * Backoffice sections. Add to this list to add a section — nothing else needs
 * to change, since the nav renders once in the `(admin)` layout.
 */
const SECTIONS = [
  { href: "/admin", label: "Posts" },
  { href: "/admin/products", label: "Shop" },
];

interface AdminNavProps {
  /** Shown on the sign-out control, so it is obvious who is signed in. */
  login: string;
}

export function AdminNav({ login }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
        <Eyebrow as="span">Backoffice</Eyebrow>

        <nav aria-label="Backoffice">
          <List layout="inline" gap="none" className="gap-x-5">
            {SECTIONS.map((section) => {
              // `/admin` would otherwise match every section, since they all
              // sit beneath it — so the root section matches exactly.
              const isCurrent =
                section.href === "/admin"
                  ? pathname === "/admin" || pathname.startsWith("/admin/posts")
                  : pathname.startsWith(section.href);

              return (
                <ListItem key={section.href}>
                  <Link
                    href={section.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "text-step-0 transition-colors",
                      isCurrent
                        ? "text-ink underline underline-offset-4 decoration-from-font"
                        : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {section.label}
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </nav>

        {/*
          POST, not a link: a GET would let any page sign the admin out with an
          image tag, and would be prefetchable.
        */}
        <form action="/api/auth/logout" method="post" className="ml-auto">
          <button
            type="submit"
            className="h-9 border border-border px-4 text-step-0 text-ink-muted transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Sign out {login}
          </button>
        </form>
      </div>
    </header>
  );
}
