import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "./polymorphic";

const containerVariants = cva("mx-auto w-full px-4 sm:px-6", {
  variants: {
    width: {
      /** Long-form reading measure. */
      prose: "max-w-2xl",
      /** Default page width. */
      default: "max-w-6xl",
      wide: "max-w-7xl",
    },
  },
  defaultVariants: {
    width: "default",
  },
});

type ContainerElement =
  | "div"
  | "section"
  | "header"
  | "footer"
  | "main"
  | "article";

type ContainerProps<T extends ContainerElement> = PolymorphicProps<
  T,
  VariantProps<typeof containerVariants>
>;

/**
 * Constrains and pads content. The root layout deliberately does *not* set a
 * width — each section opts in with `Container`, so a `FullBleed` section can
 * simply not use one instead of fighting a constrained parent.
 */
export function Container<T extends ContainerElement = "div">({
  as,
  width,
  className,
  children,
  ...props
}: ContainerProps<T>) {
  const Tag = (as ?? "div") as React.ElementType;
  return (
    <Tag className={cn(containerVariants({ width }), className)} {...props}>
      {children}
    </Tag>
  );
}
