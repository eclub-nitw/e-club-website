// Full-page screenshots of every route at the V8 widths. Usage: BASE_URL=https://e-club-nitw.vercel.app node scripts/v8-shots.mjs <outDir> [route,route]
import { mkdirSync } from "node:fs";
import { base, launch, settle } from "./_v7.mjs";

const [out, only] = process.argv.slice(2);
const ROUTES = only ? only.split(",") : ["/", "/about", "/initiatives", "/initiatives/valuation-wars", "/venture-vortex", "/team", "/sponsors", "/gallery", "/contact"];
const SIZES = [[390, 844], [768, 1024], [1366, 768], [1440, 900], [1920, 1080]];
mkdirSync(out, { recursive: true });
const browser = await launch();
for (const [w, h] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 500 });
  const page = await ctx.newPage();
  for (const r of ROUTES) {
    await page.goto(base + r, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    await settle(page);
    const name = `${r === "/" ? "home" : r.slice(1).replace(/\//g, "-")}-${w}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: true });
    const sw = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    console.log(name, sw[0] > sw[1] ? `H-SCROLL ${sw}` : "ok");
  }
  await ctx.close();
}
await browser.close();
