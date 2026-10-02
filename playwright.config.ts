import { defineConfig, devices } from "@playwright/test";

// Unit tests (tests/*.spec.ts, no browser) and the cross-browser/fake-clock suite (tests/e2e/*.spec.ts, needs BASE_URL or a local `next start` on :3000).
const widths = [360, 768, 1440] as const;
const engines = { chromium: devices["Desktop Chrome"], firefox: devices["Desktop Firefox"], webkit: devices["Desktop Safari"] } as const;

export default defineConfig({
  testDir: "tests",
  reporter: "list",
  use: { baseURL: process.env.BASE_URL ?? "http://localhost:3000" },
  projects: [
    { name: "unit", testMatch: /^(?!.*e2e).*\.spec\.ts$/ },
    ...Object.entries(engines).flatMap(([name, device]) =>
      widths.map((w) => ({ name: `${name}-${w}`, testMatch: /e2e\/.*\.spec\.ts/, use: { ...device, viewport: { width: w, height: w < 500 ? 740 : 900 } } }))),
  ],
});
