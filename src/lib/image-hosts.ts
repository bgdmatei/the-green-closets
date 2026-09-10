/**
 * Sources whose images may go through Next's optimizer.
 *
 * One list, read by both `next.config.ts` (which turns it into
 * `images.remotePatterns`) and `canOptimizeImage` below. These two must agree:
 * a source the component trusts but the config does not makes the image fail
 * to load in production, and the reverse silently ships an unoptimized
 * original. Keeping the predicate next to the list is what stops them drifting.
 *
 * Deliberately not widened to every https host. `remotePatterns` is what keeps
 * `/_next/image` from becoming an open proxy anyone could drive with our
 * bandwidth, so each entry here is a considered decision.
 */
export interface ImageSource {
  hostname: string;
  /**
   * Restricts the host to one account's path. Cloudinary serves every customer
   * from the same hostname, so without this the optimizer would resize images
   * out of anyone's account, not just ours.
   */
  pathnamePrefix?: string;
}

/**
 * The Cloudinary account we own. Read from the environment so a different
 * deploy — a fork, a staging branch, another site — cannot resize images out
 * of the wrong account. `NEXT_PUBLIC_` because the same predicate runs in the
 * browser (product-card, post-cover), so the value has to be present in the
 * bundle. This is a hostname, not a secret; a public var is the correct shape.
 */
const cloudinaryAccount = process.env.NEXT_PUBLIC_CLOUDINARY_ACCOUNT?.trim();

const cloudinarySource: ImageSource | null = cloudinaryAccount
  ? {
      hostname: "res.cloudinary.com",
      pathnamePrefix: `/${cloudinaryAccount}/`,
    }
  : null;

export const OPTIMIZABLE_IMAGE_SOURCES: readonly ImageSource[] = [
  { hostname: "images.unsplash.com" },
  /**
   * Product imagery served from each brand's own store, the same way a live
   * product feed will supply it.
   */
  { hostname: "cdn.shopify.com" },
  /**
   * Our own photography. Files are uploaded to Cloudinary by hand and pasted
   * in as URLs, which leaves the editor's field — and the column behind it —
   * unchanged whether an image arrives by upload or by paste. Omitted when
   * `NEXT_PUBLIC_CLOUDINARY_ACCOUNT` is not set, so a deploy without our own
   * photography does not accidentally allow-list the shared Cloudinary host.
   */
  ...(cloudinarySource ? [cloudinarySource] : []),
];

/**
 * Whether `next/image` can be pointed at this URL.
 *
 * A URL this rejects still renders, as a plain `img`; it just does not get
 * resized or converted. Answering `true` for something the config would refuse
 * is the harmful direction, because the optimizer returns 400 and the image
 * breaks — hence the path check, not just the host.
 */
export const canOptimizeImage = (url: string): boolean => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;

  return OPTIMIZABLE_IMAGE_SOURCES.some(
    ({ hostname, pathnamePrefix }) =>
      parsed.hostname === hostname &&
      (!pathnamePrefix || parsed.pathname.startsWith(pathnamePrefix)),
  );
};
