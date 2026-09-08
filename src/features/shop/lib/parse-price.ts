/**
 * Reads a typed price into minor units.
 *
 * The database stores cents so money is never held in a float, but nobody wants
 * to type 15000 for €150 — so the editor takes a normal amount and this does the
 * conversion.
 *
 * Accepts a comma or a full stop as the decimal mark, since European and
 * British conventions differ and both will be typed. Thousands separators are
 * not accepted: "1,5" is genuinely ambiguous, and silently guessing wrong by a
 * factor of a thousand is worse than rejecting it.
 *
 * Returns null for anything it cannot read exactly.
 */
export const parsePriceToCents = (input: string): number | null => {
  const trimmed = input.trim().replace(/^[€£$]\s*/, "");
  if (trimmed.length === 0) return null;

  // Optional digits, then at most one decimal mark and at most two decimals.
  const match = /^(\d+)(?:[.,](\d{1,2}))?$/.exec(trimmed);
  if (!match) return null;

  const whole = Number(match[1]);
  // "150.5" means fifty cents, not five.
  const fraction = match[2] ? Number(match[2].padEnd(2, "0")) : 0;

  if (!Number.isSafeInteger(whole)) return null;
  const cents = whole * 100 + fraction;

  // A price that cannot be shown is not worth storing.
  return cents > 0 && cents <= 100_000_000 ? cents : null;
};

/** The inverse, for pre-filling the editor from a stored value. */
export const centsToInput = (cents: number): string =>
  cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2);
