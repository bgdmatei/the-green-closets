import { describe, expect, it } from "vitest";

import { formatPublishedDate } from "@/features/blog/lib/format-date";

describe("formatPublishedDate", () => {
  it("formats an ISO date for display", () => {
    expect(formatPublishedDate("2026-04-19")).toBe("19 April 2026");
  });

  it("does not shift the date across timezones", () => {
    // Parsed as UTC, so the first of the month never renders as the last of
    // the previous one on a build machine west of Greenwich.
    expect(formatPublishedDate("2026-01-01")).toBe("1 January 2026");
  });

  it("returns the input unchanged when it is not a valid date", () => {
    expect(formatPublishedDate("19th of April")).toBe("19th of April");
  });
});
