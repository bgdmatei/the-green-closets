import { defineConfig, devices } from "@playwright/test";

/**
 * Port the suite starts its own server on.
 *
 * Overridable so a run can be moved off 3000 when a dev server is already
 * there — `PORT=3001 pnpm e2e`. Defaults to 3000 so the usual invocation is
 * unchanged.
 */
const port = Number(process.env.PORT ?? 3000);

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
  },
  webServer: {
    // A production server, not `next dev`: the CSP deliberately differs between
    // the two, so header assertions against dev would test the wrong policy.
    command: `pnpm build && pnpm start --port ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
