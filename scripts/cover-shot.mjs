// Usage: PORT=3200 node scripts/cover-shot.mjs <out.png> [vw,vh]   Waits for the live scene, then screenshots the cover.
import { chromium } from "@playwright/test";
const [out, vp = "1440,900"] = process.argv.slice(2); const [w, h] = vp.split(",");
const b = await chromium.launch({ channel: "chrome", args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist", "--use-angle=d3d11"] });
const p = await (await b.newContext({ viewport: { width: +w, height: +h } })).newPage(); const errs = [];
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 200)); });
await p.goto(`http://localhost:${process.env.PORT ?? 3100}/`, { waitUntil: "load" });
await p.waitForSelector("#cover[data-live]", { timeout: 25000 }).catch(() => errs.push("no data-live"));
await p.waitForTimeout(2500);
await p.screenshot({ path: out });
console.log("errors", errs.length ? errs : "none"); await b.close();
