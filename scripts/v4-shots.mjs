// Usage: node scripts/v4-shots.mjs <label> <path> [vw,vh[,touch]] [rm]   (server on :3100)
// One screenshot per numbered chapter ([data-section]) at the moment its top sits just below the nav, plus console errors.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const [label, path = "", vp = "1440,900", rm] = process.argv.slice(2);
const [w, h, touch] = vp.split(",");
const OUT = "docs/handoff/v4"; await mkdir(OUT, { recursive: true });
const b = await chromium.launch({ channel: "chrome", args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist", "--use-angle=d3d11"] });
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, hasTouch: !!touch, isMobile: !!touch, deviceScaleFactor: 1, reducedMotion: rm ? "reduce" : "no-preference" });
const p = await ctx.newPage(); const errs = [];
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 160)); });
p.on("pageerror", (e) => errs.push("PAGEERR " + e.message.slice(0, 160)));
await p.goto("http://localhost:3100/" + path.replace(/^[/]/, ""), { waitUntil: "load" });
await p.waitForTimeout(4500);
const n = await p.evaluate(() => document.querySelectorAll("main [data-section]").length);
const tops = await p.evaluate(() => [...document.querySelectorAll("main [data-section]")].map((e) => Math.round(e.getBoundingClientRect().top + scrollY)));
for (let i = 0; i < Math.max(n, 1); i++) {
  await p.evaluate((y) => window.scrollTo(0, y), Math.max(0, (tops[i] ?? 0) - 8));
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `${OUT}/${label}-${w}-${String(i + 1).padStart(2, "0")}.png` });
}
await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await p.waitForTimeout(1200);
await p.screenshot({ path: `${OUT}/${label}-${w}-end.png` });
console.log(label, w, "sections", n, "errors", errs.length ? errs : "none");
await b.close();
