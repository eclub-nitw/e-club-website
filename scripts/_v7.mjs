// Shared helpers for the V7 audits: routes from the sitemap, a scroll that fires every IntersectionObserver, a Chrome launcher.
import { chromium } from "@playwright/test";

export const base = (process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
export const WIDTHS = [360, 768, 1024, 1440, 1920];
export const launch = () => chromium.launch({ channel: "chrome", args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist", "--use-angle=d3d11"] });

export async function routes() {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  return [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))];
}

/** Scroll to the end in steps so on-enter animations fire, then settle and return to the top. */
export async function settle(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = await page.evaluate(() => innerHeight);
  for (let y = 0; y < h; y += vh * 0.7) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(140); }
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}
