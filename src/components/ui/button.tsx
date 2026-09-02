import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Shared by `Button` and by `ButtonLink` in `./link`, so a button and a link
 * that look alike stay alike.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-brand text-brand-contrast hover:bg-brand-hover",
        outline:
          "border border-border text-ink hover:bg-surface-sunken hover:border-brand",
        ghost: "text-ink hover:bg-surface-sunken",
      },
      size: {
        sm: "h-8 px-3 text-step--1",
        md: "h-10 px-4 text-step-0",
        lg: "h-12 px-6 text-step-1",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
