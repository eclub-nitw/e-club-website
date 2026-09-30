// Usage: node scripts/parity-audit.mjs <slug> <url> [waitMs]  -> docs/handoff/parity/<slug>/ (screenshots + audit.json)
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
const [slug, url, wait = "4000"] = process.argv.slice(2);
const dir = `docs/handoff/parity/${slug}`;
mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ channel: "chrome" });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(Number(wait));

// try to click through an intro if there is an obvious control
const skip = p.locator("button, a").filter({ hasText: /^(enter|skip|start|explore|continue|get started|let'?s go)/i }).first();
if (await skip.count()) { await skip.click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(3000); }

// scroll fully to trigger lazy content and scroll-driven motion
let h = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 500) { await p.mouse.wheel(0, 500); await p.waitForTimeout(250); h = await p.evaluate(() => document.documentElement.scrollHeight); }
await p.waitForTimeout(1500);
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);

const info = await p.evaluate(() => {
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.height > 0 && r.width > 0; };
  // first container (depth-first) with at least 4 tall children = the page's section list
  const find = (e, d) => {
    const kids = [...e.children].filter((k) => vis(k) && !["SCRIPT", "STYLE", "NOSCRIPT"].includes(k.tagName));
    if (kids.filter((k) => k.getBoundingClientRect().height > 250).length >= 4) return e;
    if (d > 7) return null;
    for (const k of kids) { const f = find(k, d + 1); if (f) return f; }
    return null;
  };
  const fr = document.querySelector('[data-framer-name="hero"]'); // Framer: the hero's parent holds the section list
  const root = fr?.parentElement ?? find(document.body, 0) ?? document.body;
  const sy = window.scrollY;
  const blocks = [...root.children].filter((e) => vis(e) && !["SCRIPT", "STYLE", "NOSCRIPT"].includes(e.tagName)).map((e) => {
    const r = e.getBoundingClientRect();
    const heads = [...e.querySelectorAll("h1,h2,h3,h4")].map((x) => x.innerText.trim().replace(/\s+/g, " ")).filter(Boolean).slice(0, 8);
    return { tag: e.tagName.toLowerCase(), cls: (e.getAttribute("data-framer-name") ?? e.className?.toString() ?? "").slice(0, 60), top: Math.round(r.top + sy), height: Math.round(r.height), heads,
      text: e.innerText.trim().replace(/\s+/g, " ").slice(0, 160), imgs: e.querySelectorAll("img").length, links: e.querySelectorAll("a").length,
      buttons: [...e.querySelectorAll("button, a[class*=btn], a[class*=button]")].map((x) => x.innerText.trim()).filter(Boolean).slice(0, 5) };
  }).filter((x) => x.height > 120 && !/^(noise|bg)$/i.test(x.cls));
  const anims = document.getAnimations().map((a) => a.animationName || a.constructor.name).filter(Boolean);
  const fixed = [...document.querySelectorAll("*")].filter((e) => ["fixed", "sticky"].includes(getComputedStyle(e).position) && vis(e))
    .map((e) => `${getComputedStyle(e).position}:${e.tagName.toLowerCase()}.${(e.className?.toString() ?? "").slice(0, 40)} "${e.innerText?.trim().slice(0, 30).replace(/\s+/g, " ")}"`).slice(0, 10);
  const w = window;
  return {
    title: document.title, height: document.documentElement.scrollHeight,
    stack: { next: !!w.__NEXT_DATA__ || !!document.querySelector("script[src*=_next]"), angular: !!document.querySelector("[ng-version]"), framer: !!document.querySelector("[data-framer-name],[data-framer-component-type]") || /framer/i.test(document.documentElement.outerHTML.slice(0, 5000)),
      gsap: !!w.gsap, scrollTrigger: !!w.ScrollTrigger, lenis: !!w.lenis || document.documentElement.classList.contains("lenis"), locomotive: !!document.querySelector(".has-scroll-smooth"), three: !!w.THREE, swiper: !!document.querySelector(".swiper"), jquery: !!w.jQuery,
      canvas: document.querySelectorAll("canvas").length, video: document.querySelectorAll("video").length, svg: document.querySelectorAll("svg").length, images: document.images.length, customCursor: !!document.querySelector("[class*=cursor i]") },
    fonts: [...new Set([...document.querySelectorAll("h1,h2,h3,p,a,button")].map((e) => getComputedStyle(e).fontFamily.split(",")[0].replace(/"/g, "")))],
    runningAnimations: [...new Set(anims)].slice(0, 15), fixedOrSticky: fixed,
    nav: [...document.querySelectorAll("nav a, header a")].map((a) => a.innerText.trim()).filter(Boolean).slice(0, 14),
    footerText: document.querySelector("footer")?.innerText.trim().replace(/\s+/g, " ").slice(0, 300) ?? null,
    blocks,
  };
});

let n = 0;
for (const blk of info.blocks) {
  n++;
  const name = String(n).padStart(2, "0");
  blk.shot = `${name}.jpg`;
  await p.evaluate((y) => window.scrollTo(0, y), Math.max(0, blk.top - 60)); await p.waitForTimeout(700);
  await p.screenshot({ path: `${dir}/${name}.jpg`, type: "jpeg", quality: 60, fullPage: true, clip: { x: 0, y: blk.top, width: 1440, height: Math.min(blk.height, 1300) } });
}

// hover probe: does hovering the first few buttons/links change their look?
const hover = [];
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
for (const el of await p.locator("a:visible, button:visible").all().then((a) => a.slice(0, 8))) {
  const before = await el.evaluate((e) => { const s = getComputedStyle(e); return [s.backgroundColor, s.color, s.transform, s.borderColor, s.textDecorationLine].join("|"); });
  await el.hover({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(450);
  const after = await el.evaluate((e) => { const s = getComputedStyle(e); return [s.backgroundColor, s.color, s.transform, s.borderColor, s.textDecorationLine].join("|"); });
  hover.push({ text: (await el.innerText().catch(() => "")).trim().slice(0, 24), changes: before !== after });
}
info.hoverProbe = hover;
await p.screenshot({ path: `${dir}/00-top.jpg`, type: "jpeg", quality: 60 });
// mobile check
await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(1200);
await p.screenshot({ path: `${dir}/00-mobile-top.jpg`, type: "jpeg", quality: 60 });
writeFileSync(`${dir}/audit.json`, JSON.stringify(info, null, 1));
console.log(slug, "sections:", info.blocks.length, "height:", info.height);
await b.close();
