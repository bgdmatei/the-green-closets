const displayFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const monthFormat = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Parsed as UTC so the rendered date does not shift with the server's timezone
 * — a build machine west of Greenwich would otherwise prerender the previous
 * day.
 */
const parse = (isoDate: string): Date | null => {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Formats an ISO date (`YYYY-MM-DD`) for display.
 *
 * Returns the input unchanged if it is not a valid date, so bad content
 * degrades to visible raw text rather than "Invalid Date".
 */
export const formatPublishedDate = (isoDate: string): string => {
  const parsed = parse(isoDate);
  return parsed ? displayFormat.format(parsed) : isoDate;
};

/**
 * Month and year only ("April 2026"), for the index where the exact day is
 * noise rather than information.
 */
export const formatPublishedMonth = (isoDate: string): string => {
  const parsed = parse(isoDate);
  return parsed ? monthFormat.format(parsed) : isoDate;
};
