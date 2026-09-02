import Image from "next/image";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";
import { Heading } from "./heading";

const mediaTileVariants = cva(
  "group relative isolate block overflow-hidden bg-surface-raised " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  {
    variants: {
      ratio: {
        /** Paired hero tiles. */
        portrait: "aspect-[4/5]",
        /** Full-width banner. */
        banner: "aspect-[16/9] md:aspect-[21/9]",
        square: "aspect-square",
      },
    },
    defaultVariants: {
      ratio: "portrait",
    },
  },
);

interface MediaTileProps extends VariantProps<typeof mediaTileVariants> {
  href: string;
  src: string;
  /**
   * Decorative by default: the tile's heading already names the destination,
   * so empty alt avoids a screen reader announcing it twice.
   */
  alt?: string;
  eyebrow?: string;
  title: React.ReactNode;
  /** Display-italic word completing the title. */
  accent?: React.ReactNode;
  /** Small italic link line, e.g. "Guides & interviews →". */
  action?: string;
  /** Renders `action` as a bordered box instead of an italic line. */
  actionAsButton?: boolean;
  priority?: boolean;
  sizes: string;
  /** Keeps the tile in the page's heading order; the page owns the `h1`. */
  headingAs?: "h2" | "h3";
  className?: string;
}

/**
 * A photograph with display type laid over its lower-left corner, and the
 * whole tile as one link target.
 */
export function MediaTile({
  href,
  src,
  alt = "",
  eyebrow,
  title,
  accent,
  action,
  actionAsButton = false,
  ratio,
  priority,
  sizes,
  headingAs = "h2",
  className,
}: MediaTileProps) {
  return (
    <Link
      href={href}
      className={cn(mediaTileVariants({ ratio }), className)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      {/*
        Keeps the overlaid type legible whatever the photograph does — these
        images are light-on-light, so the scrim has to carry real weight at the
        bottom where the type sits.
      */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 via-40% to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-6 md:p-8">
        {eyebrow ? <Eyebrow tone="inverse">{eyebrow}</Eyebrow> : null}
        <Heading as={headingAs} size="md" tone="inverse" accent={accent}>
          {title}
        </Heading>
        {action ? (
          actionAsButton ? (
            /*
              Hover is deliberately on the button itself, not `group-hover`:
              the tile is one big link, so a group hover would restyle the
              button whenever the pointer was anywhere in the section. Only the
              image responds to the tile as a whole.
            */
            <span className="mt-2 inline-flex h-10 items-center border border-ink-inverse/70 px-5 text-step-0 text-ink-inverse transition-colors hover:border-white hover:bg-white hover:text-on-light-muted">
              {action} <span aria-hidden className="ml-2">&rarr;</span>
            </span>
          ) : (
            <span className="font-display text-step-1 italic text-ink-inverse/85">
              {action} <span aria-hidden>&rarr;</span>
            </span>
          )
        ) : null}
      </div>
    </Link>
  );
}
