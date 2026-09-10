import type { Metadata } from "next";
import Link from "next/link";

import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/link";
import { List, ListItem } from "@/components/ui/list";
import { Text } from "@/components/ui/text";
import { FeaturedToggle } from "@/features/admin/components/featured-toggle";
import { formatPrice } from "@/features/shop/lib/format-price";
import { requireAdminOrRedirect } from "@/server/auth/dal";
import { getDb } from "@/server/db/client";
import { listProductsForAdmin } from "@/server/db/products.repository";

export const metadata: Metadata = { title: "Shop" };

export default async function AdminProductsPage() {
  // Still gated here: the layout reads the session but does not enforce it.
  await requireAdminOrRedirect("/admin/products");
  const items = await listProductsForAdmin(getDb());
  const picks = items.filter((item) => item.isWeeklyPick).length;
  // Built as a string rather than interleaved JSX: whitespace around an
  // expression that wraps across lines is not reliably preserved, which had
  // been rendering "4in this week's picks".
  const summary = `${items.length} item${items.length === 1 ? "" : "s"}, ${picks} in this week's picks.`;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14">
      <h1 className="text-step-3 font-normal text-ink">Shop</h1>

      {/*
        The add action sits with the table it acts on rather than in the page
        header, where it competed with the title.
      */}
      <div className="mt-12 flex items-baseline justify-between gap-4">
        <Eyebrow as="h2">{summary}</Eyebrow>
        <ButtonLink href="/admin/products/new" variant="subtle" size="sm">
          Add product
        </ButtonLink>
      </div>

      {items.length === 0 ? (
        <Text size="sm" tone="muted" className="mt-4 border border-border bg-surface p-6">
          Nothing in the shop yet.
        </Text>
      ) : (
        <List layout="divided" gap="none" className="mt-4 border-y border-border">
          {items.map((item) => (
            <ListItem key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt=""
                className="size-12 shrink-0 bg-surface-raised object-cover"
                loading="lazy"
              />
              <div className="min-w-0">
                <Eyebrow as="span">{item.brandName}</Eyebrow>
                <Link
                  href={`/admin/products/${item.id}`}
                  className="block truncate text-step-0 text-ink hover:underline underline-offset-4"
                >
                  {item.name}
                </Link>
              </div>

              <Text as="span" size="sm" className="ml-auto tabular-nums">
                {formatPrice(item.priceCents, item.currency)}
              </Text>
              <FeaturedToggle
                productId={item.id}
                productName={item.name}
                featured={item.isWeeklyPick}
              />
            </ListItem>
          ))}
        </List>
      )}
    </main>
  );
}
