import type { Metadata } from "next";
import Link from "next/link";

import { Eyebrow } from "@/components/ui/eyebrow";
import { List, ListItem } from "@/components/ui/list";
import { Text } from "@/components/ui/text";
import { toggleWeeklyPickAction } from "@/features/admin/actions/product.actions";
import { formatPrice } from "@/features/shop/lib/format-price";
import { requireAdminOrRedirect } from "@/server/auth/dal";
import { getDb } from "@/server/db/client";
import { listProductsForAdmin } from "@/server/db/products.repository";

export const metadata: Metadata = { title: "Shop" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdminOrRedirect("/admin/products");
  const items = await listProductsForAdmin(getDb());
  const picks = items.filter((item) => item.isWeeklyPick).length;
  // Built as a string rather than interleaved JSX: whitespace around an
  // expression that wraps across lines is not reliably preserved, which had
  // been rendering "4in this week's picks".
  const summary = `${items.length} item${items.length === 1 ? "" : "s"}, ${picks} in this week's picks.`;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <Eyebrow>Backoffice</Eyebrow>
          <h1 className="mt-3 text-step-3 font-normal text-ink">Shop</h1>
          <Text size="sm" tone="muted" className="mt-2">
            {summary}
          </Text>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-step-0 text-ink-muted hover:text-ink">
            Posts
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center bg-ink px-5 text-step-0 text-surface transition-colors hover:bg-ink/85"
          >
            Add product
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <Text size="sm" tone="muted" className="mt-10 border border-border bg-surface p-6">
          Nothing in the shop yet.
        </Text>
      ) : (
        <List layout="divided" gap="none" className="mt-10 border-y border-border">
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

              {/*
                A form, not a link: toggling changes data, so it must be a POST
                that cannot be triggered by a prefetch or a crawler.
              */}
              <form action={toggleWeeklyPickAction}>
                <input type="hidden" name="productId" value={item.id} />
                <button
                  type="submit"
                  className={
                    item.isWeeklyPick
                      ? "h-8 border border-ink bg-ink px-3 text-step--2 uppercase tracking-[0.1em] text-surface"
                      : "h-8 border border-border px-3 text-step--2 uppercase tracking-[0.1em] text-ink-muted transition-colors hover:border-ink hover:text-ink"
                  }
                  aria-pressed={item.isWeeklyPick}
                >
                  {item.isWeeklyPick ? "In picks" : "Add to picks"}
                </button>
              </form>
            </ListItem>
          ))}
        </List>
      )}
    </main>
  );
}
