// Usage: node scripts/lag-v5.mjs [url]  -> headed Chrome, real GPU. Scrolls the whole page with mouse-wheel input (what a visitor does) and reports
// frames over 34 ms (dropped), the worst frame, and every long task with the scroll position it happened at. CPU x1 and x4.
import { chromium } from "@playwright/test";
const url = process.argv[2] ?? "http://localhost:3100/";
const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist", "--use-angle=d3d11"] });
for (const throttle of [1, 4]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => {
    window.__lt = []; window.__fr = [];
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push([Math.round(e.duration), Math.round(scrollY)]))).observe({ type: "longtask", buffered: true });
    let last = performance.now();
    const f = (t) => { window.__fr.push([Math.round(t - last), Math.round(scrollY)]); last = t; requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });
  const cdp = await ctx.newCDPSession(p);
  await p.goto(url, { waitUntil: "load" });
  await p.waitForSelector("#hero[data-live]", { timeout: 30000 }).catch(() => console.log("live hero did not mount"));
  await p.waitForTimeout(2500);
  if (throttle > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });
  await p.evaluate(() => { window.__lt.length = 0; window.__fr.length = 0; });
  await p.mouse.move(700, 450);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 100) { await p.mouse.wheel(0, 100); await p.waitForTimeout(16); }
  await p.waitForTimeout(1500);
  const { lt, fr } = await p.evaluate(() => ({ lt: window.__lt, fr: window.__fr }));
  const dropped = fr.filter(([d]) => d > 34), worst = fr.reduce((m, f) => (f[0] > m[0] ? f : m), [0, 0]);
  console.log(`CPU x${throttle}: frames ${fr.length}, over 34 ms: ${dropped.length} (${((dropped.length / fr.length) * 100).toFixed(1)}%), worst ${worst[0]} ms at y=${worst[1]}; long tasks: ${lt.length}${lt.length ? " " + JSON.stringify(lt) : ""}`);
  await ctx.close();
}
await b.close();
