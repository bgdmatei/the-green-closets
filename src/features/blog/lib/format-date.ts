const displayFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Formats an ISO date (`YYYY-MM-DD`) for display.
 *
 * Parsed as UTC so the rendered date does not shift with the server's timezone
 * — a build machine west of Greenwich would otherwise prerender the previous
 * day. Returns the input unchanged if it is not a valid date, so bad content
 * degrades to visible raw text rather than "Invalid Date".
 */
export const formatPublishedDate = (isoDate: string): string => {
  const parsed = new Date(`${isoDate}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return displayFormat.format(parsed);
};
