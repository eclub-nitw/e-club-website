// Usage: node scripts/qa.mjs [baseUrl] [section]   (section: reduced | reload | teardown | keyboard | touch | wrap | v3 | all)
// Runs against a production server (`next start`). Prints PASS/FAIL lines and a JSON summary; exits 1 on any FAIL.
import { chromium } from "@playwright/test";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const only = process.argv[3] ?? "all";
const want = (s) => only === "all" || only === s;
const results = [];
const check = (name, ok, detail = "") => { results.push({ name, ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  " + detail : ""}`); };

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const routes = [...new Set([...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname), "/privacy", "/terms", "/cookies", "/disclaimer", "/accessibility"])];
console.log(`routes (${routes.length}): ${routes.join(" ")}`);

const browser = await chromium.launch({ channel: "chrome", args: ["--enable-precise-memory-info", "--js-flags=--expose-gc"] });
const watch = (page, bag) => {
  page.on("console", (m) => { if (m.type() === "error") bag.push(m.text()); });
  page.on("pageerror", (e) => bag.push(String(e)));
};

if (want("reduced")) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  for (const r of routes) {
    const p = await ctx.newPage(); const errs = []; watch(p, errs);
    const res = await p.goto(base + r, { waitUntil: "load" });
    await p.waitForTimeout(1500);
    const s = await p.evaluate(() => ({
      h1: document.querySelectorAll("h1").length,
      running: document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getTiming().iterations === Infinity).length,
      canvas: document.querySelectorAll("canvas").length,
      lenis: document.documentElement.classList.contains("lenis"),
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    check(`reduced-motion ${r}`, res.status() === 200 && s.h1 === 1 && s.running === 0 && s.canvas === 0 && !s.lenis && !s.overflow && errs.length === 0,
      `status ${res.status()} h1 ${s.h1} infiniteAnims ${s.running} canvas ${s.canvas} lenis ${s.lenis} overflow ${s.overflow} errors ${errs.length}${errs[0] ? " " + errs[0].slice(0, 100) : ""}`);
    await p.close();
  }
  await ctx.close();
}

if (want("reload")) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  for (const r of routes) {
    const p = await ctx.newPage(); const errs = []; watch(p, errs);
    await p.goto(base + r, { waitUntil: "load" });
    await p.waitForTimeout(800);
    await p.evaluate(() => window.scrollTo(0, 700)); await p.waitForTimeout(300);
    await p.reload({ waitUntil: "load" }); await p.waitForTimeout(800);
    const h1a = await p.locator("h1").count();
    // history: go to another route, back, forward
    const other = routes.find((x) => x !== r);
    await p.goto(base + other, { waitUntil: "load" }); await p.waitForTimeout(400);
    await p.goBack({ waitUntil: "load" }); await p.waitForTimeout(600);
    const backOk = new URL(p.url()).pathname === r && (await p.locator("h1").count()) === 1;
    await p.goForward({ waitUntil: "load" }); await p.waitForTimeout(600);
    const fwdOk = new URL(p.url()).pathname === other && (await p.locator("h1").count()) === 1;
    check(`reload+back/forward ${r}`, h1a === 1 && backOk && fwdOk && errs.length === 0, `h1AfterReload ${h1a} back ${backOk} forward ${fwdOk} errors ${errs.length}${errs[0] ? " " + errs[0].slice(0, 100) : ""}`);
    await p.close();
  }
  await ctx.close();
}

if (want("teardown")) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); const errs = []; watch(p, errs);
  const cdp = await ctx.newCDPSession(p);
  await p.goto(base + "/", { waitUntil: "load" }); await p.waitForTimeout(3000);
  const snap = async () => {
    await cdp.send("HeapProfiler.collectGarbage"); await cdp.send("HeapProfiler.collectGarbage");
    const heap = await p.evaluate(() => performance.memory.usedJSHeapSize);
    const { result } = await cdp.send("Runtime.evaluate", { expression: "window" });
    const { listeners } = await cdp.send("DOMDebugger.getEventListeners", { objectId: result.objectId });
    const count = (t) => listeners.filter((l) => l.type === t).length;
    const dom = await p.evaluate(() => ({ pin: document.querySelectorAll(".pin-spacer").length, canvas: document.querySelectorAll("canvas").length, nodes: document.getElementsByTagName("*").length, lenis: document.documentElement.classList.contains("lenis") }));
    return { heapMB: +(heap / 1048576).toFixed(2), wheel: count("wheel"), scroll: count("scroll"), resize: count("resize"), ...dom };
  };
  const cycle = ["/about", "/events", "/", "/team", "/gallery", "/", "/sponsors", "/events", "/contact", "/"];
  const NAVS = Number(process.env.TEARDOWN_NAVS ?? 10);
  const seq = Array.from({ length: NAVS }, (_, i) => cycle[i % cycle.length]);
  const first = await snap();
  const rows = [first];
  for (let i = 0; i < seq.length; i++) {
    const link = p.locator(`header a[href="${seq[i]}"], nav[aria-label="Primary (compact)"] a[href="${seq[i]}"]`).first();
    const target = seq[i];
    if (await link.isVisible().catch(() => false)) await link.click(); else await p.evaluate((h) => { document.querySelector(`a[href="${h}"]`)?.click(); }, target);
    await p.waitForTimeout(1500);
    await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(500);
    rows.push(await snap());
  }
  const last = rows[rows.length - 1];
  console.log("teardown snapshots (heapMB wheel scroll resize pin canvas nodes lenis):");
  rows.forEach((r, i) => console.log(`  #${i} ${r.heapMB} ${r.wheel} ${r.scroll} ${r.resize} ${r.pin} ${r.canvas} ${r.nodes} ${r.lenis}`));
  // compare like with like: first vs last visit of the same route (Home legitimately has more listeners than /about)
  const byRoute = {}; seq.forEach((r, i) => (byRoute[r] ??= []).push(rows[i + 1]));
  // baseline = second visit: the first visit to Home loads ScrollTrigger, which registers its global listeners once
  const drift = Object.entries(byRoute).filter(([, v]) => v.length > 2).map(([r, v]) => ({ r, a: v[1], b: v[v.length - 1] }));
  check("teardown: listener counts on a route are unchanged on later visits", drift.every(({ a, b }) => b.wheel <= a.wheel && b.scroll <= a.scroll && b.resize <= a.resize),
    drift.map(({ r, a, b }) => `${r} wheel ${a.wheel}->${b.wheel} scroll ${a.scroll}->${b.scroll} resize ${a.resize}->${b.resize}`).join("; "));
  const early = rows[1];
  const leftovers = seq.map((r, i) => ({ r, s: rows[i + 1] })).filter(({ r, s }) => r !== "/" && (s.pin > 0 || s.canvas > 0));
  check("teardown: no pin spacer or canvas survives on any non-Home page (scenes disposed on route change)", leftovers.length === 0, leftovers.length ? leftovers.map((l) => `${l.r}: pin ${l.s.pin} canvas ${l.s.canvas}`).join("; ") : `${seq.filter((r) => r !== "/").length} non-Home visits checked`);
  // heap: compare the middle and last thirds of the run (warm-up excluded); a plateau means no leak per navigation
  const third = Math.floor(rows.length / 3), avg = (xs) => xs.reduce((a, r) => a + r.heapMB, 0) / xs.length;
  const mid = avg(rows.slice(third, 2 * third)), end = avg(rows.slice(2 * third));
  check(`teardown: heap plateaus over ${seq.length} navigations (last third within 15% of middle third)`, end <= mid * 1.15, `first ${early.heapMB} MB, middle third avg ${mid.toFixed(2)}, last third avg ${end.toFixed(2)}, last ${last.heapMB} MB`);
  check("teardown: no console errors", errs.length === 0, errs[0]?.slice(0, 100));
  await ctx.close();
}

if (want("keyboard")) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + "/", { waitUntil: "load" }); await p.waitForTimeout(1200);
  const stops = [];
  for (let i = 0; i < 12; i++) {
    await p.keyboard.press("Tab");
    stops.push(await p.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return { t: (e.innerText || e.getAttribute("aria-label") || e.tagName).trim().slice(0, 24), outline: parseFloat(cs.outlineWidth) > 0 && cs.outlineStyle !== "none" }; }));
  }
  console.log("  tab order:", stops.map((s) => s.t).join(" > "));
  check("keyboard: first stop is the skip link", /skip to content/i.test(stops[0].t), stops[0].t);
  check("keyboard: every stop shows a focus outline", stops.every((s) => s.outline), stops.filter((s) => !s.outline).map((s) => s.t).join(","));
  await ctx.close();

  const m = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const q = await m.newPage();
  await q.goto(base + "/", { waitUntil: "load" }); await q.waitForTimeout(1000);
  const btn = q.locator("button:has-text('Open menu'):visible").first();
  await btn.focus(); await q.keyboard.press("Enter"); await q.waitForTimeout(500);
  const open = await q.evaluate(() => !!document.querySelector("dialog[open]"));
  let inside = true;
  // A native modal dialog makes the page inert; Tab past its last control moves to browser UI (activeElement = body). Page content must never take focus.
  for (let i = 0; i < 16; i++) { await q.keyboard.press("Tab"); inside &&= await q.evaluate(() => document.activeElement === document.body || !!document.activeElement?.closest("dialog[open]")); }
  await q.keyboard.press("Escape"); await q.waitForTimeout(300);
  const closed = await q.evaluate(() => !document.querySelector("dialog[open]"));
  const back = await q.evaluate(() => document.activeElement?.textContent?.includes("Open menu") ?? false);
  check("keyboard: menu opens with Enter", open);
  check("keyboard: no page element outside the menu takes focus over 16 Tabs", inside);
  check("keyboard: Esc closes the menu", closed);
  check("keyboard: focus returns to the menu button", back);
  await m.close();
}

if (want("touch")) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1" });
  for (const r of ["/", "/events", "/about"]) {
    const p = await ctx.newPage(); const errs = []; watch(p, errs);
    await p.goto(base + r, { waitUntil: "load" }); await p.waitForTimeout(3000);
    const s = await p.evaluate(() => ({ lenis: document.documentElement.classList.contains("lenis"), overflow: document.documentElement.scrollWidth > innerWidth, cursor: [...document.querySelectorAll("div")].some((d) => d.className.includes("border-accent") && d.className.includes("rounded-full") && getComputedStyle(d).opacity === "1") }));
    check(`touch ${r}: no Lenis, no cursor ring, no overflow, no errors`, !s.lenis && !s.cursor && !s.overflow && errs.length === 0, JSON.stringify(s));
    if (r === "/") {
      await p.tap("button:has-text('Open menu'):visible"); await p.waitForTimeout(600);
      check("touch: menu opens by tap", await p.evaluate(() => !!document.querySelector("dialog[open]")));
    }
    await p.close();
  }
  await ctx.close();
}

if (want("wrap")) {
  for (const w of [360, 390, 768]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(base + "/", { waitUntil: "load" }); await p.waitForTimeout(1200);
    const measure = () => p.evaluate(() => {
      const oneLine = (sel) => [...document.querySelectorAll(sel)].filter((e) => e.getBoundingClientRect().width > 0).map((e) => Math.round(e.getBoundingClientRect().height));
      return { wordmark: oneLine('a[aria-label="E-Club NITW, home"]'), flagship: oneLine('a[href="/events/venture-vortex-2026"].bg-accent'), partner: oneLine("footer a[href='/sponsors']"), footerBrand: oneLine("footer p.font-display") };
    });
    const top = await measure();
    await p.evaluate(() => window.scrollTo(0, 1500)); await p.waitForTimeout(700);
    const scrolled = await measure();
    const all = [...top.wordmark, ...top.flagship, ...top.partner, ...scrolled.wordmark, ...scrolled.flagship];
    check(`no wrap of wordmark, flagship button, footer link at ${w}px`, all.every((h) => h <= 48), `heights ${JSON.stringify({ top, scrolled })}`);
    await ctx.close();
  }
}

// ---- V3: scenes, fallbacks, gallery, overflow at three widths ----
if (want("v3")) {
  // Desktop: the Dive goes live, never more than two WebGL canvases exist, hero image is the graded photo.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage(); const errs = []; watch(p, errs);
    await p.goto(base + "/", { waitUntil: "load" }); await p.waitForTimeout(3000);
    let maxCanvas = 0;
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let i = 0; i <= 20; i++) {
      await p.evaluate(([y]) => window.scrollTo(0, y), [((H - 900) * i) / 20]); await p.waitForTimeout(350);
      maxCanvas = Math.max(maxCanvas, await p.evaluate(() => document.querySelectorAll("canvas").length));
    }
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
    const d = await p.evaluate(() => { const dive = document.querySelector("#dive"); return { fallback: dive?.hasAttribute("data-fallback"), stackShown: getComputedStyle(document.querySelector(".dive-stack")).display !== "none", liveShown: getComputedStyle(document.querySelector(".dive-live")).display !== "none", heroSrc: document.querySelector("section img[fetchpriority=high]")?.currentSrc ?? "" }; });
    check("v3 desktop: Dive live shell shown, stack hidden", d.liveShown && !d.stackShown && !d.fallback, JSON.stringify(d));
    check("v3 desktop: at most 2 WebGL canvases alive during a full scroll", maxCanvas <= 2, `max ${maxCanvas}`);
    check("v3 desktop: hero image is the pre-graded photograph", /hero-(1600|1024)\.(avif|webp)/.test(d.heroSrc), d.heroSrc);
    check("v3 desktop: no console errors", errs.length === 0, errs[0] ?? "");
    await ctx.close();
  }
  // Touch: stack only, no canvas at all on the whole page until the portal is near, images lazy.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage(); const errs = []; watch(p, errs);
    await p.goto(base + "/", { waitUntil: "load" }); await p.waitForTimeout(2000);
    const d = await p.evaluate(() => ({ stackShown: getComputedStyle(document.querySelector(".dive-stack")).display !== "none", liveShown: getComputedStyle(document.querySelector(".dive-live")).display !== "none", canvas: document.querySelectorAll("canvas").length, stackImgs: document.querySelectorAll(".dive-stack img").length }));
    check("v3 touch: Dive renders the stack, no live shell, no canvas", d.stackShown && !d.liveShown && d.canvas === 0, JSON.stringify(d));
    check("v3 touch: no console errors", errs.length === 0, errs[0] ?? "");
    await ctx.close();
  }
  // Save-Data on a desktop: the capability test refuses WebGL and the stack takes over.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true } }));
    const p = await ctx.newPage();
    await p.goto(base + "/", { waitUntil: "load" }); await p.waitForTimeout(2500);
    const d = await p.evaluate(() => ({ fallback: document.querySelector("#dive")?.hasAttribute("data-fallback"), canvas: document.querySelectorAll("canvas").length, lit: !!document.querySelector(".mega-lit.is-lit") }));
    check("v3 save-data: fallback stack, no canvas, no extra hero image in the letters", d.fallback === true && d.canvas === 0 && d.lit === false, JSON.stringify(d));
    await ctx.close();
  }
  // Gallery lightbox: click opens, arrows step, Esc closes and focus returns to the trigger.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage(); const errs = []; watch(p, errs);
    await p.goto(base + "/gallery", { waitUntil: "load" }); await p.waitForTimeout(800);
    const first = p.locator("#club-event-01 ul button").first();
    await first.focus(); await p.keyboard.press("Enter"); await p.waitForTimeout(300);
    const open = await p.evaluate(() => document.querySelector("dialog[open]") !== null);
    const c0 = await p.locator("dialog[open] figcaption span").first().innerText();
    await p.keyboard.press("ArrowRight"); await p.waitForTimeout(200);
    const c1 = await p.locator("dialog[open] figcaption span").first().innerText();
    await p.keyboard.press("Escape"); await p.waitForTimeout(300);
    const closed = await p.evaluate(() => document.querySelector("dialog[open]") === null);
    const back = await p.evaluate(() => document.activeElement?.closest("#club-event-01") !== null);
    check("v3 gallery: lightbox opens with Enter, ArrowRight steps, Esc closes, focus returns", open && c0 !== c1 && closed && back, `open ${open} "${c0}" -> "${c1}" closed ${closed} focusBack ${back}`);
    check("v3 gallery: no console errors", errs.length === 0, errs[0] ?? "");
    await ctx.close();
  }
  // No horizontal overflow on any route at 360 / 768 / 1440.
  for (const w of [360, 768, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, hasTouch: w < 500, isMobile: w < 500 });
    const bad = [];
    for (const r of routes) {
      const p = await ctx.newPage(); await p.goto(base + r, { waitUntil: "load" }); await p.waitForTimeout(700);
      const o = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      if (o) bad.push(r);
      await p.close();
    }
    check(`v3 no horizontal overflow at ${w}px on any route`, bad.length === 0, bad.join(" "));
    await ctx.close();
  }
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
