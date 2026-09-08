import { describe, expect, it } from "vitest";

import { centsToInput, parsePriceToCents } from "@/features/shop/lib/parse-price";

describe("parsePriceToCents", () => {
  it("reads whole amounts", () => {
    expect(parsePriceToCents("150")).toBe(15000);
    expect(parsePriceToCents("20")).toBe(2000);
  });

  it("reads decimals with either mark", () => {
    expect(parsePriceToCents("19.99")).toBe(1999);
    expect(parsePriceToCents("19,99")).toBe(1999);
  });

  it("treats a single decimal digit as tenths, not hundredths", () => {
    // "150.5" is €150.50 — reading it as 5 cents would be off by 45.
    expect(parsePriceToCents("150.5")).toBe(15050);
  });

  it("tolerates a currency symbol and surrounding space", () => {
    expect(parsePriceToCents(" €150 ")).toBe(15000);
  });

  it("rejects thousands separators rather than guessing", () => {
    // "1,500" could be 1500 or 1.50 depending on locale. Guessing wrong is a
    // factor-of-1000 error on a price, so refuse it.
    expect(parsePriceToCents("1,500")).toBeNull();
    expect(parsePriceToCents("1.500,00")).toBeNull();
  });

  it("rejects nonsense, negatives and zero", () => {
    for (const bad of ["", "abc", "-5", "0", "12.345", "1e3", "150.5.5"]) {
      expect(parsePriceToCents(bad), bad).toBeNull();
    }
  });
});

describe("centsToInput", () => {
  it("drops trailing zeros on a whole amount", () => {
    expect(centsToInput(15000)).toBe("150");
  });

  it("keeps both decimals otherwise", () => {
    expect(centsToInput(1999)).toBe("19.99");
    expect(centsToInput(15050)).toBe("150.50");
  });

  it("round-trips", () => {
    for (const cents of [2000, 1999, 15050, 100]) {
      expect(parsePriceToCents(centsToInput(cents))).toBe(cents);
    }
  });
});
