import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * A list.
 *
 * Renders `ul`/`li` because that is what a list *is* — a screen reader
 * announces "list, 3 items" and offers list navigation, which a `div` cannot.
 * Wrapping them here means the semantics live in one file instead of being
 * repeated as raw markup across pages.
 *
 * `unstyled` exists for cases where the list is a layout grid whose items are
 * self-contained cards; the element still carries the semantics.
 */
const listVariants = cva("list-none", {
  variants: {
    layout: {
      /** Vertical rhythm, no rules. */
      stack: "flex flex-col",
      /** Hairlines between entries, nothing above the first or below the last. */
      divided: "divide-y divide-border",
      /** Responsive columns. */
      grid: "grid",
      /** Horizontal, for navigation. */
      inline: "flex flex-wrap items-center",
    },
    gap: {
      none: "",
      xs: "gap-2",
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-12",
    },
    columns: {
      none: "",
      2: "sm:grid-cols-2",
      3: "sm:grid-cols-2 md:grid-cols-3",
      4: "grid-cols-2 md:grid-cols-4",
    },
  },
  defaultVariants: { layout: "stack", gap: "md", columns: "none" },
});

interface ListProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof listVariants> {}

export function List({ layout, gap, columns, className, ...props }: ListProps) {
  return (
    <ul
      className={cn(listVariants({ layout, gap, columns }), className)}
      {...props}
    />
  );
}

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /**
   * Removes the item's own box so its child becomes the grid or flex item.
   * Useful when the child is a self-contained card that should stretch.
   */
  transparent?: boolean;
}

export function ListItem({ transparent, className, ...props }: ListItemProps) {
  return (
    <li className={cn(transparent && "contents", className)} {...props} />
  );
}
