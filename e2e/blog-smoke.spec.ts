import { expect, test } from "@playwright/test";

test("blog homepage loads with security headers", async ({ page }) => {
  const response = await page.goto("/en");

  expect(response).not.toBeNull();
  expect(response?.ok()).toBe(true);
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  await expect(page.getByRole("heading", { name: "Latest Articles" })).toBeVisible();
});
