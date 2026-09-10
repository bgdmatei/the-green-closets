import type { Metadata } from "next";

import { createProductAction } from "@/features/admin/actions/product.actions";
import { ProductForm } from "@/features/admin/components/product-form";
import { requireAdminOrRedirect } from "@/server/auth/dal";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  await requireAdminOrRedirect("/admin/products/new");

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      <h1 className="text-step-3 font-normal text-ink">Add product</h1>
      <ProductForm action={createProductAction} submitLabel="Add product" />
    </main>
  );
}
