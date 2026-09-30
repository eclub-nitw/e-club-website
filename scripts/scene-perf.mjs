// Usage: node scripts/scene-perf.mjs [url]   -> fps of the live hero scene + long tasks during a full scroll, in headed Chrome (real GPU).
// Writes a Chrome trace of the scroll to scene-scroll-trace.json (gitignored) and prints the RunTask summary.
import { chromium } from "@playwright/test";
import { readFileSync, statSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3100/";
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist", "--enable-precise-memory-info"] });

const fps = (page, ms) => page.evaluate((d) => new Promise((res) => {
  let n = 0, worst = 0, last = performance.now(); const t0 = last;
  const f = (t) => { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 < d) requestAnimationFrame(f); else res({ fps: +(n / ((t - t0) / 1000)).toFixed(1), worstFrameMs: +worst.toFixed(1) }); };
  requestAnimationFrame(f);
}), ms);

async function scenario(label, cpuRate) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (cpuRate > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuRate });
  await page.addInitScript(() => { window.__lt = []; new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push(e.duration))).observe({ type: "longtask", buffered: true }); });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelector("[data-scene]")?.getAttribute("data-scene") === "live", null, { timeout: 90000 }).catch(() => {});
  const state = await page.evaluate(() => document.querySelector("[data-scene]")?.getAttribute("data-scene"));
  await page.waitForTimeout(2500); // let the rise-in animation finish
  // hero: pointer moving so parallax is working
  const mover = (async () => { for (let i = 0; i < 40; i++) { await page.mouse.move(300 + (i * 23) % 900, 200 + (i * 17) % 500); await page.waitForTimeout(100); } })();
  const heroFps = await fps(page, 4000); await mover;
  // full scroll with a trace
  const tracePath = cpuRate > 1 ? "scene-scroll-trace-throttled.json" : "scene-scroll-trace.json";
  if (tracePath) await browser.startTracing(page, { path: tracePath, categories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "v8.execute"] });
  await page.evaluate(() => { window.__lt.length = 0; });
  const scrollFps = page.evaluate(() => new Promise((res) => {
    let n = 0, worst = 0, last = performance.now(); const t0 = last;
    const f = (t) => { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 < 9000) requestAnimationFrame(f); else res({ fps: +(n / ((t - t0) / 1000)).toFixed(1), worstFrameMs: +worst.toFixed(1) }); };
    requestAnimationFrame(f);
  }));
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y < total; y += 260) { await page.mouse.wheel(0, 260); await page.waitForTimeout(60); }
  const sf = await scrollFps;
  if (tracePath) await browser.stopTracing();
  const lt = await page.evaluate(() => window.__lt);
  console.log(`${label.padEnd(26)} scene=${state} | hero fps ${heroFps.fps} (worst frame ${heroFps.worstFrameMs} ms) | scroll fps ${sf.fps} (worst frame ${sf.worstFrameMs} ms) | long tasks during scroll: ${lt.length}, max ${Math.round(Math.max(0, ...lt))} ms, >50ms: ${lt.filter((d) => d > 50).length}`);
  await ctx.close();
  return tracePath;
}

const trace = await scenario("desktop, no throttle", 1);
const traceThrottled = await scenario("desktop, 4x CPU throttle", 4);
await browser.close();

function summarise(file, label) {
  const ev = JSON.parse(readFileSync(file, "utf8")).traceEvents ?? [];
  const tasks = ev.filter((e) => e.name === "RunTask" && e.ph === "X" && e.dur);
  const over = tasks.filter((e) => e.dur / 1000 > 50).sort((a, b) => b.dur - a.dur);
  console.log(`${label}: ${statSync(file).size >> 10} KB, ${tasks.length} RunTask events, ${over.length} over 50 ms`);
  for (const t of over.slice(0, 6)) {
    const inner = ev.filter((e) => e.tid === t.tid && e.pid === t.pid && e.ph === "X" && e.name !== "RunTask" && e.ts >= t.ts && e.ts + (e.dur ?? 0) <= t.ts + t.dur && e.dur > 5000).sort((a, b) => b.dur - a.dur).slice(0, 3);
    console.log(`  ${(t.dur / 1000).toFixed(0)} ms: ` + inner.map((e) => `${e.name} ${(e.dur / 1000).toFixed(0)}ms${e.args?.data?.url ? " " + e.args.data.url.split("/").pop().slice(0, 30) : ""}${e.args?.data?.functionName ? " fn=" + e.args.data.functionName.slice(0, 30) : ""}`).join(" | "));
  }
}
if (trace) summarise(trace, "trace (no throttle)");
if (traceThrottled) summarise(traceThrottled, "trace (4x CPU throttle)");
