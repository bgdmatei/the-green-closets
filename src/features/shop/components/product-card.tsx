import Image from "next/image";

import { Eyebrow } from "@/components/ui/eyebrow";
import { formatPrice } from "@/features/shop/lib/format-price";
import type { ProductWithBrand } from "@/features/shop/types/shop.types";

interface ProductCardProps {
  product: ProductWithBrand;
  /** Set on the first row of the first grid so the images are not lazy. */
  priority?: boolean;
}

const GRID_SIZES =
  "(min-width: 1280px) 296px, (min-width: 768px) 25vw, 50vw";

/**
 * A product tile: 3:4 image, then brand, name and price on one meta row.
 *
 * Checkout happens on the brand's own store, so the whole card is an outbound
 * link rather than a route in this app.
 */
export const ProductCard = ({ product, priority }: ProductCardProps) => {
  const price = formatPrice(product.priceCents, product.currency);

  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-raised">
        <Image
          src={product.imageUrl}
          alt={`${product.name}${product.colour ? ` in ${product.colour}` : ""}`}
          fill
          priority={priority}
          sizes={GRID_SIZES}
          className="object-cover"
        />
        {product.hoverImageUrl ? (
          // Second shot cross-fades in on hover. Decorative: it shows the same
          // garment the primary image already named.
          <Image
            src={product.hoverImageUrl}
            alt=""
            aria-hidden
            fill
            sizes={GRID_SIZES}
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        ) : null}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <Eyebrow as="span">{product.brand.name}</Eyebrow>
        <span className="text-step-0 tabular-nums text-ink">{price}</span>
      </div>
      <p className="mt-1 truncate text-step-0 text-ink group-hover:underline underline-offset-4">
        {product.name}
      </p>
    </a>
  );
};
