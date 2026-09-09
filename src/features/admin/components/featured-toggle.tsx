"use client";

import { useRef } from "react";

import { toggleWeeklyPickAction } from "@/features/admin/actions/product.actions";

interface FeaturedToggleProps {
  productId: string;
  /** Named in the accessible label, so the control is not just "Featured". */
  productName: string;
  featured: boolean;
}

/**
 * The featured checkbox in the product list.
 *
 * A real checkbox rather than a button, so its state is conveyed to assistive
 * technology by the control itself instead of by its wording. Submitting on
 * change needs the client, which is the whole reason this is a client
 * component — everything else on the page is server-rendered.
 *
 * The action still re-checks authorization: this form is a public POST endpoint
 * regardless of what the UI does.
 */
export function FeaturedToggle({
  productId,
  productName,
  featured,
}: FeaturedToggleProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const id = `featured-${productId}`;

  return (
    <form ref={formRef} action={toggleWeeklyPickAction} className="shrink-0">
      <input type="hidden" name="productId" value={productId} />
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-2 text-step--2 uppercase tracking-[0.1em] text-ink-muted transition-colors hover:text-ink"
      >
        <input
          id={id}
          type="checkbox"
          defaultChecked={featured}
          aria-label={`Featured: ${productName}`}
          onChange={() => formRef.current?.requestSubmit()}
          className="size-4 cursor-pointer accent-ink"
        />
        Featured
      </label>
      {/*
        Without client JS the change handler never fires, so this keeps the
        control usable — it is hidden once JS is running.
      */}
      <noscript>
        <button type="submit" className="mt-1 border border-border px-2 text-step--2">
          Save
        </button>
      </noscript>
    </form>
  );
}
