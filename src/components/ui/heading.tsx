import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "./polymorphic";

const headingVariants = cva(
  "font-display font-normal text-balance tracking-[-0.01em]",
  {
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
        xs: "text-step-2",
        sm: "text-step-3",
        md: "text-step-4",
        lg: "text-step-5",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      leading: {
        none: "leading-none",
        tight: "leading-[1.05]",
        normal: "leading-snug",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "md",
      align: "left",
      leading: "tight",
    },
  },
);

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
> & {
  /**
   * Rendered in the display face's italic, immediately after `children`.
   *
   * This is the signature of the design — "Read the *journal*", "New in the
   * *closet*" — so it is a first-class prop rather than markup callers have to
   * remember to write.
   */
  accent?: React.ReactNode;
};

/**
 * The display italic, for an accent that falls mid-sentence — "Notes from a
 * *greener* closet." The `accent` prop on `Heading` only appends, so compose
 * with this when the emphasised word is not the last one.
 */
export function Accent({ children }: { children: React.ReactNode }) {
  return <em className="italic">{children}</em>;
}

export function Heading<T extends HeadingElement = "h2">({
  as,
  tone,
  size,
  align,
  leading,
  accent,
  className,
  children,
  ...props
}: HeadingProps<T>) {
  const Tag = (as ?? "h2") as React.ElementType;
  return (
    <Tag
      className={cn(headingVariants({ tone, size, align, leading }), className)}
      {...props}
    >
      {children}
      {accent ? (
        <>
          {children ? " " : null}
          <em className="italic">{accent}</em>
        </>
      ) : null}
    </Tag>
  );
}
