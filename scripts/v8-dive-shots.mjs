// Viewport screenshots inside the pinned dive at fixed progress points (a full-page capture shows the 360vh runway as blank). Usage: node scripts/v8-dive-shots.mjs <outDir> [w] [h]
import { mkdirSync } from "node:fs";
import { base, launch } from "./_v7.mjs";

const [out, w = "1366", h = "768"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await launch();
const p = await (await b.newContext({ viewport: { width: +w, height: +h } })).newPage();
await p.goto(base + "/", { waitUntil: "load" });
await p.waitForTimeout(2500);
const box = await p.evaluate(() => { const t = document.querySelector("#dive .dive-live .track") ?? document.querySelector("#dive"); const r = t.getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; });
for (const f of [0.02, 0.2, 0.4, 0.6, 0.8, 0.97]) {
  await p.evaluate((y) => window.scrollTo(0, y), box.top + (box.h - +h) * f);
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `${out}/dive-${w}-${Math.round(f * 100)}.png` });
  console.log("dive", f, await p.evaluate(() => document.querySelector("#dive [data-scene]")?.getAttribute("data-scene")));
}
await b.close();
