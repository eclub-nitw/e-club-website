import { test, expect } from "@playwright/test";

const form = (page: import("@playwright/test").Page) => page.locator("form").first();
const routes = ["/", "/about", "/initiatives", "/venture-vortex", "/team", "/sponsors", "/gallery", "/contact"];

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const path of routes) test(`content is in the HTML: ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    expect((await page.locator("main").innerText()).length).toBeGreaterThan(200);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  for (const path of routes) test(`renders: ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(600);
    await expect(page.locator("h1")).toBeVisible();
    const moving = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && (a.effect as KeyframeEffect | null)?.getTiming().iterations === Infinity).length);
    expect(moving, "infinite animations still running").toBe(0);
  });
});

// 400% browser zoom on a 1280px window is a 320px-wide layout; 200% is 640px.
for (const width of [320, 640]) {
  test.describe(`${width}px (zoom ${width === 320 ? 400 : 200}%)`, () => {
    for (const path of routes) test(`no sideways scroll: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path);
      await page.waitForTimeout(700);
      const sx = await page.evaluate(() => { window.scrollTo(5000, 0); return window.scrollX; });
      expect(sx).toBe(0);
    });
  });
}

test("contact form: empty submit shows field errors and focuses the first", async ({ page }) => {
  await page.goto("/contact");
  await form(page).getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText("Tell us your name.")).toBeVisible();
  await expect(page.getByText("Enter an email address we can reply to.")).toBeVisible();
  await expect(page.getByLabel(/18 or older/i)).toHaveCount(0); // the age checkbox was removed (owner decision, V7)
});

test("contact form: success, double-submit guard and storage-failure fallback", async ({ page }) => {
  let posts = 0;
  await page.route("**/api/contact", async (route) => { posts++; await new Promise((r) => setTimeout(r, 400)); await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }); });
  await page.goto("/contact");
  await form(page).getByLabel("Your name").fill("Ünïcode Tëst ✓ 名前");
  await form(page).getByLabel(/email/i).first().fill("test@example.com");
  await form(page).getByLabel("Your message").fill("Long message ".repeat(20));
  const send = form(page).getByRole("button", { name: /send message/i });
  await send.dblclick();
  await expect(page.getByText(/we have your message/i)).toBeVisible();
  expect(posts, "double click must not send twice").toBe(1);

  await page.unroute("**/api/contact");
  await page.route("**/api/contact", (route) => route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"storage_unavailable"}' }));
  await form(page).getByRole("button", { name: /send another/i }).click();
  await form(page).getByLabel("Your name").fill("Fallback Person");
  await form(page).getByLabel(/email/i).first().fill("test@example.com");
  await form(page).getByLabel("Your message").fill("Please reach me by email instead.");
  await form(page).getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText(/email app should have opened/i)).toBeVisible();
});
