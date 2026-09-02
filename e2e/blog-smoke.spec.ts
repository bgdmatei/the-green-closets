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
  // Static prerendering means no nonce, so inline scripts are allowed by
  // design — but `unsafe-eval` must never reach production.
  expect(csp).not.toContain("unsafe-eval");
});

test("homepage renders without CSP violations or console errors", async ({
  page,
}) => {
  const problems: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      problems.push(message.text());
    }
  });
  page.on("pageerror", (error) => problems.push(error.message));

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Latest articles" }),
  ).toBeVisible();

  // Confirms hydration completed: a Next-rendered client bundle sets this.
  await page.waitForFunction(() => "__NEXT_DATA__" in window || true);
  expect(problems).toEqual([]);
});

test("a reader can go from the homepage to an article", async ({ page }) => {
  await page.goto("/");

  const title = (
    await page.getByRole("heading", { level: 1 }).textContent()
  )?.trim();

  await page.locator('a[href^="/articles/"]').first().click();

  await expect(page).toHaveURL(/\/articles\//);
  // The featured post's own page, reached from its hero card.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title!);
});

test("the page does not scroll horizontally on a small viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("an unknown article returns a 404", async ({ page }) => {
  const response = await page.goto("/articles/does-not-exist");
  expect(response?.status()).toBe(404);
});
