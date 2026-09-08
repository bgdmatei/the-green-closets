"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  productInputSchema,
  productSlug,
  readProductForm,
} from "@/features/admin/lib/product-schema";
import { slugify } from "@/features/admin/lib/slug";
import { requireAdmin } from "@/server/auth/dal";
import { getDb } from "@/server/db/client";
import {
  createProduct,
  deleteProduct,
  findOrCreateBrand,
  findProductById,
  productSlugTaken,
  updateProduct,
} from "@/server/db/products.repository";

export interface ActionState {
  error?: string;
}

/** Every surface a product can appear on. */
const revalidateShop = () => {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/week-picks");
  revalidatePath("/sitemap.xml");
};

const parseSubmission = async (formData: FormData, excludeId?: string) => {
  const parsed = productInputSchema.safeParse(readProductForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "That product is not valid" };
  }

  const values = parsed.data;
  const slug = productSlug(values.brandName, values.name);
  if (!slug) return { error: "That brand and title cannot be turned into a URL" };

  const db = getDb();
  if (await productSlugTaken(db, slug, excludeId)) {
    return { error: `"${values.brandName} ${values.name}" is already in the shop` };
  }

  // The brand's store is inferred from the product link's origin, so adding a
  // product never requires typing the brand's homepage separately.
  const storeUrl = (() => {
    try {
      return new URL(values.productUrl).origin;
    } catch {
      return null;
    }
  })();

  const brandId = await findOrCreateBrand(
    db,
    values.brandName,
    slugify(values.brandName),
    storeUrl,
  );

  return { values, slug, brandId };
};

export const createProductAction = async (
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  // Re-checked here: a Server Action is reachable by direct POST without ever
  // rendering the form that calls it.
  await requireAdmin();

  const result = await parseSubmission(formData);
  if ("error" in result) return result;

  await createProduct(getDb(), {
    slug: result.slug,
    name: result.values.name,
    brandId: result.brandId,
    priceCents: result.values.price,
    imageUrl: result.values.imageUrl,
    hoverImageUrl: result.values.hoverImageUrl,
    productUrl: result.values.productUrl,
    isWeeklyPick: result.values.isWeeklyPick,
  });

  revalidateShop();
  redirect("/admin/products");
};

export const updateProductAction = async (
  productId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();

  if (!(await findProductById(getDb(), productId))) {
    return { error: "That product no longer exists" };
  }

  const result = await parseSubmission(formData, productId);
  if ("error" in result) return result;

  await updateProduct(getDb(), productId, {
    slug: result.slug,
    name: result.values.name,
    brandId: result.brandId,
    priceCents: result.values.price,
    imageUrl: result.values.imageUrl,
    hoverImageUrl: result.values.hoverImageUrl,
    productUrl: result.values.productUrl,
    isWeeklyPick: result.values.isWeeklyPick,
  });

  revalidateShop();
  redirect("/admin/products");
};

export const deleteProductAction = async (formData: FormData): Promise<void> => {
  await requireAdmin();

  const productId = String(formData.get("productId") ?? "");
  if (await findProductById(getDb(), productId)) {
    await deleteProduct(getDb(), productId);
    revalidateShop();
  }

  redirect("/admin/products");
};

/**
 * Toggles a product in or out of the weekly edit straight from the list, which
 * is the whole point of the flag living on the product.
 */
export const toggleWeeklyPickAction = async (
  formData: FormData,
): Promise<void> => {
  await requireAdmin();

  const productId = String(formData.get("productId") ?? "");
  const current = await findProductById(getDb(), productId);
  if (!current) redirect("/admin/products");

  const db = getDb();
  const brandId = (await findOrCreateBrand(
    db,
    current.brandName,
    slugify(current.brandName),
    null,
  ));

  await updateProduct(db, productId, {
    slug: current.slug,
    name: current.name,
    brandId,
    priceCents: current.priceCents,
    imageUrl: current.imageUrl,
    hoverImageUrl: current.hoverImageUrl ?? null,
    productUrl: current.productUrl,
    isWeeklyPick: !current.isWeeklyPick,
  });

  revalidateShop();
  redirect("/admin/products");
};
