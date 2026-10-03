import { test, expect } from "@playwright/test";

// Fake clock at every boundary, one minute either side, plus the sunset (1 Nov: concluded but still promoted; 8 Nov: gone). The server HTML is
// rendered with the real "now" (so it is deliberately wrong for most of these instants): what is asserted is what the visitor sees after the browser
// takes over. Screenshots only from chromium-1440.
type Case = { at: string; slug: string; pill: RegExp | null; chip: RegExp | null; ticker: RegExp | null; action: RegExp | null; registerWord: boolean; navButton: boolean };
const cases: Case[] = [
  { at: "2026-10-03T23:59:00+05:30", slug: "03-oct-2359-registration-open", pill: /Register on Unstop/, chip: /Now: Venture Vortex 2026 · registration closes 8 Oct/, ticker: /registration is live on Unstop, closes 8 Oct/, action: /Register on Unstop/, registerWord: true, navButton: true },
  { at: "2026-10-04T00:00:00+05:30", slug: "04-oct-0000-registration-still-open", pill: /Register on Unstop/, chip: /registration closes 8 Oct/, ticker: /registration is live on Unstop, closes 8 Oct/, action: /Register on Unstop/, registerWord: true, navButton: true },
  { at: "2026-10-08T23:59:00+05:30", slug: "08-oct-2359-last-minute", pill: /Register on Unstop/, chip: /registration closes 8 Oct/, ticker: /registration is live on Unstop, closes 8 Oct/, action: /Register on Unstop/, registerWord: true, navButton: true },
  { at: "2026-10-09T00:00:00+05:30", slug: "09-oct-0000-registration-closed", pill: /Registration closed · Submissions open until 9 Oct, 08:00 IST/, chip: /Round 1 submissions close 9 Oct, 08:00 IST/, ticker: /Registration closed · Round 1 submissions open until 9 Oct, 08:00 IST/, action: /Round 1 submissions on Unstop/, registerWord: false, navButton: true },
  { at: "2026-10-09T07:59:00+05:30", slug: "09-oct-0759-submissions-open", pill: /Submissions open until 9 Oct, 08:00 IST/, chip: /Round 1 submissions close 9 Oct, 08:00 IST/, ticker: /Round 1 submissions open until 9 Oct, 08:00 IST/, action: /Round 1 submissions on Unstop/, registerWord: false, navButton: true },
  { at: "2026-10-09T08:00:00+05:30", slug: "09-oct-0800-round1-closed", pill: /Round 1 closed · Round 2 opens 11 Oct/, chip: /Round 2 opens 11 Oct/, ticker: /Round 1 closed · result 10 Oct · Round 2 opens 11 Oct/, action: null, registerWord: false, navButton: true },
  { at: "2026-10-10T12:00:00+05:30", slug: "10-oct-1200-result-day", pill: /Round 1 closed · Round 2 opens 11 Oct/, chip: /Round 2 opens 11 Oct/, ticker: /Round 1 closed · result 10 Oct/, action: null, registerWord: false, navButton: true },
  { at: "2026-10-11T08:00:00+05:30", slug: "11-oct-0800-round2-live", pill: /Round 2 in progress/, chip: /Round 2 in progress/, ticker: /Round 2 in progress/, action: null, registerWord: false, navButton: true },
  { at: "2026-10-18T20:00:00+05:30", slug: "18-oct-2000-between-rounds", pill: /Finale on campus, 30–31 Oct/, chip: /finale on campus, 30–31 Oct/, ticker: /Round 2 closed · finale on campus/, action: null, registerWord: false, navButton: true },
  { at: "2026-10-30T08:00:00+05:30", slug: "30-oct-0800-finale", pill: /^Finale on campus$/, chip: /Now: Venture Vortex 2026 · finale on campus/, ticker: /Finale on campus at NIT Warangal/, action: null, registerWord: false, navButton: true },
  { at: "2026-11-01T00:00:00+05:30", slug: "01-nov-0000-concluded", pill: null, chip: /Venture Vortex 2026 has concluded/, ticker: /has concluded/, action: null, registerWord: false, navButton: true },
  { at: "2026-11-08T00:00:00+05:30", slug: "08-nov-0000-sunset", pill: null, chip: null, ticker: null, action: null, registerWord: false, navButton: false },
];

for (const c of cases) {
  test(`${c.slug}`, async ({ page }, info) => {
    const shot = info.project.name === "chromium-1440";
    await page.clock.setFixedTime(new Date(c.at));
    await page.goto("/");
    const nav = page.locator('header nav[aria-label="Primary"]');
    const button = nav.getByRole("link", { name: "Venture Vortex", exact: true });
    // The hero never leads with the competition: its buttons are the club's own.
    await expect(page.locator("#hero").getByRole("link", { name: "Explore initiatives" })).toBeVisible();
    await expect(page.locator("#hero").getByRole("link", { name: /^Register/ })).toHaveCount(0);
    // From 768px the button is in the bar; below that it sits in the menu drawer (present in the DOM, hidden until opened).
    const anywhere = page.locator('nav a[href="/venture-vortex"]');
    if (!c.navButton) await expect(anywhere).toHaveCount(0);
    else if ((page.viewportSize()?.width ?? 0) >= 768) await expect(button).toBeVisible();
    else await expect(anywhere.first()).toBeAttached();
    const chip = page.locator("#hero a.t-label");
    if (c.chip) await expect(chip).toContainText(c.chip); else await expect(chip).toHaveCount(0);
    const pill = page.locator("a.pill-in");
    if (c.pill) await expect(pill).toContainText(c.pill); else await expect(pill).toHaveCount(0);
    const ticker = page.getByRole("region", { name: "Announcements" });
    await expect(ticker).toContainText("Think. Connect. Create. Lead."); // club items are always there
    if (c.ticker) await expect(ticker).toContainText(c.ticker); else await expect(ticker).not.toContainText(/Venture Vortex|Technozion|₹50,000/);
    const spotlight = page.locator("#spotlight");
    if (c.navButton) {
      await expect(spotlight).toBeAttached();
      const act = spotlight.locator("a").filter({ hasText: /Register on Unstop|Round 1 submissions on Unstop/ });
      if (c.action) await expect(act.first()).toContainText(c.action); else await expect(act).toHaveCount(0);
    } else {
      await expect(spotlight).toHaveCount(0);
    }
    if (!c.registerWord) {
      const body = (await page.locator("body").innerText()).replace(/\s+/g, " ");
      expect(body).not.toMatch(/Register on Unstop|registration is live/i);
      await expect(page.getByRole("link", { name: /^Register\b/ })).toHaveCount(0);
    }
    if (shot) { await page.waitForTimeout(1200); await page.screenshot({ path: `docs/handoff/v8/phase/home-${c.slug}.jpg`, type: "jpeg", quality: 60 }); }

    // The pill is a Home / Initiatives affair: never on About, Team, Sponsors, Gallery, Contact.
    for (const other of ["/about", "/team", "/sponsors", "/gallery", "/contact"]) {
      await page.goto(other);
      await page.waitForTimeout(150);
      await expect(page.locator("a.pill-in"), other).toHaveCount(0);
    }

    await page.goto("/venture-vortex");
    const cta = page.locator("main a").filter({ hasText: /Register on Unstop|Round 1 submissions on Unstop/ });
    if (c.action) await expect(cta.first()).toContainText(c.action); else await expect(cta).toHaveCount(0);
    const vortex = (await page.locator("body").innerText()).replace(/\s+/g, " ");
    if (!c.registerWord) expect(vortex).not.toMatch(/Register on Unstop|register now|registration is live/i);
    if (shot) { await page.waitForTimeout(800); await page.screenshot({ path: `docs/handoff/v8/phase/vortex-${c.slug}.jpg`, type: "jpeg", quality: 60 }); }
  });
}
