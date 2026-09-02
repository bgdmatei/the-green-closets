import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "./polymorphic";

const eyebrowVariants = cva(
  "block text-step--2 uppercase tracking-[0.1em] leading-none",
  {
    variants: {
      tone: {
        muted: "text-ink-muted",
        default: "text-ink",
        inverse: "text-ink-inverse/80",
      },
    },
    defaultVariants: {
      tone: "muted",
    },
  },
);

type EyebrowElement = "p" | "span" | "div" | "time" | "h2" | "h3";

type EyebrowProps<T extends EyebrowElement> = PolymorphicProps<
  T,
  VariantProps<typeof eyebrowVariants>
>;

/**
 * The small wide-tracked uppercase label that sits above a display heading —
 * "THE JOURNAL", "BRANDS", or a product's brand name.
 */
export function Eyebrow<T extends EyebrowElement = "p">({
  as,
  tone,
  className,
  children,
  ...props
}: EyebrowProps<T>) {
  const Tag = (as ?? "p") as React.ElementType;
  return (
    <Tag className={cn(eyebrowVariants({ tone }), className)} {...props}>
      {children}
    </Tag>
  );
}
