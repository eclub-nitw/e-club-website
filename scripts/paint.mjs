// Usage: node scripts/paint.mjs <url>  -> FCP/LCP under Lighthouse-mobile-like throttling, with one suspect removed per variant.
import { chromium } from "@playwright/test";
const url = process.argv[2] ?? "http://localhost:3100/";
const browser = await chromium.launch({ channel: "chrome" });
const variants = {
  baseline: {},
  "no JS": { blockJs: true },
  "no fonts": { blockFonts: true },
  "no poster": { blockPoster: true },
  "no grain overlay": { css: ".grain::after{display:none!important}" },
  "no JS + no fonts": { blockJs: true, blockFonts: true },
  "no CSS": { blockCss: true },
  "no hero animation": { css: ".mask-now .mask-word>span{animation:none!important;transform:none!important}" },
};
for (const [name, v] of Object.entries(variants)) {
  const vals = [];
  for (let i = 0; i < 3; i++) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    if (!process.env.NOTHROTTLE) {
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 562.5, downloadThroughput: (1.6 * 1024 * 1024 * 0.9) / 8, uploadThroughput: (750 * 1024 * 0.9) / 8 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    await page.route("**/*", (r) => {
      const u = r.request().url(), t = r.request().resourceType();
      if (v.blockJs && t === "script") return r.abort();
      if (v.blockFonts && t === "font") return r.abort();
      if (v.blockCss && t === "stylesheet") return r.abort();
      if (v.blockPoster && u.includes("/_next/image")) return r.abort();
      return r.continue();
    });
    await page.addInitScript(() => {
      window.__p = {};
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (e.name === "first-contentful-paint") window.__p.fcp = e.startTime; })).observe({ type: "paint", buffered: true });
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { window.__p.lcp = e.startTime; window.__p.lcpEl = e.element?.tagName + (e.element?.className?.toString().slice(0, 30) ?? ""); })).observe({ type: "largest-contentful-paint", buffered: true });
    });
    await page.goto(url, { waitUntil: "load" });
    if (v.css) await page.addStyleTag({ content: v.css });
    await page.waitForTimeout(2500);
    vals.push(await page.evaluate(() => window.__p));
    await ctx.close();
  }
  const f = vals.map((x) => Math.round(x.fcp ?? -1)).sort((a, b) => a - b), l = vals.map((x) => Math.round(x.lcp ?? -1)).sort((a, b) => a - b);
  console.log(`${name.padEnd(18)} FCP ${f.join("/")} ms   LCP ${l.join("/")} ms   ${vals[0].lcpEl}`);
}
await browser.close();
