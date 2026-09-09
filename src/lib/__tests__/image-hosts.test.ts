import { describe, expect, it } from "vitest";

import { canOptimizeImage } from "@/lib/image-hosts";

describe("canOptimizeImage", () => {
  it("accepts the hosts the optimizer is configured for", () => {
    expect(canOptimizeImage("https://images.unsplash.com/photo-123")).toBe(true);
    expect(canOptimizeImage("https://cdn.shopify.com/s/files/1/a.jpg")).toBe(true);
  });

  it("accepts our own Cloudinary account", () => {
    expect(
      canOptimizeImage("https://res.cloudinary.com/hzhhirkt/image/upload/v1/a.jpg"),
    ).toBe(true);
  });

  it("rejects other accounts on the same Cloudinary host", () => {
    // Answering `true` here would be worse than answering `false`: the config
    // refuses the path, so `next/image` would 400 and the image would break
    // rather than fall back to a plain `img`.
    expect(
      canOptimizeImage("https://res.cloudinary.com/someone-else/image/upload/a.jpg"),
    ).toBe(false);
    // A prefix check must not be fooled by a look-alike account name.
    expect(
      canOptimizeImage("https://res.cloudinary.com/hzhhirkt-evil/image/upload/a.jpg"),
    ).toBe(false);
  });

  it("rejects anything else, so it renders unoptimized rather than breaking", () => {
    expect(canOptimizeImage("https://example.com/a.jpg")).toBe(false);
    expect(canOptimizeImage("http://images.unsplash.com/photo-123")).toBe(false);
    expect(canOptimizeImage("/images/local.jpg")).toBe(false);
    expect(canOptimizeImage("not a url")).toBe(false);
    expect(canOptimizeImage("javascript:alert(1)")).toBe(false);
  });
});
