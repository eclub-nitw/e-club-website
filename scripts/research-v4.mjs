// V4 reference audit. Usage: node scripts/research-v4.mjs <url> <label>
// Records the type scale actually used (distinct size/weight/tracking/line-height/case per visible text node), font count,
// canvases, sticky elements, custom cursor, and screenshots at 4 scroll points. Principles only; nothing is copied.
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const [url, label] = process.argv.slice(2);
const OUT = "docs/handoff/v4/research"; await mkdir(OUT, { recursive: true });
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const res = { label, url, ok: false };
try {
  await p.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await p.waitForTimeout(7000);
  res.title = await p.title();
  res.ok = true;
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  res.docHeight = H;
  const scale = new Map();
  for (const f of [0, 0.25, 0.5, 0.75]) {
    await p.evaluate((y) => window.scrollTo(0, y), Math.max(0, Math.min(H - 900, H * f)));
    await p.waitForTimeout(2200);
    await p.screenshot({ path: `${OUT}/${label}-${Math.round(f * 100)}.png` });
    const rows = await p.evaluate(() => {
      const out = [];
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const n = w.currentNode; const t = n.textContent.trim(); if (t.length < 2) continue;
        const el = n.parentElement; const r = el.getBoundingClientRect();
        if (r.width < 4 || r.bottom < 0 || r.top > innerHeight) continue;
        const c = getComputedStyle(el); if (c.visibility === "hidden" || c.opacity === "0") continue;
        out.push([Math.round(parseFloat(c.fontSize)), c.fontWeight, c.fontFamily.split(",")[0].replace(/"/g, ""), c.textTransform, c.letterSpacing, c.lineHeight, c.fontStretch, t.slice(0, 28)]);
      }
      return out;
    });
    for (const [fs, fw, ff, tt, ls, lh, st, t] of rows) {
      const k = [fs, fw, ff, tt, ls, lh, st].join("|");
      const cur = scale.get(k) || { n: 0, sample: t }; cur.n++; scale.set(k, cur);
    }
  }
  res.type = [...scale].map(([k, v]) => ({ k, ...v })).sort((a, b) => parseInt(b.k) - parseInt(a.k));
  res.families = [...new Set(res.type.map((r) => r.k.split("|")[2]))];
  res.misc = await p.evaluate(() => ({
    canvases: document.querySelectorAll("canvas").length, videos: document.querySelectorAll("video").length, imgs: document.images.length,
    sticky: [...document.querySelectorAll("*")].filter((e) => getComputedStyle(e).position === "sticky").length,
    bodyCursor: getComputedStyle(document.body).cursor, lenis: document.documentElement.classList.contains("lenis"),
    bodyBg: getComputedStyle(document.body).backgroundColor, bodyColor: getComputedStyle(document.body).color,
    gsap: !!window.gsap, three: !!window.THREE, next: !!window.__NEXT_DATA__ || !!document.querySelector("#__next"),
  }));
  // pointer behaviour: does anything fixed follow the mouse?
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
  await p.mouse.move(300, 300); await p.waitForTimeout(150);
  const a = await p.evaluate(() => [...document.querySelectorAll("*")].filter((e) => getComputedStyle(e).position === "fixed" && e.getBoundingClientRect().width < 120 && e.getBoundingClientRect().width > 0).map((e) => { const r = e.getBoundingClientRect(); return [e.className.toString().slice(0, 30), Math.round(r.x), Math.round(r.y)]; }));
  await p.mouse.move(900, 500); await p.waitForTimeout(400);
  const c = await p.evaluate(() => [...document.querySelectorAll("*")].filter((e) => getComputedStyle(e).position === "fixed" && e.getBoundingClientRect().width < 120 && e.getBoundingClientRect().width > 0).map((e) => { const r = e.getBoundingClientRect(); return [e.className.toString().slice(0, 30), Math.round(r.x), Math.round(r.y)]; }));
  res.cursorFollowers = c.filter((x, i) => a[i] && (a[i][1] !== x[1] || a[i][2] !== x[2])).length;
} catch (e) { res.error = e.message.slice(0, 160); }
await writeFile(`${OUT}/${label}.json`, JSON.stringify(res, null, 1));
console.log(label, res.ok, res.error ?? "", "families:", (res.families ?? []).join(" / "), "top sizes:", (res.type ?? []).slice(0, 4).map((r) => r.k.split("|").slice(0, 5).join(" ") + ` "${r.sample}"`).join(" ;; "), JSON.stringify(res.misc), "followers", res.cursorFollowers);
await b.close();
