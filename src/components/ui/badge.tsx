import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-step--1 uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        solid: "bg-brand text-brand-contrast",
        outline: "border border-border text-ink-muted",
        subtle: "bg-surface-sunken text-ink-muted",
        inverse: "border border-current/30 text-ink-inverse",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/** Category and topic labels. */
export function Badge({ variant, className, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
