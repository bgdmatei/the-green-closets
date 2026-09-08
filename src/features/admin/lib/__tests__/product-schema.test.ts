import { describe, expect, it } from "vitest";

import {
  productInputSchema,
  readProductForm,
} from "@/features/admin/lib/product-schema";

const valid = {
  name: "Wool Jumper",
  brandName: "ARMEDANGELS",
  imageUrl: "https://example.com/front.jpg",
  hoverImageUrl: "https://example.com/back.jpg",
  productUrl: "https://example.com/p/wool-jumper",
  price: "150",
  isWeeklyPick: false,
};

const parse = (overrides: Partial<typeof valid> = {}) =>
  productInputSchema.safeParse({ ...valid, ...overrides });

describe("productInputSchema", () => {
  it("accepts a complete entry", () => {
    const result = parse();
    expect(result.success).toBe(true);
    expect(result.data?.hoverImageUrl).toBe("https://example.com/back.jpg");
    expect(result.data?.price).toBe(15000);
  });

  describe("the hover image", () => {
    it("is optional, and an empty field becomes null rather than an empty string", () => {
      // The column is nullable and the card tests truthiness, so "" would be a
      // second falsy value doing the same job — worth collapsing at the edge.
      const result = parse({ hoverImageUrl: "" });
      expect(result.success).toBe(true);
      expect(result.data?.hoverImageUrl).toBeNull();
    });

    it("treats whitespace as empty", () => {
      expect(parse({ hoverImageUrl: "   " }).data?.hoverImageUrl).toBeNull();
    });

    it("is still parsed as a URL when present", () => {
      // Being optional must not make it a hole in the check: this value reaches
      // an `img` src, and a Server Action is a public POST endpoint.
      expect(parse({ hoverImageUrl: "javascript:alert(1)" }).success).toBe(false);
      expect(parse({ hoverImageUrl: "data:text/html,<script>" }).success).toBe(false);
      expect(parse({ hoverImageUrl: "not a url" }).success).toBe(false);
    });
  });

  it("still requires the primary image", () => {
    expect(parse({ imageUrl: "" }).success).toBe(false);
  });
});

describe("readProductForm", () => {
  it("reads a missing hover field as empty rather than the string 'null'", () => {
    const form = new FormData();
    form.set("name", "Wool Jumper");
    expect(readProductForm(form).hoverImageUrl).toBe("");
  });
});
