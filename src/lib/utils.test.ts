import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("keeps a type-scale size and a text colour together", () => {
    // Both are `text-*`. Unconfigured, tailwind-merge treats them as one group
    // and drops the colour, which renders overlay text in the body ink and
    // makes it invisible against a photograph.
    const result = cn("text-ink-inverse", "text-step-4");

    expect(result).toContain("text-ink-inverse");
    expect(result).toContain("text-step-4");
  });

  it("keeps the lede size and a text colour together", () => {
    const result = cn("text-ink-muted", "text-lede");

    expect(result).toContain("text-ink-muted");
    expect(result).toContain("text-lede");
  });

  it("still collapses genuinely conflicting sizes", () => {
    expect(cn("text-step-2", "text-step-4")).toBe("text-step-4");
  });

  it("still collapses genuinely conflicting colours", () => {
    expect(cn("text-ink", "text-ink-muted")).toBe("text-ink-muted");
  });

  it("lets a later class override an earlier one as usual", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});
