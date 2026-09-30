import { chromium } from "@playwright/test";
import sharp from "sharp";
const out = "docs/handoff/phase1";
const b = await chromium.launch({ channel: "chrome" });
const files = {};
for (const W of [360, 768, 1440]) {
  const ctx = await b.newContext({ viewport: { width: W, height: W === 1440 ? 900 : 800 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3100/", { waitUntil: "load" });
  await p.waitForTimeout(1800);
  const snap = async (n) => { const f = `${out}/${W}-${n}.png`; await p.screenshot({ path: f }); (files[W] ??= []).push([n, f]); };
  await snap("top");
  await p.evaluate(() => window.scrollTo(0, 1300)); await p.waitForTimeout(900);
  await snap("scrolled-pill");
  if (W < 768) {
    await p.locator("button:has-text('Open menu'):visible").first().click(); await p.waitForTimeout(1300);
    await snap("menu-open");
    await p.keyboard.press("Escape"); await p.waitForTimeout(300);
  }
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(900);
  await snap("footer");
  await ctx.close();
}
// button states at 1440, 2x
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto("http://localhost:3100/", { waitUntil: "load" });
await p.waitForTimeout(1800);
const btn = p.locator("main a", { hasText: "See our events" }).first();
const box = await btn.boundingBox();
const clip = { x: box.x - 24, y: box.y - 24, width: 520, height: box.height + 48 };
const state = async (n) => { await p.screenshot({ path: `${out}/btn-${n}.png`, clip }); };
await p.mouse.move(5, 5); await state("rest");
await p.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2); await p.waitForTimeout(700); await state("hover");
await p.mouse.down(); await p.waitForTimeout(250); await state("pressed"); await p.mouse.move(5, 5); await p.mouse.up();
await p.mouse.move(5, 5); await p.keyboard.press("Tab"); await btn.focus();
await p.waitForTimeout(700); await state("focus");
await b.close();

// contact sheet
const H = 560, lab = 28;
const rows = [];
for (const W of [360, 768, 1440]) {
  const tiles = [];
  for (const [n, f] of files[W]) {
    const img = await sharp(f).resize({ height: H }).png().toBuffer();
    const m = await sharp(img).metadata();
    tiles.push({ n: `${W}px ${n}`, img, w: m.width });
  }
  rows.push(tiles);
}
const gap = 16, pad = 16;
const rowW = (t) => t.reduce((a, x) => a + x.w + gap, pad);
const sheetW = Math.max(...rows.map(rowW));
const sheetH = pad + rows.length * (H + lab + gap);
const comps = [];
rows.forEach((tiles, r) => { let x = pad; for (const t of tiles) {
  const y = pad + r * (H + lab + gap);
  comps.push({ input: t.img, left: x, top: y + lab });
  comps.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${t.w}" height="${lab}"><text x="0" y="19" font-family="monospace" font-size="15" fill="#f5f1e6">${t.n}</text></svg>`), left: x, top: y });
  x += t.w + gap; } });
await sharp({ create: { width: sheetW, height: sheetH, channels: 3, background: "#222" } }).composite(comps).png().toFile(`${out}/contact-sheet.png`);
const bt = await Promise.all(["rest", "hover", "pressed", "focus"].map((n) => sharp(`${out}/btn-${n}.png`).resize({ width: 520 }).png().toBuffer()));
const bh = (await sharp(bt[0]).metadata()).height;
await sharp({ create: { width: 520 * 2 + 48, height: bh * 2 + 48, channels: 3, background: "#222" } })
  .composite(bt.map((input, i) => ({ input, left: 16 + (i % 2) * 536, top: 16 + Math.floor(i / 2) * (bh + 16) }))).png().toFile(`${out}/button-states.png`);
console.log("done", sheetW, sheetH);
