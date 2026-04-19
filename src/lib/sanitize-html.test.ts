import { describe, expect, it } from "vitest";

import { sanitizeRichHtml } from "@/lib/sanitize-html";

describe("sanitizeRichHtml", () => {
  it("removes script tags", () => {
    const dirty = "<p>Safe</p><script>alert('xss')</script>";
    const safe = sanitizeRichHtml(dirty);

    expect(safe).toContain("<p>Safe</p>");
    expect(safe).not.toContain("<script>");
    expect(safe).not.toContain("alert");
  });
});
