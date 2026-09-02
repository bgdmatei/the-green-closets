import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "./polymorphic";

const headingVariants = cva("font-display text-balance", {
  variants: {
    tone: {
      default: "text-ink",
      muted: "text-ink-muted",
      inverse: "text-ink-inverse",
      brand: "text-brand",
    },
    /**
     * Visual size, deliberately separate from the element. Pick `as` for
     * document structure and `size` for how loud it should look.
     */
    size: {
      xs: "text-step-1",
      sm: "text-step-2",
      md: "text-step-3",
      lg: "text-step-4",
      xl: "text-step-5",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      normal: "leading-normal",
    },
    uppercase: {
      true: "uppercase tracking-[0.08em]",
      false: "",
    },
  },
  defaultVariants: {
    tone: "default",
    size: "md",
    weight: "normal",
    align: "left",
    leading: "tight",
    uppercase: false,
  },
});

/**
 * `p`, `span` and `div` are here for display type that is not part of the
 * document outline — a wordmark, a pull quote — so heading levels stay
 * meaningful for assistive technology.
 */
type HeadingElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div";

type HeadingProps<T extends HeadingElement> = PolymorphicProps<
  T,
  VariantProps<typeof headingVariants>
>;

export function Heading<T extends HeadingElement = "h2">({
  as,
  tone,
  size,
  weight,
  align,
  leading,
  uppercase,
  className,
  children,
  ...props
}: HeadingProps<T>) {
  const Tag = (as ?? "h2") as React.ElementType;
  return (
    <Tag
      className={cn(
        headingVariants({ tone, size, weight, align, leading, uppercase }),
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
