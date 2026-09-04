import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { List, ListItem } from "@/components/ui/list";
import { Text } from "@/components/ui/text";
import { TextLink } from "@/components/ui/link";
import { getBrands } from "@/features/shop/api/shop.services";

export async function SiteFooter() {
  const brands = await getBrands();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border">
      <Container className="grid gap-10 py-14 md:grid-cols-3 md:gap-8">
        <div className="max-w-xs space-y-3">
          <Heading as="p" size="xs" className="leading-none">
            The Green Closets
          </Heading>
          <Text size="sm" tone="muted" leading="relaxed">
            An independent shop stitching together live product feeds from
            fashion brands we curate and rate ourselves.
          </Text>
        </div>

        <div className="space-y-3">
          <Eyebrow as="h2">Brands</Eyebrow>
          <List gap="xs">
            {brands.map((brand) => (
              <ListItem key={brand.slug}>
                <TextLink
                  href={`/brands/${brand.slug}`}
                  tone="default"
                  underline="hover"
                >
                  {brand.name}
                </TextLink>
              </ListItem>
            ))}
          </List>
        </div>

        <div className="max-w-sm space-y-3">
          <Eyebrow as="h2">Note</Eyebrow>
          <Text size="sm" tone="muted" leading="relaxed">
            Prices, availability and product data are pulled live from each
            brand&apos;s own store. Checkout happens on the brand&apos;s site.
          </Text>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="py-6">
          <Text size="xs" tone="muted" align="center">
            &copy; {year} The Green Closets.
          </Text>
        </Container>
      </div>
    </footer>
  );
}
