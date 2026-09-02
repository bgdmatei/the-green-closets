import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Shared by `Button` and by `ButtonLink` in `./link`, so a button and a link
 * that look alike stay alike.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-ink text-surface hover:bg-ink/85",
        outline: "border border-ink text-ink hover:bg-ink hover:text-surface",
        /** Sits on photography: a hairline box in the inverse ink. */
        overlay:
          "border border-ink-inverse/70 text-ink-inverse backdrop-blur-[1px] " +
          "hover:bg-ink-inverse hover:text-ink hover:border-ink-inverse",
        ghost: "text-ink hover:text-ink-muted",
      },
      size: {
        sm: "h-8 px-3 text-step--1",
        md: "h-10 px-5 text-step-0",
        lg: "h-12 px-7 text-step-1",
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
