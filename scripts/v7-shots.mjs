// Full-page screenshots of every route at 5 widths. Usage: node scripts/v7-shots.mjs <outDir>
import { mkdirSync } from "node:fs";
import { launch, routes, settle, WIDTHS } from "./_v7.mjs";
import { base } from "./_v7.mjs";

const out = process.argv[2] ?? "docs/handoff/v7/before";
mkdirSync(out, { recursive: true });
const browser = await launch();
for (const r of await routes()) {
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 740 : 900 } });
    const p = await ctx.newPage();
    await p.goto(base + r, { waitUntil: "load" });
    await settle(p);
    const name = `${r === "/" ? "home" : r.slice(1).replace(/\//g, "-")}-${w}.jpg`;
    await p.screenshot({ path: `${out}/${name}`, fullPage: true, type: "jpeg", quality: 55, timeout: 120000 });
    await ctx.close();
  }
  console.log("shot", r);
}
await browser.close();
