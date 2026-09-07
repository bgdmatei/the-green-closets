/**
 * The display form of a product's destination.
 *
 * Shows where a click actually goes, which is the point of a shop that holds no
 * stock: the reader should know they are about to leave for the brand's own
 * site before they click. Derived from the product URL rather than stored
 * separately, so the label can never drift from the link.
 *
 * `www.` is dropped because it is noise, and the host is lowercased because
 * hostnames are case-insensitive but URLs are not always written that way.
 */
export const formatDomain = (url: string): string | null => {
  try {
    const { hostname, protocol } = new URL(url);
    if (protocol !== "https:" && protocol !== "http:") return null;
    return hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    // A malformed URL should cost a label, not the whole card.
    return null;
  }
};
