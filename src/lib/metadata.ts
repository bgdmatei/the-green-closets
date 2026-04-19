import type { Metadata } from "next";

import { defaultLocale, Locale, locales } from "@/lib/i18n";

interface MetadataOptions {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  imagePath?: string;
}

/**
 * Builds the canonical URL for a route and locale.
 */
export const getCanonicalUrl = (siteUrl: string, locale: Locale, path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}/${locale}${normalizedPath}`;
};

/**
 * Builds language alternates for all supported locales.
 */
export const getLanguageAlternates = (
  siteUrl: string,
  path: string
): Record<string, string> => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const alternates: Record<string, string> = {};

  for (const locale of locales) {
    alternates[locale] = `${siteUrl}/${locale}${normalizedPath}`;
  }

  alternates["x-default"] = `${siteUrl}/${defaultLocale}${normalizedPath}`;
  return alternates;
};

/**
 * Builds complete metadata payload with canonical and hreflang alternates.
 */
export const buildPageMetadata = (
  siteUrl: string,
  options: MetadataOptions
): Metadata => {
  const canonical = getCanonicalUrl(siteUrl, options.locale, options.path);
  const alternates = getLanguageAlternates(siteUrl, options.path);
  const image = options.imagePath ? `${siteUrl}${options.imagePath}` : `${siteUrl}/og-image.png`;

  return {
    title: options.title,
    description: options.description,
    alternates: {
      canonical,
      languages: alternates,
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
