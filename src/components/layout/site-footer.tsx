import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { TextLink } from "@/components/ui/link";
import { getBrands } from "@/features/shop/api/shop.services";

export async function SiteFooter() {
  const brands = await getBrands();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border">
      <Container className="grid gap-10 py-14 md:grid-cols-3 md:gap-8">
        <div className="max-w-xs space-y-3">
          <p className="font-display text-step-2 leading-none text-ink">
            The Green Closets
          </p>
          <p className="text-step-0 leading-relaxed text-ink-muted">
            An independent shop stitching together live product feeds from
            fashion brands we curate and rate ourselves.
          </p>
        </div>

        <div className="space-y-3">
          <Eyebrow as="h2">Brands</Eyebrow>
          <ul className="space-y-2">
            {brands.map((brand) => (
              <li key={brand.slug}>
                <TextLink
                  href={`/brands/${brand.slug}`}
                  tone="default"
                  underline="hover"
                >
                  {brand.name}
                </TextLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-sm space-y-3">
          <Eyebrow as="h2">Note</Eyebrow>
          <p className="text-step-0 leading-relaxed text-ink-muted">
            Prices, availability and product data are pulled live from each
            brand&apos;s own store. Checkout happens on the brand&apos;s site.
          </p>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="py-6">
          <p className="text-center text-step--1 text-ink-muted">
            &copy; {year} The Green Closets.
          </p>
        </Container>
      </div>
    </footer>
  );
}
