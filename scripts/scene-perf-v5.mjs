// Usage: node scripts/scene-perf-v5.mjs [url]  -> headed Chrome, real GPU. Frame rate of each scene at CPU x1 and x4:
//   hero (Rising Ledger, idle), reach map (scroll through the pinned track), vortex expand (scroll through the pinned track), plus long tasks over a full scroll.
import { chromium } from "@playwright/test";
const url = process.argv[2] ?? "http://localhost:3100/";
const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist", "--use-angle=d3d11"] });

const measure = (p, ms) => p.evaluate((dur) => new Promise((res) => {
  let n = 0, worst = 0, last = performance.now(); const t0 = last;
  const f = (t) => { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 < dur) requestAnimationFrame(f); else res({ fps: +(n / ((t - t0) / 1000)).toFixed(1), worstFrameMs: Math.round(worst) }); };
  requestAnimationFrame(f);
}), ms);

// scroll through a track while frames are being counted
async function scrub(p, sel, ms) {
  const box = await p.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; }, sel);
  await p.evaluate((y) => window.scrollTo(0, y), box.top); await p.waitForTimeout(1500);
  const run = measure(p, ms);
  const steps = 40;
  for (let i = 0; i <= steps; i++) { await p.evaluate((y) => window.scrollTo(0, y), box.top + (i / steps) * (box.h - 900)); await p.waitForTimeout(ms / steps); }
  return run;
}

for (const throttle of [1, 4]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => { window.__lt = []; new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push(Math.round(e.duration)))).observe({ type: "longtask", buffered: true }); });
  const cdp = await ctx.newCDPSession(p);
  await p.goto(url, { waitUntil: "load" });
  await p.waitForSelector("#hero[data-live]", { timeout: 30000 }).catch(() => console.log("live hero scene did not mount"));
  await p.waitForTimeout(2500);
  if (throttle > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });
  const hero = await measure(p, 4000);
  const map = await scrub(p, "#reach .track", 4000);
  const dive = await scrub(p, "#flagship .dive-live .track", 6000);
  await p.evaluate(() => { window.__lt.length = 0; });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 300) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(60); }
  const lt = await p.evaluate(() => window.__lt);
  console.log(`CPU x${throttle}: hero ${JSON.stringify(hero)}; map ${JSON.stringify(map)}; vortex expand ${JSON.stringify(dive)}; long tasks in a full scroll: ${lt.length}${lt.length ? " max " + Math.max(...lt) + " ms" : ""}`);
  await ctx.close();
}
await b.close();
