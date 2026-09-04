/**
 * Turns a title into a URL slug.
 *
 * Decomposes accents so "Rückblick" becomes "ruckblick" rather than losing the
 * character entirely, then keeps only characters that are safe unescaped in a
 * path.
 */
export const slugify = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
