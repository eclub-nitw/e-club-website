import { test, expect } from "@playwright/test";

// V7 behaviour: brand, contact tabs, partners scope, photo consent gate, no custom cursor, vine breakpoints. Runs in every engine and width.

test("nav brand is one line, 'E-Club NITW', with no long string", async ({ page }) => {
  await page.goto("/about");
  const brand = page.locator('nav[aria-label="Primary"] a[href="/"]').first();
  await expect(brand).toContainText("E-Club NITW");
  const nav = await page.locator('nav[aria-label="Primary"]').innerText();
  expect(nav).not.toMatch(/warang|…|\.\.\./i);
  const box = await brand.boundingBox();
  expect(box!.height, "brand wraps onto two lines").toBeLessThan(60);
});

test("Home carries the club's line and no custom cursor", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Think. Connect. Create. Lead.").first()).toBeVisible();
  await expect(page.locator("[data-cursor], .cursor-label")).toHaveCount(0);
});

test("contact: hash picks the tab, arrow keys move between tabs and update the hash", async ({ page, browserName }) => {
  await page.goto("/contact#sponsor");
  const tab = (n: string) => page.getByRole("tab", { name: new RegExp(n, "i") });
  await expect(tab("Sponsor")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel(/Organisation/)).toBeVisible();
  await tab("Sponsor").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(tab("Contact")).toHaveAttribute("aria-selected", "true");
  await expect(page).toHaveURL(/#contact$/);
  await page.keyboard.press("Home");
  await expect(tab("Join")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel(/Branch/)).toBeVisible();
  await expect(page.getByLabel(/Organisation/)).toHaveCount(0);
  void browserName;
});

test("contact: sponsor tab needs an organisation", async ({ page }) => {
  await page.goto("/contact#sponsor");
  await page.getByLabel("Your name").fill("Test Person");
  await page.getByLabel(/Your email/).fill("test@example.com");
  await page.getByLabel("Your message").fill("We would like to talk about a partnership.");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText("Tell us which organisation you write for.")).toBeVisible();
});

test("partners are scoped: Home and Sponsors name the Venture Vortex partners, Sponsors says no club sponsor is listed", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Venture Vortex 2026 partners" })).toBeVisible();
  await expect(page.locator("footer")).not.toContainText("Backed by");
  await page.goto("/sponsors");
  await expect(page.getByRole("heading", { name: "Club sponsors and partners" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Venture Vortex 2026 partners" })).toBeVisible();
  await expect(page.getByText("Masters' Union")).toBeVisible();
});

test("event photographs obey the consent flag: either none anywhere, or six per event on the event page and 18 in the gallery", async ({ page }) => {
  await page.goto("/gallery");
  const n = await page.locator("main section picture img").count();
  expect([0, 18]).toContain(n);
  for (const slug of ["valuation-wars", "pitcher-perfect", "the-pitch-league"]) {
    await page.goto(`/initiatives/${slug}`);
    await expect(page.locator("h1")).toHaveCount(1);
    const thumbs = await page.getByRole("button", { name: /Photograph \d of 6/ }).count();
    expect([0, 6]).toContain(thumbs);
    if (thumbs === 6) {
      await page.getByRole("button", { name: "Photograph 3 of 6" }).focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("button", { name: "Photograph 3 of 6" })).toHaveAttribute("aria-pressed", "true");
    }
  }
});

test("gallery: filter and lightbox are keyboard operable (when photographs are published)", async ({ page }) => {
  await page.goto("/gallery");
  if ((await page.locator("main section picture img").count()) === 0) test.skip(true, "no photographs published (consent not recorded)");
  await page.getByRole("button", { name: "The Pitch League", exact: true }).click();
  await expect(page.locator("main section picture img")).toHaveCount(6);
  const first = page.getByRole("button", { name: /View larger/ }).first();
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Photo viewer" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Photo viewer" })).toBeHidden();
  await expect(first).toBeFocused();
});

test("vine shows from 1100px up and not below", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect(page.locator(".vine")).toBeVisible();
  await page.setViewportSize({ width: 1000, height: 800 });
  await expect(page.locator(".vine")).toBeHidden();
});
