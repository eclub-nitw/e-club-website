// Usage: node scripts/phase2-shots.mjs  -> docs/handoff/phase2/sheet-<mode>.png contact sheets (needs prod server on :3100, headed Chrome for the live scene)
import { chromium } from "@playwright/test";
import sharp from "sharp";
const out = "docs/handoff/phase2";
const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist"] });
const modes = [
  ["live-1440", { viewport: { width: 1440, height: 900 } }],
  ["live-768", { viewport: { width: 768, height: 1024 } }],
  ["live-360", { viewport: { width: 360, height: 780 } }],
  ["touch-poster-390", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["reduced-1440", { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }],
  ["reduced-360", { viewport: { width: 360, height: 780 }, reducedMotion: "reduce", deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
];
for (const [name, opts] of modes) {
  const p = await (await b.newContext(opts)).newPage(); const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  await p.goto("http://localhost:3100/", { waitUntil: "load" });
  await p.waitForTimeout(name.startsWith("live") ? 6500 : 2500);
  const state = await p.evaluate(() => [document.querySelector("[data-scene]")?.getAttribute("data-scene"), document.querySelectorAll("canvas").length, document.documentElement.scrollWidth > innerWidth ? "OVERFLOW" : "no-overflow"].join("/"));
  const ids = await p.evaluate(() => [...document.querySelectorAll("main section[id]")].map((s) => s.id));
  const shots = [await p.screenshot()];
  for (const id of ids) {
    await p.evaluate((i) => { const s = document.getElementById(i); window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 20); }, id); await p.waitForTimeout(1500);
    shots.push(await p.screenshot());
  }
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(900); shots.push(await p.screenshot());
  const H = 640, tiles = await Promise.all(shots.map((s) => sharp(s).resize({ height: H }).png().toBuffer()));
  const metas = await Promise.all(tiles.map((t) => sharp(t).metadata()));
  const W = metas.reduce((a, m) => a + m.width + 8, 8);
  await sharp({ create: { width: W, height: H + 16, channels: 3, background: "#333" } }).composite(tiles.map((input, i) => ({ input, left: 8 + metas.slice(0, i).reduce((a, m) => a + m.width + 8, 0), top: 8 }))).png().toFile(`${out}/sheet-${name}.png`);
  console.log(name.padEnd(18), "scene/canvases/overflow:", state, "| sections:", ids.join(","), "| errors:", errs.length);
  await p.close();
}
await b.close();
