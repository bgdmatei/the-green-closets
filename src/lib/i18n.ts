export const locales = ["en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * Checks whether a string is a supported locale.
 */
export const isValidLocale = (value: string): value is Locale => {
  return locales.includes(value as Locale);
};
