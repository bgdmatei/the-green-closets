import { expect, test } from "@playwright/test";

test("homepage serves the hardened security headers", async ({ page }) => {
  const response = await page.goto("/");

  expect(response).not.toBeNull();
  expect(response?.ok()).toBe(true);

  const headers = response!.headers();

  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["strict-transport-security"]).toContain("max-age=63072000");
  // The framework and its version should not be advertised.
  expect(headers["x-powered-by"]).toBeUndefined();

  const csp = headers["content-security-policy"];
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("upgrade-insecure-requests");
  // Product imagery is served from the brands' own stores.
  expect(csp).toContain("https://cdn.shopify.com");
  // Static prerendering means no nonce, so inline scripts are allowed by
  // design — but `unsafe-eval` must never reach production.
  expect(csp).not.toContain("unsafe-eval");
});

test("homepage renders without console errors", async ({ page }) => {
  const problems: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") problems.push(message.text());
  });
  page.on("pageerror", (error) => problems.push(error.message));

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /New in the closet/i }),
  ).toBeVisible();

  expect(problems).toEqual([]);
});

test("overlay headings render in the inverse ink, not the body ink", async ({
  page,
}) => {
  await page.goto("/");

  // Regression guard: tailwind-merge treated the custom `text-step-*` scale as
  // text colours and dropped `text-ink-inverse`, rendering overlay type in the
  // near-black body ink and making it invisible against the photograph.
  const lightness = await page
    .getByRole("heading", { name: /Read the journal/i })
    .evaluate((el) => {
      const colour = getComputedStyle(el).color;
      const parts = colour.match(/[\d.]+/g)!.map(Number);
      // Chromium reports wide-gamut colours as `lab(L a b)`, where the first
      // component is already lightness on a 0-100 scale.
      if (colour.startsWith("lab(") || colour.startsWith("oklab(")) {
        return colour.startsWith("lab(") ? parts[0] / 100 : parts[0];
      }
      const [r, g, b] = parts;
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    });

  expect(lightness).toBeGreaterThan(0.8);
});

test("the weekly banner button restyles only on its own hover", async ({
  page,
}) => {
  await page.goto("/");

  const tile = page.locator('main a[href="/week-picks"]').first();
  const button = page.getByText("See the edit", { exact: false }).first();
  await button.scrollIntoViewIfNeeded();

  const background = () =>
    button.evaluate((el) => getComputedStyle(el).backgroundColor);

  const initial = await background();

  // Hovering the tile away from the button must leave the button alone.
  const box = (await tile.boundingBox())!;
  await page.mouse.move(box.x + 40, box.y + 30);
  expect(await background()).toBe(initial);

  await button.hover();
  await expect
    .poll(background)
    .toBe("rgb(255, 255, 255)");
});

test("a reader can reach an article from the journal", async ({ page }) => {
  await page.goto("/journal");

  await page.locator('a[href^="/articles/"]').first().click();

  await expect(page).toHaveURL(/\/articles\//);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("the shop lists products with prices", async ({ page }) => {
  await page.goto("/shop");

  const products = page.locator('a[href*="armedangels.com"]');
  expect(await products.count()).toBeGreaterThan(0);
  await expect(products.first()).toContainText("€");
  // Outbound links must not leak the referrer window.
  await expect(products.first()).toHaveAttribute("rel", /noopener/);
});

test("pages do not scroll horizontally on a small viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });

  for (const path of ["/", "/shop", "/journal", "/about"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(0);
  }
});

test.describe("theme", () => {
  test("defaults to light even when the OS prefers dark", async ({ browser }) => {
    // Light is the product decision, not a reflection of the OS setting.
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/journal");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await context.close();
  });

  test("the toggle switches theme and the choice survives a reload", async ({
    page,
  }) => {
    await page.goto("/journal");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.getByRole("button", { name: /switch to dark theme/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // And back again.
    await page.getByRole("button", { name: /switch to light theme/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("dark is applied before paint, with no flash of light", async ({
    page,
  }) => {
    await page.goto("/journal");
    await page.evaluate(() => localStorage.setItem("tgc-theme", "dark"));

    // The inline head script must set the attribute in the initial HTML pass,
    // before any stylesheet paints, so the first observable state is dark.
    await page.goto("/journal", { waitUntil: "commit" });
    const atCommit = await page.evaluate(
      () => document.documentElement.dataset.theme,
    );
    expect(atCommit).toBe("dark");
  });
});

test("the journal marks the current section in the nav", async ({ page }) => {
  await page.goto("/journal");
  await expect(page.getByRole("link", { name: "Journal" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.getByRole("link", { name: "Shop all" })).not.toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("an unknown article returns a 404", async ({ page }) => {
  const response = await page.goto("/articles/does-not-exist");
  expect(response?.status()).toBe(404);
});
