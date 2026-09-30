// Usage: node scripts/inp.mjs http://localhost:3100/  -> worst Event Timing duration (INP proxy) under 4x CPU throttle
import { chromium } from "@playwright/test";
const url = process.argv[2] ?? "http://localhost:3100/";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: false });
const cdp = await page.context().newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await page.addInitScript(() => {
  window.__ev = [];
  new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__ev.push(e.duration))).observe({ type: "event", durationThreshold: 16, buffered: true });
});
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(2500);
for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 500); await page.waitForTimeout(150); }
await page.keyboard.press("Tab"); await page.keyboard.press("Tab");
await page.mouse.click(200, 400);
await page.waitForTimeout(800);
const ev = await page.evaluate(() => window.__ev);
ev.sort((a, b) => b - a);
console.log(`events>=16ms: ${ev.length}, worst ${ev[0] ?? 0} ms, p98 ${ev[Math.floor(ev.length * 0.02)] ?? 0} ms`);
await browser.close();
