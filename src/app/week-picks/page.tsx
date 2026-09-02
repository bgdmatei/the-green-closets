import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { MediaTile } from "@/components/ui/media-tile";
import { SectionHeader } from "@/components/ui/section-header";
import { getWeeklyPicks } from "@/features/shop/api/shop.services";
import { ProductGrid } from "@/features/shop/components/product-grid";
import { buildPageMetadata } from "@/lib/metadata";

export const generateMetadata = async (): Promise<Metadata> =>
  buildPageMetadata({
    title: "This week's picks",
    description:
      "A short edit of the pieces we would buy this week, refreshed every Monday.",
    path: "/week-picks",
  });

export default async function WeekPicksPage() {
  const picks = await getWeeklyPicks();

  return (
    <>
      <section className="border-b border-border py-6 md:py-8">
        <Container>
          <h1 className="sr-only">This week&apos;s picks</h1>
          <MediaTile
            href="/shop"
            src="/images/banners/weekly.jpg"
            ratio="banner"
            eyebrow="Fresh every Monday"
            title="This week's"
            accent="picks"
            priority
            sizes="(min-width: 1280px) 1232px, 100vw"
          />
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="space-y-10">
          <SectionHeader
            title="The"
            accent="edit"
            action={{ href: "/shop", label: "Shop all" }}
          />
          <ProductGrid products={picks} priorityCount={4} />
        </Container>
      </section>
    </>
  );
}
