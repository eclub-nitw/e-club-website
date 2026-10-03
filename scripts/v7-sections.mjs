// Viewport-sized screenshots down one route so each section can be looked at. Usage: node scripts/v7-sections.mjs <route> <width> <outDir> [maxShots]
import { mkdirSync } from "node:fs";
import { launch, base, settle } from "./_v7.mjs";
const [route = "/", width = "1440", out = "docs/handoff/v7/sections", max = "40"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await launch();
const w = Number(width), h = w < 500 ? 740 : 900;
const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
await p.goto(base + route, { waitUntil: "load" });
await settle(p);
const total = await p.evaluate(() => document.documentElement.scrollHeight);
const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
let n = 0;
for (let y = 0; y < total && n < Number(max); y += h * 0.9, n++) {
  await p.evaluate((v) => window.scrollTo(0, v), y);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${out}/${slug}-${width}-${String(n).padStart(2, "0")}.jpg`, type: "jpeg", quality: 60 });
}
console.log(`${n} shots, page ${total}px`);
await b.close();
