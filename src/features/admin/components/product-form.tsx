"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Text } from "@/components/ui/text";
import type { ActionState } from "@/features/admin/actions/product.actions";

interface ProductFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: {
    name: string;
    brandName: string;
    imageUrl: string;
    hoverImageUrl: string;
    productUrl: string;
    price: string;
    isWeeklyPick: boolean;
  };
  submitLabel: string;
}

const field =
  "w-full border border-border bg-surface px-3 py-2 text-step-0 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const label = "block text-step--2 uppercase tracking-[0.1em] text-ink-muted";

export function ProductForm({ action, initial, submitLabel }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {state.error ? (
        <Text role="alert" size="sm" className="border border-border bg-surface p-4">
          {state.error}
        </Text>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={label} htmlFor="brandName">Brand</label>
          <input id="brandName" name="brandName" className={field} defaultValue={initial?.brandName} required maxLength={80} />
          <Text size="xs" tone="muted">Created if new.</Text>
        </div>

        <div className="space-y-2">
          <label className={label} htmlFor="price">Price</label>
          <input id="price" name="price" className={field} defaultValue={initial?.price} required inputMode="decimal" placeholder="150" />
          <Text size="xs" tone="muted">In euros. 150 or 19.99.</Text>
        </div>
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor="name">Title</label>
        <input id="name" name="name" className={field} defaultValue={initial?.name} required maxLength={200} />
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor="imageUrl">Image URL</label>
        <input id="imageUrl" name="imageUrl" type="url" className={field} defaultValue={initial?.imageUrl} required maxLength={2000} placeholder="https://…" />
        <Text size="xs" tone="muted">
          Any https address. Images on known hosts are optimised automatically.
        </Text>
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor="hoverImageUrl">Hover image URL</label>
        <input id="hoverImageUrl" name="hoverImageUrl" type="url" className={field} defaultValue={initial?.hoverImageUrl} maxLength={2000} placeholder="https://…" />
        <Text size="xs" tone="muted">
          Optional. A second shot of the same garment, cross-faded in when the
          card is hovered. Leave it empty and the card simply holds still.
        </Text>
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor="productUrl">Website</label>
        <input id="productUrl" name="productUrl" type="url" className={field} defaultValue={initial?.productUrl} required maxLength={2000} placeholder="https://…" />
        <Text size="xs" tone="muted">
          Link straight to this item on the brand&apos;s store — that is where
          the reader is sent, and the card shows its domain.
        </Text>
      </div>

      <div className="border border-border bg-surface p-4">
        <label className="flex items-start gap-3">
          <input type="checkbox" name="isWeeklyPick" defaultChecked={initial?.isWeeklyPick ?? false} className="mt-1" />
          <span>
            <Text as="span" size="sm" className="block">Featured</Text>
            <Text as="span" size="xs" tone="muted" className="mt-1 block">
              Appears in this week&apos;s picks. Everything in the shop stays
              listed either way.
            </Text>
          </span>
        </label>
      </div>

      <div className="flex items-center gap-4 border-t border-border pt-6">
        <button type="submit" disabled={pending} className="h-10 bg-ink px-5 text-step-0 text-surface transition-colors hover:bg-ink/85 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href="/admin/products" className="text-step-0 text-ink-muted hover:text-ink">
          Cancel
        </Link>
      </div>
    </form>
  );
}
