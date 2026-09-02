import type { Metadata } from "next";

interface MetadataOptions {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
}

/**
 * Builds the canonical URL for a route.
 */
export const getCanonicalUrl = (siteUrl: string, path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
};

/**
 * Builds complete metadata payload with a canonical URL.
 */
export const buildPageMetadata = (
  siteUrl: string,
  options: MetadataOptions,
): Metadata => {
  const canonical = getCanonicalUrl(siteUrl, options.path);
  const image = options.imagePath
    ? `${siteUrl}${options.imagePath}`
    : `${siteUrl}/og-image.png`;

  return {
    title: options.title,
    description: options.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: options.title,
      description: options.description,
      url: canonical,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: [image],
    },
  };
};
