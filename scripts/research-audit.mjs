// Real-browser audit of reference sites. Usage: node scripts/research-audit.mjs <url> <label>
// Records: generator hints, fonts in use, sampled palette, network weight by type, scroll-linked hints, screenshots at 5 scroll points.
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const [url, label] = process.argv.slice(2);
const OUT = "docs/handoff/v3/research"; await mkdir(OUT, { recursive: true });
const b = await chromium.launch({ channel: "chrome" }); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage(); const bytes = {}; let total = 0; const hosts = new Set();
p.on("response", async (r) => { try { const t = (r.headers()["content-type"] || "other").split(";")[0].split("/").pop(); const n = +(r.headers()["content-length"] || 0); bytes[t] = (bytes[t] || 0) + n; total += n; hosts.add(new URL(r.url()).host); } catch {} });
const res = { label, url, ok: false };
try {
  await p.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 }); await p.waitForTimeout(6000);
  res.title = await p.title(); res.ok = true;
  res.info = await p.evaluate(() => {
    const g = (s) => document.querySelector(s)?.getAttribute("content");
    const cs = (el) => el ? getComputedStyle(el) : null;
    const h1 = document.querySelector("h1"), body = document.body;
    const fonts = [...document.fonts].filter(f => f.status === "loaded").map(f => f.family.replace(/"/g, "") + " " + f.weight);
    const srcs = [...document.scripts].map(s => s.src).filter(Boolean);
    const stack = [window.__NEXT_DATA__ && "Next.js", document.querySelector("[data-wf-site]") && "Webflow", window.Webflow && "Webflow", window.__NUXT__ && "Nuxt", window.gsap && "GSAP", window.THREE && "three(global)", window.ScrollTrigger && "ScrollTrigger", window.Lenis && "Lenis", window.__framer_events && "Framer", document.querySelector("canvas") && "canvas", document.querySelector("video") && "video", document.querySelector("#__next") && "next-root", (g("generator") || "") ].filter(Boolean);
    const big = [...document.querySelectorAll("h1,h2,h3,[class*=hero],[class*=title]")].slice(0, 8).map(e => ({ t: (e.textContent || "").trim().slice(0, 40), fs: cs(e).fontSize, fw: cs(e).fontWeight, ff: cs(e).fontFamily.split(",")[0], tt: cs(e).textTransform, ls: cs(e).letterSpacing }));
    return { generator: g("generator"), stack, fonts: [...new Set(fonts)].slice(0, 12), bodyFont: cs(body).fontFamily.split(",")[0], bodyBg: cs(body).backgroundColor, bodyColor: cs(body).color, h1: h1 ? { fs: cs(h1).fontSize, fw: cs(h1).fontWeight, ff: cs(h1).fontFamily.split(",")[0], tt: cs(h1).textTransform } : null, big, canvases: document.querySelectorAll("canvas").length, videos: document.querySelectorAll("video").length, imgs: document.images.length, scripts: srcs.length, cursorCustom: getComputedStyle(body).cursor, docHeight: document.documentElement.scrollHeight, sticky: [...document.querySelectorAll("*")].filter(e => getComputedStyle(e).position === "sticky").length };
  });
  const H = res.info.docHeight; const pts = [0, .2, .4, .6, .8];
  for (let i = 0; i < pts.length; i++) { await p.evaluate((y) => window.scrollTo(0, y), Math.min(H - 900, H * pts[i])); await p.waitForTimeout(1800); await p.screenshot({ path: `${OUT}/${label}-${i}.png` }); }
  const shot = await p.screenshot(); const { dominant } = await sharp(shot).stats(); res.dominantRGB = [dominant.r, dominant.g, dominant.b];
  const { data } = await sharp(shot).resize(8, 5, { fit: "fill" }).raw().toBuffer({ resolveWithObject: true });
  res.palette = [...new Set(Array.from({ length: 12 }, (_, i) => "#" + [0, 1, 2].map(c => data[(i * 3 + c) * 3 % data.length].toString(16).padStart(2, "0")).join("")))];
} catch (e) { res.error = e.message.slice(0, 120); }
res.network = { totalMB: +(total / 1e6).toFixed(2), byType: Object.fromEntries(Object.entries(bytes).map(([k, v]) => [k, +(v / 1e6).toFixed(2)]).sort((a, b) => b[1] - a[1]).slice(0, 6)), hosts: hosts.size };
await writeFile(`${OUT}/${label}.json`, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res));
await b.close();
