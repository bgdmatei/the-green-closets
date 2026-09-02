import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "./polymorphic";

const fullBleedVariants = cva("w-full", {
  variants: {
    surface: {
      none: "",
      page: "bg-surface",
      raised: "bg-surface-raised text-ink-inverse",
      sunken: "bg-surface-sunken",
    },
  },
  defaultVariants: {
    surface: "none",
  },
});

type FullBleedElement = "div" | "section" | "header" | "footer";

type FullBleedProps<T extends FullBleedElement> = PolymorphicProps<
  T,
  VariantProps<typeof fullBleedVariants>
>;

/**
 * An edge-to-edge band.
 *
 * This must be rendered at the top level of a page, as a sibling of
 * `Container` — never inside one. That is the whole reason the root layout no
 * longer constrains width: a band can simply be full width instead of clawing
 * its way out of a constrained parent with negative `100vw` margins, which
 * overflow horizontally because `100vw` includes the scrollbar.
 *
 * Constrain the band's contents by putting a `Container` inside it.
 */
export function FullBleed<T extends FullBleedElement = "section">({
  as,
  surface,
  className,
  children,
  ...props
}: FullBleedProps<T>) {
  const Tag = (as ?? "section") as React.ElementType;
  return (
    <Tag className={cn(fullBleedVariants({ surface }), className)} {...props}>
      {children}
    </Tag>
  );
}
