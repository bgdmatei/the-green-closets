import type { Metadata } from "next";
import { Text } from "@/components/ui/text";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { SectionHeader } from "@/components/ui/section-header";
import {
  getBrandBySlug,
  getBrands,
  getProductsByBrand,
} from "@/features/shop/api/shop.services";
import { ProductGrid } from "@/features/shop/components/product-grid";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async (): Promise<
  Array<{ slug: string }>
> => {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
};

export const generateMetadata = async ({
  params,
}: BrandPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return { title: "Brand not found" };
  }

  return buildPageMetadata({
    title: brand.name,
    description: brand.summary,
    path: `/brands/${brand.slug}`,
  });
};

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const [brand, products] = await Promise.all([
    getBrandBySlug(slug),
    getProductsByBrand(slug),
  ]);

  if (!brand) {
    notFound();
  }

  return (
    <>
      <section className="border-b border-border py-14 md:py-20">
        <Container className="max-w-[46rem] space-y-5 md:mx-auto">
          <Eyebrow>Brand</Eyebrow>
          <Heading as="h1" size="lg">
            {brand.name}
          </Heading>
          <Text leading="relaxed" tone="muted">
            {brand.summary}
          </Text>
          <a
            href={brand.storeUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex h-10 items-center border border-ink px-5 text-step-0 text-ink transition-colors hover:bg-ink hover:text-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Visit {brand.name} <span aria-hidden className="ml-2">&rarr;</span>
          </a>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="space-y-10">
          <SectionHeader
            title="Everything from"
            accent={brand.name}
            action={{ href: "/shop", label: "Shop all" }}
          />
          <ProductGrid products={products} priorityCount={4} />
        </Container>
      </section>
    </>
  );
}
