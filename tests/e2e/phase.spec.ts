import { test, expect } from "@playwright/test";

// Fake clock at every boundary, one minute either side. The server HTML is rendered with the real "now" (so it is deliberately wrong for
// most of these instants): what is asserted is what the visitor sees after the browser takes over. Screenshots only from chromium-1440.
type Case = { at: string; slug: string; pill: RegExp | null; hero: RegExp; ticker: RegExp; vortexCta: RegExp | null; registerWord: boolean };
const cases: Case[] = [
  { at: "2026-10-03T23:59:00+05:30", slug: "03-oct-2359-registration-open", pill: /Register on Unstop/, hero: /Register on Unstop/, ticker: /registration is live on Unstop, closes 3 Oct/, vortexCta: /Register on Unstop/, registerWord: true },
  { at: "2026-10-04T00:00:00+05:30", slug: "04-oct-0000-registration-closed", pill: /Registration closed · Submissions open until 9 Oct, 08:00 IST/, hero: /Round 1 submissions on Unstop/, ticker: /Registration closed · Round 1 submissions open until 9 Oct, 08:00 IST/, vortexCta: /Round 1 submissions on Unstop/, registerWord: false },
  { at: "2026-10-09T07:59:00+05:30", slug: "09-oct-0759-submissions-open", pill: /Submissions open until 9 Oct, 08:00 IST/, hero: /Round 1 submissions on Unstop/, ticker: /Round 1 submissions open until/, vortexCta: /Round 1 submissions on Unstop/, registerWord: false },
  { at: "2026-10-09T08:00:00+05:30", slug: "09-oct-0800-round1-closed", pill: /Round 1 closed · Round 2 opens 11 Oct/, hero: /^Venture Vortex 2026/, ticker: /Round 1 closed · result 10 Oct/, vortexCta: null, registerWord: false },
  { at: "2026-10-10T12:00:00+05:30", slug: "10-oct-1200-result-day", pill: /Round 1 closed · Round 2 opens 11 Oct/, hero: /^Venture Vortex 2026/, ticker: /Round 1 closed · result 10 Oct/, vortexCta: null, registerWord: false },
  { at: "2026-10-11T08:00:00+05:30", slug: "11-oct-0800-round2-live", pill: /Round 2 in progress/, hero: /^Venture Vortex 2026/, ticker: /Round 2 in progress/, vortexCta: null, registerWord: false },
  { at: "2026-10-18T20:00:00+05:30", slug: "18-oct-2000-between-rounds", pill: /Finale on campus, 30–31 Oct/, hero: /^Venture Vortex 2026/, ticker: /Round 2 closed · finale on campus/, vortexCta: null, registerWord: false },
  { at: "2026-10-30T08:00:00+05:30", slug: "30-oct-0800-finale", pill: /^Finale on campus$/, hero: /^Venture Vortex 2026/, ticker: /Finale on campus at NIT Warangal/, vortexCta: null, registerWord: false },
  { at: "2026-11-01T00:00:00+05:30", slug: "01-nov-0000-finished", pill: null, hero: /^Venture Vortex 2026/, ticker: /has concluded/, vortexCta: null, registerWord: false },
];

for (const c of cases) {
  test(`${c.slug}`, async ({ page }, info) => {
    const shot = info.project.name === "chromium-1440";
    await page.clock.setFixedTime(new Date(c.at));
    await page.goto("/");
    // The hero primary button is the first link inside the hero's action row.
    const heroActions = page.locator("#hero a").filter({ hasText: c.hero }).first();
    await expect(heroActions).toBeVisible();
    const pill = page.locator("a.pill-in");
    if (c.pill) await expect(pill).toContainText(c.pill); else await expect(pill).toHaveCount(0);
    await expect(page.getByText(c.ticker).first()).toBeAttached();
    // The word "Register" must not be offered once registration has closed.
    const body = (await page.locator("body").innerText()).replace(/\s+/g, " ");
    if (!c.registerWord) {
      expect(body).not.toMatch(/Register on Unstop|registration is live/i);
      await expect(page.getByRole("link", { name: /^Register\b/ })).toHaveCount(0);
    }
    if (shot) { await page.waitForTimeout(1200); await page.screenshot({ path: `docs/handoff/v6/home-${c.slug}.jpg`, type: "jpeg", quality: 70 }); }

    await page.goto("/venture-vortex");
    const cta = page.locator("main a").filter({ hasText: /Register on Unstop|Round 1 submissions on Unstop/ });
    if (c.vortexCta) await expect(cta.first()).toContainText(c.vortexCta); else await expect(cta).toHaveCount(0);
    const vortex = (await page.locator("body").innerText()).replace(/\s+/g, " ");
    if (!c.registerWord) expect(vortex).not.toMatch(/Register on Unstop|register now|registration is live/i);
    if (shot) { await page.waitForTimeout(800); await page.screenshot({ path: `docs/handoff/v6/vortex-${c.slug}.jpg`, type: "jpeg", quality: 70 }); }
  });
}
