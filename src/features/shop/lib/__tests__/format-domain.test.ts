import { describe, expect, it } from "vitest";

import { formatDomain } from "@/features/shop/lib/format-domain";

describe("formatDomain", () => {
  it("strips the scheme and www", () => {
    expect(formatDomain("https://www.armedangels.com")).toBe("armedangels.com");
  });

  it("keeps the host of a deep product link, not the path", () => {
    expect(
      formatDomain("https://www.armedangels.com/en/p/kiaano-pullover-30007412"),
    ).toBe("armedangels.com");
  });

  it("keeps subdomains other than www", () => {
    expect(formatDomain("https://shop.example.co.uk/x")).toBe(
      "shop.example.co.uk",
    );
  });

  it("lowercases the host", () => {
    expect(formatDomain("https://ArmedAngels.COM")).toBe("armedangels.com");
  });

  it("returns null rather than throwing on a malformed URL", () => {
    // A bad URL should cost the label, not the whole card.
    expect(formatDomain("not a url")).toBeNull();
    expect(formatDomain("")).toBeNull();
  });

  it("refuses non-http schemes", () => {
    expect(formatDomain("javascript:alert(1)")).toBeNull();
    expect(formatDomain("data:text/html,x")).toBeNull();
  });
});
