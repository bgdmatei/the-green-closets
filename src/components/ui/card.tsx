import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "./polymorphic";

const cardVariants = cva("flex flex-col rounded-xl", {
  variants: {
    surface: {
      /** Sits on the page ground, separated by a hairline. */
      plain: "bg-surface border border-border-subtle shadow-card",
      /** The house-green panel. Pair with inverse text. */
      raised: "bg-surface-raised text-ink-inverse shadow-raised",
      /** No ground of its own — for cards defined only by their image. */
      bare: "bg-transparent",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    surface: "plain",
    padding: "md",
  },
});

type CardElement = "div" | "article" | "section" | "li";

type CardProps<T extends CardElement> = PolymorphicProps<
  T,
  VariantProps<typeof cardVariants>
>;

export function Card<T extends CardElement = "div">({
  as,
  surface,
  padding,
  className,
  children,
  ...props
}: CardProps<T>) {
  const Tag = (as ?? "div") as React.ElementType;
  return (
    <Tag
      className={cn(cardVariants({ surface, padding }), className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
