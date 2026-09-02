import type { ComponentPropsWithoutRef, ElementType } from "react";

/**
 * Props for a primitive that renders a caller-chosen element via `as`.
 *
 * The element's own attributes come along with it — so `<Text as="time">`
 * accepts `dateTime` and `<Card as="li">` gets list-item attributes — while
 * variant names take precedence over any same-named DOM attribute (`size` on
 * `<input>`, for instance).
 */
export type PolymorphicProps<TElement extends ElementType, TVariants> = {
  as?: TElement;
} & TVariants &
  Omit<ComponentPropsWithoutRef<TElement>, "as" | "color" | keyof TVariants>;
