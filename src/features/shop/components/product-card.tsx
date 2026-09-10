import Image from "next/image";
import { ExternalLink } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

import { Eyebrow } from "@/components/ui/eyebrow";
import { formatDomain } from "@/features/shop/lib/format-domain";
import { formatPrice } from "@/features/shop/lib/format-price";
import type { ProductWithBrand } from "@/features/shop/types/shop.types";
import { canOptimizeImage } from "@/lib/image-hosts";

interface ProductCardProps {
  product: ProductWithBrand;
  /** Set on the first row of the first grid so the images are not lazy. */
  priority?: boolean;
}

const GRID_SIZES =
  "(min-width: 1280px) 296px, (min-width: 768px) 25vw, 50vw";

/**
 * A product tile: 3:4 image, then brand and price, the product name, and
 * the destination host.
 *
 * Checkout happens on the brand's own store, so the whole card is an outbound
 * link rather than a route in this app.
 */
export const ProductCard = ({ product, priority }: ProductCardProps) => {
  const price = formatPrice(product.priceCents, product.currency);
  const domain = formatDomain(product.productUrl);

  return (
    <ExternalLink
      href={product.productUrl}
      rel="nofollow"
      underline="never"
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-raised">
        {canOptimizeImage(product.imageUrl) ? (
          <Image
            src={product.imageUrl}
            alt={`${product.name}${product.colour ? ` in ${product.colour}` : ""}`}
            fill
            priority={priority}
            sizes={GRID_SIZES}
            className="object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={`${product.name}${product.colour ? ` in ${product.colour}` : ""}`}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        )}
        {product.hoverImageUrl ? (
          // Second shot cross-fades in on hover. Decorative: it shows the same
          // garment the primary image already named.
          canOptimizeImage(product.hoverImageUrl) ? (
            <Image
              src={product.hoverImageUrl}
              alt=""
              aria-hidden
              fill
              sizes={GRID_SIZES}
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.hoverImageUrl}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )
        ) : null}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <Eyebrow as="span">{product.brand.name}</Eyebrow>
        <span className="text-step-0 tabular-nums text-ink">{price}</span>
      </div>
      <Text size="sm" className="mt-1 truncate group-hover:underline underline-offset-4">
        {product.name}
      </Text>

      {/*
        Names where the click actually goes. This shop holds no stock, so a
        reader is always about to leave for the brand's own site — saying so
        before the click is more honest than after it.
      */}
      {domain ? (
        <Text
          as="span"
          size="xs"
          tone="muted"
          className="mt-1 flex items-center gap-1 truncate"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="shrink-0"
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
          {domain}
        </Text>
      ) : null}
    </ExternalLink>
  );
};
