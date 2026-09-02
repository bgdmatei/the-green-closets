const formatters = new Map<string, Intl.NumberFormat>();

/**
 * Formats a minor-unit amount as a price.
 *
 * Trailing `.00` is dropped — the reference sets prices as "€150", not
 * "€150.00" — but a non-round amount keeps its decimals.
 */
export const formatPrice = (
  amountInCents: number,
  currency: string = "EUR",
): string => {
  const isWhole = amountInCents % 100 === 0;
  const key = `${currency}:${isWhole}`;

  let formatter = formatters.get(key);
  if (!formatter) {
    // en-IE puts the euro symbol before the amount ("€150"), matching the
    // shop's presentation, rather than de-DE's trailing "150 €".
    formatter = new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: isWhole ? 0 : 2,
      maximumFractionDigits: isWhole ? 0 : 2,
    });
    formatters.set(key, formatter);
  }

  return formatter.format(amountInCents / 100);
};
