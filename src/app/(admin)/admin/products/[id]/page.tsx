import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExternalLink } from "@/components/ui/link";
import {
  deleteProductAction,
  updateProductAction,
} from "@/features/admin/actions/product.actions";
import { ProductForm } from "@/features/admin/components/product-form";
import { centsToInput } from "@/features/shop/lib/parse-price";
import { requireAdminOrRedirect } from "@/server/auth/dal";
import { getDb } from "@/server/db/client";
import { findProductById } from "@/server/db/products.repository";

export const metadata: Metadata = { title: "Edit product" };
export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  await requireAdminOrRedirect(`/admin/products/${id}`);

  const product = await findProductById(getDb(), id);
  if (!product) notFound();

  // Bound here rather than carried in a hidden field a caller could change.
  const action = updateProductAction.bind(null, product.id);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-step-3 font-normal text-ink">Edit product</h1>
        </div>
        <ExternalLink href={product.productUrl} tone="muted" underline="hover">
          View on store &rarr;
        </ExternalLink>
      </div>

      <ProductForm
        action={action}
        submitLabel="Save changes"
        initial={{
          name: product.name,
          brandName: product.brandName,
          imageUrl: product.imageUrl,
          hoverImageUrl: product.hoverImageUrl ?? "",
          productUrl: product.productUrl,
          price: centsToInput(product.priceCents),
          isWeeklyPick: product.isWeeklyPick,
        }}
      />

      <form action={deleteProductAction} className="mt-12 border-t border-border pt-6">
        <input type="hidden" name="productId" value={product.id} />
        <button
          type="submit"
          className="h-9 border border-border px-4 text-step-0 text-ink-muted transition-colors hover:border-ink hover:text-ink"
        >
          Remove from shop
        </button>
      </form>
    </main>
  );
}
