import Image from "next/image";

import { canOptimizeImage } from "@/lib/image-hosts";

interface PostCoverProps {
  url: string;
  alt: string | null;
  /** Aspect and layout classes for the frame the image fills. */
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * A post's cover image.
 *
 * Cover images may point at any host, so this cannot assume the optimizer can
 * handle them: allowing arbitrary hosts in `remotePatterns` would turn
 * `/_next/image` into an open proxy anyone could drive with our bandwidth.
 *
 * So it does both. A known host goes through `next/image` and gets resized and
 * converted; anything else falls back to a plain `img`. That keeps every URL
 * working while avoiding the common case — a full-resolution stock photo, often
 * several megabytes — being served untouched.
 *
 * `alt=""` when no description was given marks it decorative, which is right:
 * the adjacent title already carries the meaning.
 */
export const PostCover = ({
  url,
  alt,
  className,
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority,
}: PostCoverProps) => (
  <div className={`relative overflow-hidden bg-surface-raised ${className ?? ""}`}>
    {canOptimizeImage(url) ? (
      <Image
        src={url}
        alt={alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={alt ?? ""}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
    )}
  </div>
);
