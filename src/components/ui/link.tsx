import NextLink from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

const textLinkVariants = cva(
  "inline-flex items-center gap-1.5 transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  {
    variants: {
      tone: {
        default: "text-ink hover:text-ink-muted",
        muted: "text-ink-muted hover:text-ink",
        inverse: "text-ink-inverse hover:text-ink-inverse/75",
      },
      size: {
        xs: "text-step--1",
        sm: "text-step-0",
        md: "text-step-1",
      },
      /** The display italic used for the small links under a hero heading. */
      face: {
        body: "",
        display: "font-display italic",
      },
      underline: {
        always: "underline underline-offset-4 decoration-from-font",
        hover: "hover:underline underline-offset-4 decoration-from-font",
        never: "no-underline",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "sm",
      face: "body",
      underline: "never",
    },
  },
);

type NextLinkProps = React.ComponentProps<typeof NextLink>;

interface TextLinkProps
  extends Omit<NextLinkProps, "color">,
    VariantProps<typeof textLinkVariants> {}

/** An inline link in running text, a nav item, or a card footer. */
export function TextLink({
  tone,
  size,
  face,
  underline,
  className,
  ...props
}: TextLinkProps) {
  return (
    <NextLink
      className={cn(
        textLinkVariants({ tone, size, face, underline }),
        className,
      )}
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
