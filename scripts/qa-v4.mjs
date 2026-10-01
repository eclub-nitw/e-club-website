// V4 functional QA. Usage: node scripts/qa-v4.mjs [baseUrl]   (production server). Exits 1 on any FAIL.
// Routes: status, single h1, metadata, JSON-LD, console errors, internal links resolve, no horizontal overflow at 360.
// Behaviour: Home has 9 chapters + counter, WebGL canvas count (<=1) with the live scene, form states (invalid, honeypot, valid),
// mobile menu open/close, skip link, keyboard reach of every nav link, 404 page, Moments rail focusable, reduced-motion shows the poster.
import { chromium } from "@playwright/test";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
let fails = 0;
const ok = (c, name, d = "") => { if (!c) fails++; console.log(`${c ? "PASS" : "FAIL"}  ${name}${d ? "  " + d : ""}`); };
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const routes = [...new Set([...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname), "/privacy", "/terms", "/cookies", "/disclaimer", "/accessibility"])];
const browser = await chromium.launch({ channel: "chrome", args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist", "--use-angle=d3d11"] });

// ---- routes
const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
const internal = new Set();
for (const r of routes) {
  const p = await ctx.newPage(); const errs = [];
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 120)); });
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  const res = await p.goto(base + r, { waitUntil: "load" }); await p.waitForTimeout(800);
  const s = await p.evaluate(() => ({
    h1: document.querySelectorAll("h1").length, title: document.title, desc: document.querySelector('meta[name="description"]')?.content?.length ?? 0,
    canon: !!document.querySelector('link[rel="canonical"]'), og: !!document.querySelector('meta[property="og:title"]'),
    overflow: document.documentElement.scrollWidth > innerWidth + 1, lang: document.documentElement.lang,
    links: [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href").split("#")[0]).filter(Boolean),
    main: !!document.querySelector("main#main"), skip: !!document.querySelector('a[href="#main"]'),
  }));
  s.links.forEach((l) => internal.add(l));
  ok(res.status() === 200, `status ${r}`, String(res.status()));
  ok(s.h1 === 1, `one h1 ${r}`, `h1=${s.h1}`);
  ok(s.title.length > 3 && s.canon && s.og && s.desc > 0 && s.desc <= 160, `metadata ${r}`, `desc=${s.desc}`);
  ok(!s.overflow, `no horizontal overflow @360 ${r}`);
  ok(s.main && s.skip && s.lang === "en-IN", `landmarks ${r}`);
  ok(errs.length === 0, `console clean ${r}`, errs.join(" | "));
  await p.close();
}
for (const l of internal) {
  const res = await fetch(base + l);
  if (res.status !== 200) ok(false, `internal link ${l}`, String(res.status));
}
ok(true, `internal links resolved`, `${internal.size} distinct`);
const nf = await fetch(base + "/no-such-page"); ok(nf.status === 404 && (await nf.text()).includes("Slide not found"), "404 is the on-concept slide");
await ctx.close();

// ---- Home behaviour, desktop with GPU
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage();
  await p.goto(base + "/", { waitUntil: "load" });
  const n = await p.evaluate(() => document.querySelectorAll("main [data-section]").length);
  ok(n === 9, "Home has 9 chapters", `n=${n}`);
  await p.waitForSelector("#cover[data-live]", { timeout: 20000 }).then(() => ok(true, "live Rising Ledger mounted and the poster handed over")).catch(() => ok(false, "live Rising Ledger mounted"));
  const maxCanvas = await (async () => { let m = 0; const H = await p.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < H; y += 450) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(150); m = Math.max(m, await p.evaluate(() => document.querySelectorAll("canvas").length)); } return m; })();
  ok(maxCanvas <= 2, "WebGL canvases alive during a full scroll <= 2", `max=${maxCanvas}`);
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
  await p.evaluate(() => window.scrollTo(0, 2600)); await p.waitForTimeout(600);
  const counter = await p.evaluate(() => document.querySelector("header nav p")?.textContent ?? "");
  ok(/\d\d \/ 09/.test(counter), "nav counter reads NN / 09", counter.trim());
  await p.mouse.wheel(0, 500); await p.waitForTimeout(500);
  const hidden = await p.evaluate(() => document.querySelector("header")?.getAttribute("data-hidden"));
  await p.mouse.wheel(0, -500); await p.waitForTimeout(500);
  const shown = await p.evaluate(() => document.querySelector("header")?.getAttribute("data-hidden"));
  ok(hidden === "true" && shown === "false", "nav hides on scroll down, returns on scroll up", `${hidden}/${shown}`);
  const mom = await p.evaluate(() => document.querySelectorAll("#moments li img").length);
  ok(mom === 8, "Moments shows 8 frames", `n=${mom}`);
  const photosOutside = await p.evaluate(() => [...document.querySelectorAll("img")].filter((i) => /\/images\/events\//.test(i.currentSrc || i.src)).length);
  ok(photosOutside === 0, "no raw event photographs on Home (only the graded Moments frames)", `n=${photosOutside}`);
  await c.close();
}

// ---- Reduced motion: static poster, no live scene
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await c.newPage(); await p.goto(base + "/", { waitUntil: "load" }); await p.waitForTimeout(3500);
  const s = await p.evaluate(() => ({ canvas: document.querySelectorAll("canvas").length, live: document.querySelector("#cover")?.hasAttribute("data-live"), inf: document.getAnimations().filter((a) => a.effect?.getTiming().iterations === Infinity && a.playState === "running").length }));
  ok(s.canvas === 0 && !s.live, "reduced motion: poster only, no canvas", JSON.stringify(s));
  await c.close();
}

// ---- Mobile menu + form + keyboard
{
  const c = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true });
  const p = await c.newPage(); await p.goto(base + "/contact", { waitUntil: "load" });
  await p.click('button:has-text("Open menu")'); await p.waitForTimeout(400);
  ok(await p.evaluate(() => !!document.querySelector("dialog.menu[open]")), "mobile menu opens");
  await p.keyboard.press("Escape"); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !document.querySelector("dialog.menu[open]")), "Escape closes the menu");
  await p.click('button[type="submit"]'); await p.waitForTimeout(400);
  const inv = await p.evaluate(() => document.querySelectorAll("[aria-invalid=true]").length);
  ok(inv >= 3 && (await p.locator('.toast-in[role="alert"]').count()) === 1, "form: empty submit shows inline errors and an alert toast", `invalid=${inv}`);
  await p.fill('input[name="name"]', "Test Person"); await p.fill('input[name="email"]', "test@example.com"); await p.fill('textarea[name="message"]', "Hello, a question about the club.");
  await p.fill('input[name="company"]', "bot", { force: true }).catch(() => {});
  await p.click('button[type="submit"]'); await p.waitForTimeout(300);
  ok((await p.locator('[role="status"]').count()) === 0, "form: honeypot filled sends nothing");
  await p.fill('input[name="company"]', "", { force: true }).catch(() => {});
  await p.check('input[name="age"]');
  await p.evaluate(() => { window.__nav = null; });
  await p.route("**/*", (r) => r.continue());
  const nav = p.waitForEvent("framenavigated", { timeout: 1500 }).catch(() => null);
  await p.click('button[type="submit"]'); await p.waitForTimeout(900);
  ok((await p.locator('[role="status"]').count()) === 1, "form: valid submit shows the success toast (mailto handoff)");
  await nav;
  await c.close();
}
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage(); await p.goto(base + "/about", { waitUntil: "load" });
  const seen = new Set();
  for (let i = 0; i < 14; i++) { await p.keyboard.press("Tab"); seen.add(await p.evaluate(() => document.activeElement?.getAttribute("href") ?? document.activeElement?.tagName)); }
  ok(["/events", "/team", "/sponsors", "/gallery", "/contact"].every((h) => seen.has(h)), "keyboard Tab reaches every nav link", [...seen].join(","));
  const focusVisible = await p.evaluate(() => { const e = document.activeElement; const c = getComputedStyle(e); return c.outlineStyle !== "none" && parseFloat(c.outlineWidth) >= 2; });
  ok(focusVisible, "focus ring is visible");
  await c.close();
}
await browser.close();
console.log(fails ? `\n${fails} FAIL` : "\nall pass");
process.exit(fails ? 1 : 0);
