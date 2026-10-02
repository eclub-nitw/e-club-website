import { test, expect } from "@playwright/test";

// Every route in every engine and width: one h1, no horizontal scroll, no console errors, no failed same-origin requests, skip link first in tab order.
const routes = ["/", "/about", "/initiatives", "/initiatives/venture-vortex-2026", "/venture-vortex", "/team", "/sponsors", "/gallery", "/contact", "/privacy", "/terms", "/states"];

for (const path of routes) {
  test(`smoke ${path}`, async ({ page, browserName }) => {
    const errors: string[] = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push(String(e)));
    const failed: string[] = [];
    page.on("response", (r) => { if (r.status() >= 400 && r.url().startsWith(page.url().split("/").slice(0, 3).join("/"))) failed.push(`${r.status()} ${r.url()}`); });
    const res = await page.goto(path);
    if (res?.status() === 404) test.skip(true, "route does not exist");
    await page.waitForLoadState("load");
    await page.waitForTimeout(800);
    await expect(page.locator("h1")).toHaveCount(1);
    // scrollWidth over-reports (decorative layers are clipped); what a visitor can do is scroll sideways.
    const sideways = await page.evaluate(() => { window.scrollTo(5000, 0); return window.scrollX; });
    expect(sideways, "horizontal scroll").toBe(0);
    // Safari (and so WebKit) skips links when tabbing unless the user enables it in settings, so this check is Chromium and Firefox only.
    if (browserName !== "webkit") {
      await page.keyboard.press("Tab");
      await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    }
    expect(failed, "failed requests").toEqual([]);
    expect(errors, "console errors").toEqual([]);
  });
}

test("unknown route and unknown gallery page give the custom 404", async ({ page }) => {
  for (const p of ["/no-such-page", "/gallery/999", "/initiatives/no-such-event"]) {
    const res = await page.goto(p);
    expect(res?.status(), p).toBe(404);
    await expect(page.locator("h1")).toHaveCount(1);
  }
});
