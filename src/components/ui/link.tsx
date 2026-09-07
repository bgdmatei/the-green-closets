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

type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof textLinkVariants> & {
    href: string;
  };

/**
 * A link that leaves the site.
 *
 * `next/link` is deliberately not used here. It exists for client-side,
 * same-origin navigation — on an external URL it renders a plain anchor and
 * adds nothing, while implying a routing relationship that does not exist.
 *
 * What this does add is enforcing `rel` on every outbound link in one place.
 * `noopener` stops the opened page reaching back through `window.opener`, and
 * `noreferrer` withholds the referring URL. Hand-written anchors get these
 * right until the day one does not.
 */
export function ExternalLink({
  tone,
  size,
  face,
  underline,
  className,
  rel,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      target="_blank"
      // Caller-supplied rel is additive; the safety flags are not negotiable.
      rel={["noopener", "noreferrer", rel].filter(Boolean).join(" ")}
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
