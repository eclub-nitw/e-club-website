// V5 functional QA. Usage: node scripts/qa-v5.mjs [baseUrl]   (production server). Exits 1 on any FAIL.
// Routes: status, single h1, metadata, console errors, internal links, no horizontal overflow at 360.
// Home: 9-12 chapters, counter, one WebGL canvas at a time, map phases, sapling rail, poster wall, nav hide/show.
// Policy: no raw event photograph outside /gallery, no phone numbers or WhatsApp links anywhere, nav = seven tabs + Register,
// floating pill wording by date (fake clock), pill hidden on /venture-vortex, reduced motion = poster only, forms, keyboard.
import { chromium } from "@playwright/test";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
let fails = 0;
const ok = (c, name, d = "") => { if (!c) fails++; console.log(`${c ? "PASS" : "FAIL"}  ${name}${d ? "  " + d : ""}`); };
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const routes = [...new Set([...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname), "/privacy", "/terms", "/cookies", "/disclaimer", "/accessibility"])];
const browser = await chromium.launch({ channel: "chrome", args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist", "--use-angle=d3d11"] });

// ---- routes
{
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
  for (const l of internal) { const res = await fetch(base + l); if (res.status !== 200) ok(false, `internal link ${l}`, String(res.status)); }
  ok(true, "internal links resolved", `${internal.size} distinct`);
  const nf = await fetch(base + "/no-such-page"); ok(nf.status === 404 && (await nf.text()).includes("Slide not found"), "404 is the on-concept slide");
  await ctx.close();
}

// ---- Home behaviour, desktop with GPU
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage();
  await p.goto(base + "/", { waitUntil: "load" });
  const n = await p.evaluate(() => document.querySelectorAll("main [data-section]").length);
  ok(n >= 9 && n <= 12, "Home has 9 to 12 numbered chapters", `n=${n}`);
  await p.waitForSelector("#hero[data-live]", { timeout: 20000 }).then(() => ok(true, "live Rising Ledger mounted and the poster handed over")).catch(() => ok(false, "live Rising Ledger mounted"));
  let maxCanvas = 0;
  { const H = await p.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < H; y += 450) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(260); maxCanvas = Math.max(maxCanvas, await p.evaluate(() => document.querySelectorAll("canvas").length)); } }
  ok(maxCanvas <= 1, "one WebGL canvas alive at a time during a full scroll", `max=${maxCanvas}`);
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
  await p.evaluate(() => window.scrollTo(0, 2600)); await p.waitForTimeout(600);
  const counter = await p.evaluate(() => document.querySelector("header nav p")?.textContent ?? "");
  ok(/\d\d \/ \d\d/.test(counter), "nav counter reads NN / NN", counter.trim());
  await p.mouse.wheel(0, 500); await p.waitForTimeout(500);
  const hidden = await p.evaluate(() => document.querySelector("header")?.getAttribute("data-hidden"));
  await p.mouse.wheel(0, -500); await p.waitForTimeout(500);
  const shown = await p.evaluate(() => document.querySelector("header")?.getAttribute("data-hidden"));
  ok(hidden === "true" && shown === "false", "nav hides on scroll down, returns on scroll up", `${hidden}/${shown}`);

  // map scene: phases advance with scroll, the pin only appears in the last phase
  await p.waitForTimeout(1800); // let Lenis finish the wheel scroll before jumping
  const box = await p.evaluate(() => { const r = document.querySelector("#reach .track").getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; });
  const phases = [];
  for (const f of [0.05, 0.3, 0.55, 0.95]) {
    await p.evaluate((y) => window.scrollTo(0, y), box.top + f * (box.h - 900)); await p.waitForTimeout(900);
    phases.push(await p.evaluate(() => ({ step: document.querySelector("#reach .track").dataset.step, pin: getComputedStyle(document.querySelector("#reach .map-pin")).opacity })));
  }
  ok(phases.map((x) => x.step).join() === "0,1,2,3", "map: phases 0,1,2,3 follow the scroll", phases.map((x) => x.step).join());
  ok(phases[0].pin === "0" && phases[3].pin === "1", "map: Warangal pin appears only in the last phase", `${phases[0].pin}/${phases[3].pin}`);
  const mapText = await p.evaluate(() => document.querySelector("#reach").textContent);
  ok(/24 Sept? .*9 Oct/.test(mapText) && /11.18 Oct/.test(mapText) && /30.31 Oct/.test(mapText) && /Warangal/.test(mapText), "map: phase labels carry the event.ts dates");

  // sapling rail: leaves unfurl with chapters, bud at the flagship chapter, tree at the last chapter
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
  const leaves0 = await p.evaluate(() => document.querySelectorAll('.vtree .leaf[data-on="true"]').length);
  const fy = await p.evaluate(() => document.getElementById("flagship").getBoundingClientRect().top + scrollY + 400);
  await p.evaluate((y) => window.scrollTo(0, y), fy); await p.waitForTimeout(900);
  const atFlagship = await p.evaluate(() => ({ leaves: document.querySelectorAll('.vtree .leaf[data-on="true"]').length, bud: document.querySelector(".vtree").dataset.bud }));
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(900);
  const atEnd = await p.evaluate(() => ({ leaves: document.querySelectorAll('.vtree .leaf[data-on="true"]').length, tree: document.querySelector(".vtree").dataset.tree }));
  ok(atFlagship.leaves > leaves0 && atFlagship.bud === "true" && atEnd.leaves >= atFlagship.leaves && atEnd.tree === "true", "sapling rail: leaves grow, bud at Flagship, tree at the last chapter", JSON.stringify({ leaves0, atFlagship, atEnd }));
  const posters = await p.evaluate(() => document.querySelectorAll("#posters img").length);
  ok(posters >= 1, "poster wall shows the club's posters", `n=${posters}`);
  await c.close();
}

// ---- Reduced motion: static poster, no live scene, map and numbers show their final state
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await c.newPage(); await p.goto(base + "/", { waitUntil: "load" }); await p.waitForTimeout(3500);
  const s = await p.evaluate(() => ({ canvas: document.querySelectorAll("canvas").length, live: document.querySelector("#hero")?.hasAttribute("data-live"), track: getComputedStyle(document.querySelector("#reach .track")).height, step: document.querySelector("#reach .track").dataset.step }));
  ok(s.canvas === 0 && !s.live, "reduced motion: poster only, no canvas", JSON.stringify(s));
  ok(s.step === "3" && parseFloat(s.track) < 1500, "reduced motion: map shows its final state, not pinned", `${s.step} ${s.track}`);
  await c.close();
}

// ---- nav is exactly: Home, About, Initiatives, Team, Sponsors, Gallery, Contact + Register
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage(); await p.goto(base + "/about", { waitUntil: "load" }); await p.waitForTimeout(800);
  const labels = await p.evaluate(() => [...document.querySelectorAll('nav[aria-label="Primary"] a')].map((a) => a.textContent.trim().replace(/\s+/g, " ").replace(/ on Unstop.*/, "")).filter(Boolean));
  ok(labels.slice(1).join("|") === "Home|About|Initiatives|Team|Sponsors|Gallery|Contact|Register", "nav items are the seven tabs plus the Register pill", labels.join("|"));
  await c.close();
}
// ---- floating pill follows the Unstop timeline (fake clock) and hides on /venture-vortex
for (const [iso, want] of [["2026-10-02T12:00:00+05:30", /Register on Unstop.*left to register/], ["2026-10-04T12:00:00+05:30", /Registration closed/], ["2026-10-10T12:00:00+05:30", /Round 1 closed/], ["2026-10-14T12:00:00+05:30", /Round 2 in progress/], ["2026-10-25T12:00:00+05:30", /Finale on campus, 30/], ["2026-10-30T12:00:00+05:30", /Finale on campus$/], ["2026-11-02T12:00:00+05:30", null]]) {
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage(); await p.clock.setFixedTime(new Date(iso)); await p.goto(base + "/about", { waitUntil: "load" }); await p.waitForTimeout(900);
  const t = await p.evaluate(() => document.querySelector(".pill-in")?.textContent.trim().replace(/\s+/g, " ") ?? null);
  ok(want ? want.test(t ?? "") : t === null, `pill on ${iso.slice(0, 10)}`, String(t));
  await c.close();
}
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage(); await p.goto(base + "/venture-vortex", { waitUntil: "load" }); await p.waitForTimeout(900);
  ok((await p.locator(".pill-in").count()) === 0, "pill hidden on /venture-vortex");
  await c.close();
}
// ---- policy: no raw event photograph outside /gallery; no phone numbers or WhatsApp links in any rendered page
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const photoBad = [], phoneBad = [];
  for (const r of routes) {
    const p = await c.newPage(); await p.goto(base + r, { waitUntil: "load" }); await p.waitForTimeout(500);
    const info = await p.evaluate(() => ({ imgs: [...document.querySelectorAll("img,source")].map((i) => i.currentSrc || i.src || i.srcset || "").filter((u) => /\/images\/(events|moments)\//.test(u)).length, html: document.documentElement.outerHTML.replace(/data:[^"')\s]+/g, "") }));
    if (r !== "/gallery" && info.imgs > 0) photoBad.push(r);
    if (/(\+91[\s-]?)?\b[6-9]\d{9}\b/.test(info.html.replace(/\d{10,}\.\d+/g, "")) || /chat\.whatsapp\.com|wa\.me/.test(info.html)) phoneBad.push(r);
    await p.close();
  }
  ok(photoBad.length === 0, "no raw event photograph outside /gallery", photoBad.join(","));
  ok(phoneBad.length === 0, "no phone numbers or WhatsApp links in any route", phoneBad.join(","));
  await c.close();
}

// ---- Mobile menu + form
{
  const c = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true });
  const p = await c.newPage(); await p.goto(base + "/contact", { waitUntil: "load" });
  await p.click('button:has-text("Open menu")'); await p.waitForTimeout(400);
  ok(await p.evaluate(() => !!document.querySelector("dialog.menu[open]")), "mobile menu opens");
  await p.keyboard.press("Escape"); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !document.querySelector("dialog.menu[open]")), "Escape closes the menu");
  const F = p.locator("form").first();
  await F.locator('button[type="submit"]').click(); await p.waitForTimeout(400);
  const inv = await p.evaluate(() => document.querySelectorAll("form:first-of-type [aria-invalid=true]").length);
  ok(inv >= 3 && (await p.locator('.toast-in[role="alert"]').count()) === 1, "form: empty submit shows inline errors and an alert toast", `invalid=${inv}`);
  await F.locator('input[name="name"]').fill("Test Person"); await F.locator('input[name="email"]').fill("test@example.com"); await F.locator('textarea[name="message"]').fill("Hello, a question about the club.");
  await F.locator('input[name="company"]').fill("bot", { force: true }).catch(() => {});
  await F.locator('button[type="submit"]').click(); await p.waitForTimeout(300);
  ok((await p.locator('[role="status"]').count()) === 0, "form: honeypot filled sends nothing");
  await F.locator('input[name="company"]').fill("", { force: true }).catch(() => {});
  await F.locator('input[name="age"]').check();
  const nav = p.waitForEvent("framenavigated", { timeout: 1500 }).catch(() => null);
  await F.locator('button[type="submit"]').click(); await p.waitForTimeout(900);
  ok((await p.locator('[role="status"]').count()) === 1, "form: valid submit shows the success toast (mailto handoff)");
  await nav;
  await c.close();
}
// ---- keyboard
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage(); await p.goto(base + "/about", { waitUntil: "load" });
  const seen = new Set();
  for (let i = 0; i < 16; i++) { await p.keyboard.press("Tab"); seen.add(await p.evaluate(() => document.activeElement?.getAttribute("href") ?? document.activeElement?.tagName)); }
  ok(["/about", "/initiatives", "/team", "/sponsors", "/gallery", "/contact"].every((h) => seen.has(h)), "keyboard Tab reaches every nav link", [...seen].join(","));
  const focusVisible = await p.evaluate(() => { const e = document.activeElement; const s = getComputedStyle(e); return s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2; });
  ok(focusVisible, "focus ring is visible");
  await c.close();
}
await browser.close();
console.log(fails ? `\n${fails} FAIL` : "\nall pass");
process.exit(fails ? 1 : 0);
