import NextLink from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

const textLinkVariants = cva(
  "inline-flex items-center gap-1 transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-xs",
  {
    variants: {
      tone: {
        default: "text-brand hover:text-brand-hover",
        muted: "text-ink-muted hover:text-ink",
        inverse: "text-ink-inverse hover:opacity-80",
      },
      size: {
        xs: "text-step--1",
        sm: "text-step-0",
        md: "text-step-1",
      },
      underline: {
        always: "underline underline-offset-4",
        hover: "hover:underline underline-offset-4",
        never: "no-underline",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "sm",
      underline: "hover",
    },
  },
);

type NextLinkProps = React.ComponentProps<typeof NextLink>;

interface TextLinkProps
  extends Omit<NextLinkProps, "color">,
    VariantProps<typeof textLinkVariants> {}

/** An inline link in running text or a card footer. */
export function TextLink({
  tone,
  size,
  underline,
  className,
  ...props
}: TextLinkProps) {
  return (
    <NextLink
      className={cn(textLinkVariants({ tone, size, underline }), className)}
      {...props}
    />
  );
}

interface ButtonLinkProps
  extends Omit<NextLinkProps, "color">,
    VariantProps<typeof buttonVariants> {}

/** A link that should read as a button. */
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <NextLink
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
