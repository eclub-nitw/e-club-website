// V4 gates. Usage: node scripts/audit-v4.mjs [baseUrl] [routes,comma] [widths,comma]     (production server, default http://localhost:3100)
//  1. TYPE   every visible text node's family / weight / size must belong to the token set (t-impact, t-h1..3, t-lede(-xl), t-body, t-label, t-ui, t-wordmark).
//  2. CONTRAST  worst-case contrast of every text node against the pixels actually behind it (text hidden, screenshot, sample the box).
//  3. NAV   at scroll 0 no content text sits under the fixed nav.
//  4. AXE   wcag2a / wcag2aa / wcag22aa violations.
// Exits 1 on any FAIL. Static scan (ad-hoc size classes in source) is `node scripts/type-audit.mjs`.
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const all = [...new Set([...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname), "/privacy", "/terms"])];
const routes = process.argv[3] ? process.argv[3].split(",") : all;
const widths = (process.argv[4] ?? "360,768,1440").split(",").map(Number);
const axeSrc = await readFile("node_modules/axe-core/axe.min.js", "utf8");

let fails = 0;
const out = (ok, name, detail = "") => { if (!ok) fails++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  " + detail : ""}`); };
const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

const browser = await chromium.launch({ channel: "chrome", args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist", "--use-angle=d3d11"] });

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 740 : w < 900 ? 1024 : 900 }, hasTouch: w < 500, isMobile: w < 500, reducedMotion: "reduce" });
  for (const r of routes) {
    const p = await ctx.newPage();
    await p.goto(base + r, { waitUntil: "load" });
    await p.waitForTimeout(1200);
    const tag = `${r} @${w}`;

    // ---- token sizes at this width
    const tokens = await p.evaluate(() => {
      const probe = (cls) => { const e = document.createElement("p"); e.className = cls; e.textContent = "x"; document.body.append(e); const c = getComputedStyle(e); const o = { size: c.fontSize, family: c.fontFamily }; e.remove(); return o; };
      return Object.fromEntries(["t-impact", "t-impact-s", "t-h1", "t-h2", "t-h3", "t-lede", "t-lede-xl", "t-body", "t-label", "t-ui", "t-wordmark"].map((k) => [k, probe(k)]));
    });
    const sizes = new Set(Object.values(tokens).map((t) => t.size));
    const famOf = (f) => (/bricolage/i.test(f) ? "display" : /serif/i.test(f) && /instrument/i.test(f) ? "serif" : /instrument/i.test(f) ? "sans" : /jetbrains|mono/i.test(f) ? "mono" : f);

    // ---- collect text boxes (leaf-ish elements with their own text)
    const boxes = await p.evaluate(() => {
      const res = [];
      // computed colours can be color(srgb ...) / oklab(...) (color-mix), so normalise through a canvas to 8-bit sRGB
      const cx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      const rgb = (css) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#000"; cx.fillStyle = css; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set();
      while (walker.nextNode()) {
        const n = walker.currentNode; if (!n.textContent.trim()) continue;
        const el = n.parentElement; if (!el || seen.has(el) || el.closest("script,style,noscript,[hidden]")) continue; seen.add(el);
        const rg = document.createRange(); rg.selectNodeContents(n);
        const rects = [...rg.getClientRects()].filter((r) => r.width >= 2 && r.height >= 2);
        if (!rects.length) continue;
        const c = getComputedStyle(el); if (c.visibility === "hidden" || c.display === "none") continue;
        let op = 1; for (let e = el; e; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity);
        if (op < 0.05) continue;
        const col = rgb(c.color);
        const sr = el.closest(".sr-only"); if (sr) continue;
        for (const rect of rects) res.push({ text: n.textContent.trim().slice(0, 28), x: rect.x + scrollX, y: rect.y + scrollY, w: rect.width, h: rect.height, size: c.fontSize, weight: c.fontWeight, family: c.fontFamily.split(",")[0].replace(/"/g, ""), color: col, op, aria: !!el.closest("[aria-hidden=true]") });
      }
      return res;
    });

    // ---- 1. TYPE
    const bad = [];
    for (const b of boxes) {
      const fam = famOf(b.family), wt = +b.weight;
      const okFam = ["display", "sans", "serif", "mono"].includes(fam);
      const okW = fam === "display" ? wt >= 200 && wt <= 800 : fam === "mono" ? wt === 500 : wt === 400;
      const okS = sizes.has(b.size);
      if (!(okFam && okW && okS)) bad.push(`${b.text}|${fam}|${wt}|${b.size}`);
    }
    out(bad.length === 0, `type ${tag}`, bad.length ? `${bad.length} off-token: ${[...new Set(bad)].slice(0, 12).join("; ")}` : `${boxes.length} text nodes`);

    // ---- 3. NAV (rest state at the top)
    const nav = await p.evaluate(() => { const n = document.querySelector("header nav"); const r = n?.getBoundingClientRect(); return r ? { top: r.top, bottom: r.bottom, left: r.left, right: r.right } : null; });
    if (nav) {
      const under = boxes.filter((b) => b.y < nav.bottom && b.y + b.h > nav.top && b.x < nav.right && b.x + b.w > nav.left && !b.aria && !/E-Club|NITW|Venture Vortex|About|Events|Team|Sponsors|Gallery|Contact|\d\d \/ \d\d/.test(b.text));
      out(under.length === 0, `nav-overlap ${tag}`, under.length ? under.map((b) => b.text).join(", ") : "");
    }

    // ---- 2. CONTRAST against real pixels (text hidden)
    const vh = p.viewportSize().height, H = await p.evaluate(() => document.documentElement.scrollHeight);
    const lows = [];
    for (let y0 = 0; y0 < H; y0 += vh) {
      await p.evaluate((y) => window.scrollTo(0, y), y0); await p.waitForTimeout(250);
      const sy = await p.evaluate(() => scrollY);
      const here = boxes.filter((b) => b.y >= sy && b.y + b.h <= sy + vh && b.op >= 0.5);
      if (!here.length) continue;
      await p.addStyleTag({ content: "*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important} svg{visibility:hidden!important}", });
      const shot = await sharp(await p.screenshot()).raw().toBuffer({ resolveWithObject: true });
      await p.evaluate(() => { document.querySelectorAll("style").forEach((s) => { if (s.textContent.startsWith("*{color:transparent")) s.remove(); }); });
      for (const b of here) {
        const x0 = Math.max(0, Math.floor(b.x)), y1 = Math.max(0, Math.floor(b.y - sy)), x1 = Math.min(shot.info.width, Math.ceil(b.x + b.w)), y2 = Math.min(shot.info.height, Math.ceil(b.y - sy + b.h));
        let worst = 21;
        const fg = b.color.slice(0, 3);
        const step = Math.max(1, Math.floor((x1 - x0) / 40));
        for (let y = y1; y < y2; y += 2) for (let x = x0; x < x1; x += step) {
          const i = (y * shot.info.width + x) * shot.info.channels, bg = [shot.data[i], shot.data[i + 1], shot.data[i + 2]];
          const a = (b.color[3] ?? 1) * b.op, mix = fg.map((v, k) => v * a + bg[k] * (1 - a));
          worst = Math.min(worst, ratio(mix, bg));
        }
        const big = parseFloat(b.size) >= 24 || (parseFloat(b.size) >= 18.66 && +b.weight >= 700);
        const need = b.aria ? 0 : big ? 3 : 4.5;
        if (worst < need) lows.push(`${b.text} ${worst.toFixed(1)}:1 (${b.size}) y=${Math.round(b.y)}`);
      }
    }
    out(lows.length === 0, `contrast ${tag}`, lows.length ? `${lows.length} below AA: ${lows.slice(0, 4).join("; ")}` : "");

    // ---- 4. AXE
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.evaluate(axeSrc);
    const ax = await p.evaluate(async () => { const r = await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag22aa"], rules: { "color-contrast": { enabled: false } } }); return r.violations.map((v) => `${v.id}(${v.nodes.length})`); });
    out(ax.length === 0, `axe ${tag}`, ax.join(", "));
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(fails ? `\n${fails} FAIL` : "\nall pass");
process.exit(fails ? 1 : 0);
