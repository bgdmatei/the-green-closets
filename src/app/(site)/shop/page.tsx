import type { Metadata } from "next";
import { Text } from "@/components/ui/text";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getProducts } from "@/features/shop/api/shop.services";
import { ProductGrid } from "@/features/shop/components/product-grid";
import { buildPageMetadata } from "@/lib/metadata";

export const generateMetadata = async (): Promise<Metadata> =>
  buildPageMetadata({
    title: "Shop all",
    description:
      "Every piece currently carried by The Green Closets, pulled live from each brand's own store.",
    path: "/shop",
  });

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <section className="py-14 md:py-20">
      <Container className="space-y-10">
        <SectionHeader as="h1" title="Shop" accent="every brand" />
        <Text leading="relaxed" tone="muted" className="max-w-prose">
          {products.length} pieces from the brands we carry. Prices and
          availability come from each brand&apos;s own store, and checkout
          happens there.
        </Text>
        <ProductGrid products={products} priorityCount={4} />
      </Container>
    </section>
  );
}
