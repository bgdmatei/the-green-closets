import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "./polymorphic";

const textVariants = cva("", {
  variants: {
    tone: {
      default: "text-ink",
      muted: "text-ink-muted",
      inverse: "text-ink-inverse",
      brand: "text-brand",
    },
    size: {
      xs: "text-step--1",
      sm: "text-step-0",
      md: "text-step-1",
      /** The standfirst under a page title. */
      lede: "text-lede",
      lg: "text-step-2",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
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
      relaxed: "leading-relaxed",
    },
    /** Small-caps eyebrow used for category labels and dates. */
    uppercase: {
      true: "uppercase tracking-[0.12em]",
      false: "",
    },
  },
  defaultVariants: {
    tone: "default",
    size: "md",
    weight: "normal",
    align: "left",
    leading: "normal",
    uppercase: false,
  },
});

type TextElement = "p" | "span" | "div" | "label" | "small" | "time";

type TextProps<T extends TextElement> = PolymorphicProps<
  T,
  VariantProps<typeof textVariants>
>;

/**
 * Body copy. For anything that sits in the heading hierarchy, use `Heading` —
 * it carries the display face and the larger end of the type scale.
 */
export function Text<T extends TextElement = "p">({
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
}: TextProps<T>) {
  const Tag = (as ?? "p") as React.ElementType;
  return (
    <Tag
      className={cn(
        textVariants({ tone, size, weight, align, leading, uppercase }),
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
