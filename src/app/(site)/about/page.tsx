import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { List, ListItem } from "@/components/ui/list";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/link";
import { getBrands } from "@/features/shop/api/shop.services";
import { buildPageMetadata } from "@/lib/metadata";

export const generateMetadata = async (): Promise<Metadata> =>
  buildPageMetadata({
    title: "About",
    description:
      "Why The Green Closets exists, how brands are chosen, and how the shop makes its money.",
    path: "/about",
  });

export default async function AboutPage() {
  const brands = await getBrands();

  return (
    <section className="py-14 md:py-20">
      <Container width="prose" className="space-y-10">
        <div className="space-y-5">
          <Eyebrow>About</Eyebrow>
          <Heading as="h1" size="lg" accent="closets">
            The Green
          </Heading>
          <Text tone="muted" leading="relaxed">
            An independent shop stitching together live product feeds from
            fashion brands we curate and rate ourselves. We are not a
            marketplace and we hold no stock — every piece links out to the
            brand&apos;s own store, where checkout happens.
          </Text>
        </div>

        <div className="space-y-4 border-t border-border pt-10">
          <Eyebrow as="h2">How brands are chosen</Eyebrow>
          <Text tone="muted" leading="relaxed">
            We look for published supply chains, recognised certification, and
            materials that survive more than a season. A brand earns its place
            here on evidence, not on a sustainability page.
          </Text>
        </div>

        <div className="space-y-4 border-t border-border pt-10">
          <Eyebrow as="h2">Brands we carry</Eyebrow>
          <List gap="sm">
            {brands.map((brand) => (
              <ListItem key={brand.slug}>
                <TextLink
                  href={`/brands/${brand.slug}`}
                  tone="default"
                  underline="hover"
                >
                  {brand.name}
                </TextLink>
                <Text size="sm" tone="muted" leading="relaxed" className="mt-1">
                  {brand.summary}
                </Text>
              </ListItem>
            ))}
          </List>
        </div>

        <div className="space-y-4 border-t border-border pt-10">
          <Eyebrow as="h2">Prices</Eyebrow>
          <Text tone="muted" leading="relaxed">
            Prices, availability and product data are pulled live from each
            brand&apos;s own store, so what you see here should match what you
            find there. When it doesn&apos;t, the brand&apos;s store is right.
          </Text>
        </div>
      </Container>
    </section>
  );
}
