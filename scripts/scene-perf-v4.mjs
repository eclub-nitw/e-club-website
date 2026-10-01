// Usage: node scripts/scene-perf-v4.mjs [url]  -> headed Chrome, real GPU. Rising Ledger fps (normal and 4x CPU throttle) + long tasks during a full scroll.
import { chromium } from "@playwright/test";
const url = process.argv[2] ?? "http://localhost:3100/";
const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist", "--use-angle=d3d11"] });
for (const throttle of [1, 4]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => { window.__lt = []; new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push(Math.round(e.duration)))).observe({ type: "longtask", buffered: true }); });
  const cdp = await ctx.newCDPSession(p);
  await p.goto(url, { waitUntil: "load" });
  await p.waitForSelector("#cover[data-live]", { timeout: 30000 }).catch(() => console.log("live scene did not mount"));
  await p.waitForTimeout(2500);
  if (throttle > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });
  const fps = await p.evaluate(() => new Promise((res) => { let n = 0, worst = 0, last = performance.now(); const t0 = last; const f = (t) => { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 < 4000) requestAnimationFrame(f); else res({ fps: +(n / ((t - t0) / 1000)).toFixed(1), worstFrameMs: Math.round(worst) }); }; requestAnimationFrame(f); }));
  await p.evaluate(() => { window.__lt.length = 0; });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 300) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(60); }
  const lt = await p.evaluate(() => window.__lt);
  console.log(`CPU x${throttle}: hero ${JSON.stringify(fps)}; long tasks during a full scroll: ${lt.length}${lt.length ? " max " + Math.max(...lt) + " ms" : ""}`);
  await ctx.close();
}
await b.close();
