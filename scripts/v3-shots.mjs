// Usage: node scripts/v3-shots.mjs <label> <path> [vw,vh[,touch]] [frac,frac,...]   server on :3100. Screenshots the viewport at scroll fractions.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const [label, path = "", vp = "1440,900", fr = "0"] = process.argv.slice(2);
const [w, h, touch] = vp.split(",");
const OUT = "docs/handoff/v3"; await mkdir(OUT, { recursive: true });
const b = await chromium.launch({ channel: "chrome", args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist", "--use-angle=d3d11"] });
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, hasTouch: !!touch, isMobile: !!touch, deviceScaleFactor: 1 });
const p = await ctx.newPage(); const errs = [];
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 140)); }); p.on("pageerror", (e) => errs.push("PAGEERR " + e.message.slice(0, 140)));
await p.goto("http://localhost:3100/" + path.replace(/^[/]/, ""), { waitUntil: "load" }); await p.waitForTimeout(3500);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (const f of fr.split(",")) {
  await p.evaluate(([f, H]) => window.scrollTo(0, f < 1.01 && f.toString().includes(".") || f <= 1 ? f * (H - innerHeight) : f), [+f, H]);
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${OUT}/${label}-${w}-${String(f).replace(".", "_")}.png` });
}
console.log(label, "docH", H, "errors", errs.length ? errs : "none");
await b.close();
