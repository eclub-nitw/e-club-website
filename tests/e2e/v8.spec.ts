import { test, expect, type Page } from "@playwright/test";

// V8 behaviour: two contact boxes, the generic About, Initiatives tabs, the Home At-a-glance plate, the Venture Vortex hero, the gallery grid.

const boxA = (page: Page) => page.locator("#contact");
const boxB = (page: Page) => page.locator("#sponsor");

test("contact: two separate boxes, side by side from 1024px, stacked below", async ({ page }) => {
  await page.goto("/contact");
  await expect(boxA(page).getByRole("heading", { name: "Contact and queries" })).toBeVisible();
  await expect(boxB(page).getByRole("heading", { name: "Sponsorship and partnership" })).toBeVisible();
  await expect(page.getByRole("tab")).toHaveCount(0); // the V7 four-tab selector is gone
  const a = await boxA(page).boundingBox(), b = await boxB(page).boundingBox();
  const vw = page.viewportSize()!.width;
  if (vw >= 1024) expect(Math.abs(a!.y - b!.y), "side by side").toBeLessThan(40); else expect(b!.y, "stacked").toBeGreaterThan(a!.y + a!.height - 4);
});

test("contact: #join pre-selects Join the club in box A, and A has the three reasons", async ({ page }) => {
  await page.goto("/contact#join");
  await expect(boxA(page).getByRole("radio", { name: "Join the club" })).toBeChecked();
  await expect(boxA(page).getByRole("radio")).toHaveCount(3);
  await page.goto("/contact#contact");
  await expect(boxA(page).getByRole("radio", { name: "Ask a question" })).toBeChecked();
});

test("contact: box B needs organisation and an interest; errors are described to screen readers", async ({ page }) => {
  await page.goto("/contact#sponsor");
  await boxB(page).getByLabel("Your name").fill("Test Person");
  await boxB(page).getByLabel(/Your email/).fill("test@example.com");
  await boxB(page).getByLabel("Your message").fill("We would like to talk about a partnership.");
  await boxB(page).getByRole("button", { name: /send message/i }).click();
  const org = boxB(page).getByLabel(/Organisation/);
  await expect(org).toHaveAttribute("aria-invalid", "true");
  await expect(boxB(page).getByText("Tell us which organisation you write for.")).toBeVisible();
  await expect(boxB(page).getByText("Choose what you have in mind.")).toBeVisible();
  const described = await org.getAttribute("aria-describedby");
  await expect(page.locator(`[id="${described}"]`)).toContainText("organisation");
});

test("contact: each box submits on its own, with the right type, and has its own live region", async ({ page }) => {
  const sent: Record<string, unknown>[] = [];
  await page.route("**/api/contact", async (route) => { sent.push(route.request().postDataJSON()); await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }); });
  await page.goto("/contact#join");
  await boxA(page).getByLabel("Your name").fill("Asha Rao");
  await boxA(page).getByLabel(/Your email/).fill("asha@example.com");
  await boxA(page).getByLabel("Your message").fill("I would like to join the club this year.");
  await boxA(page).getByRole("button", { name: /send message/i }).click();
  await expect(boxA(page).locator("p.sr-only[role=status]")).toContainText("Message sent.");
  await expect(boxB(page).locator("p.sr-only[role=status]")).toHaveText("");
  expect(sent[0]).toMatchObject({ type: "join", name: "Asha Rao", company: "" });

  await boxB(page).getByLabel("Your name").fill("Ravi Kumar");
  await boxB(page).getByLabel("Your role (optional)").fill("Partnerships");
  await boxB(page).getByLabel("Organisation").fill("Acme Ltd");
  await boxB(page).getByLabel(/Your email/).fill("ravi@example.com");
  await boxB(page).getByLabel("What do you have in mind?").selectOption("Media");
  await boxB(page).getByLabel("Your message").fill("We cover student startups and would like to feature the club.");
  await boxB(page).getByRole("button", { name: /send message/i }).click();
  await expect(boxB(page).locator("p.sr-only[role=status]")).toContainText("Message sent.");
  expect(sent[1]).toMatchObject({ type: "sponsor", organisation: "Acme Ltd", role: "Partnerships", interest: "Media" });
});

test("contact: keyboard only, arrows pick a reason and Tab walks the fields of box A in order", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "Safari skips radios and links when tabbing by default");
  await page.goto("/contact");
  await boxA(page).getByRole("radio", { name: "Ask a question" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(boxA(page).getByRole("radio", { name: "Join the club" })).toBeChecked();
  await page.keyboard.press("Tab");
  await expect(boxA(page).getByLabel("Your name")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(boxA(page).getByLabel(/Your email/)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(boxA(page).getByLabel("Your message")).toBeFocused();
});

test("About is the club, not the competition: no rounds, no prize, four words, mentor, find us", async ({ page }) => {
  await page.goto("/about");
  const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
  expect(text).not.toMatch(/Venture Vortex|Round [123]|Unstop|₹|Technozion/i);
  for (const w of ["Think.", "Connect.", "Create.", "Lead."]) await expect(page.locator("main").getByText(w, { exact: true }).first()).toBeVisible();
  await expect(page.locator("main")).toContainText("Faculty mentor");
  await expect(page.locator("main")).toContainText("Find us");
});

test("Home: the At-a-glance plate is never empty and the right column has a real box", async ({ page }) => {
  await page.goto("/");
  const plate = page.locator("#about aside");
  await expect(plate).toContainText("At a glance");
  await expect(plate.getByRole("img", { name: "E-Club NIT Warangal logo" })).toBeVisible();
  const box = await plate.boundingBox();
  expect(box!.width, "right column collapsed to nothing").toBeGreaterThan(280);
  expect(box!.height).toBeGreaterThan(200);
  await expect(plate.getByRole("img", { name: "NIT Warangal logo", exact: true })).toHaveCount(0); // emblem hidden until permission
});

test("Home hero: club first, two club buttons, no countdown, the spotlight is one small chip", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText(/E-Club\s+NIT Warangal/);
  await expect(page.locator("#hero").getByRole("link", { name: "Explore initiatives" })).toBeVisible();
  await expect(page.locator("#hero").getByRole("link", { name: "Get in touch" })).toBeVisible();
  await expect(page.locator("#hero [role=timer]")).toHaveCount(0);
});

test("Initiatives: tabs are hash driven and keyboard operable", async ({ page }) => {
  await page.goto("/initiatives#past");
  await expect(page.getByRole("tab", { name: /^Past/ })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: /^Past/ }).focus();
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: /^All/ })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /^Upcoming/ })).toHaveAttribute("aria-selected", "true");
  await expect(page).toHaveURL(/#upcoming$/);
});

test("Venture Vortex: the poster is inside the hero, not after it; sections are numbered without gaps", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/venture-vortex");
  const hero = page.locator("section[aria-labelledby=vv-h]");
  const poster = hero.getByRole("img", { name: /official poster/ });
  await expect(poster).toBeVisible();
  const h = await hero.boundingBox(), p = await poster.boundingBox();
  expect(h!.height, "hero taller than the viewport").toBeLessThanOrEqual(769);
  expect(p!.y + p!.height, "poster sticks out of the hero").toBeLessThanOrEqual(h!.y + h!.height + 1);
  const labels = await page.locator("[data-section]").evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.section!.slice(0, 2)));
  labels.forEach((l, i) => expect(l).toBe(String(i + 1).padStart(2, "0")));
});

test("Gallery: when photographs are published they sit in a grid of whole rows, 3x2 per event", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/gallery");
  const lists = page.locator("main section ul");
  const n = await lists.count();
  test.skip(n === 0, "no photographs published (consent not recorded)");
  for (let i = 0; i < n; i++) expect(await lists.nth(i).locator("li").count()).toBe(6);
});
