// V5 functional QA. Usage: node scripts/qa-v5.mjs [baseUrl]   (production server). Exits 1 on any FAIL.
// Routes: status, single h1, metadata, console errors, internal links, no horizontal overflow at 360.
// Home: 9-12 chapters, counter, at most two WebGL canvases, reach map timeline (V7), vine, poster wall, nav hide/show, no cursor elements.
// Policy (V7: event photographs only on /gallery, event pages and Home cover rows), no phone numbers or WhatsApp links anywhere, nav = seven tabs + Register,
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
  ok(maxCanvas <= 2, "at most two WebGL canvases exist (hero + vortex), loops paused off screen", `max=${maxCanvas}`);
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
  await p.evaluate(() => window.scrollTo(0, 2600)); await p.waitForTimeout(600);
  const counter = await p.evaluate(() => document.querySelector("header nav p")?.textContent ?? "");
  ok(/\d\d \/ \d\d/.test(counter), "nav counter reads NN / NN", counter.trim());
  await p.mouse.wheel(0, 500); await p.waitForTimeout(500);
  const hidden = await p.evaluate(() => document.querySelector("header")?.getAttribute("data-hidden"));
  await p.mouse.wheel(0, -500); await p.waitForTimeout(500);
  const shown = await p.evaluate(() => document.querySelector("header")?.getAttribute("data-hidden"));
  ok(hidden === "true" && shown === "false", "nav hides on scroll down, returns on scroll up", `${hidden}/${shown}`);

  // reach map (V7): the timeline itself is tested on a fresh page below; here only Replay
  await p.evaluate(() => document.getElementById("reach").scrollIntoView()); await p.waitForTimeout(800);
  await p.locator("#reach button:has-text('Replay')").click(); await p.waitForTimeout(300);
  ok(await p.evaluate(() => getComputedStyle(document.querySelector("#reach .reach-pin")).opacity === "0" || document.querySelector("#reach .reach").dataset.play === "run"), "map: Replay restarts the sequence");
  const mapText = await p.evaluate(() => document.querySelector("#reach").textContent);
  ok(/24 Sept? .*9 Oct/.test(mapText) && /11.18 Oct/.test(mapText) && /30.31 Oct/.test(mapText) && /Warangal/.test(mapText), "map: ledger carries the event.ts dates");
  const mapBox = await p.evaluate(() => { const r = document.querySelector("#reach [data-content]").getBoundingClientRect(); const c = document.querySelector("#reach .reach").getBoundingClientRect(); return { w: r.width, cw: c.width }; });
  ok(mapBox.w / mapBox.cw >= 0.5, "map: fills more than half of the content width on desktop", `${Math.round(mapBox.w)}/${Math.round(mapBox.cw)}`);

  // vine (V7): fixed at the top-left corner on wide screens, bud swells at the flagship chapter
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
  const vine0 = await p.evaluate(() => { const v = document.querySelector(".vine"); const r = v?.getBoundingClientRect(); return v ? { display: getComputedStyle(v).display, left: r.left, top: r.top, pe: getComputedStyle(v).pointerEvents, aria: v.getAttribute("aria-hidden") } : null; });
  const fy = await p.evaluate(() => document.getElementById("flagship").getBoundingClientRect().top + scrollY + 400);
  await p.evaluate((y) => window.scrollTo(0, y), fy); await p.waitForTimeout(900);
  const bud = await p.evaluate(() => document.querySelector(".vine").dataset.bud);
  ok(vine0 && vine0.display !== "none" && vine0.left === 0 && vine0.top === 0 && vine0.pe === "none" && vine0.aria === "true" && bud === "true" && (await p.locator(".vtree").count()) === 0, "vine: hangs from the top-left corner, decorative, bud swells at the flagship chapter; the sapling rail is gone", JSON.stringify({ vine0, bud }));
  ok((await p.evaluate(() => document.querySelectorAll("[data-cursor], .cursor-label").length)) === 0, "no custom cursor elements");
  const posters = await p.evaluate(() => document.querySelectorAll("#posters img").length);
  ok(posters >= 1, "poster wall shows the club's posters", `n=${posters}`);
  await c.close();
}

// ---- Reach map timeline on a fresh page: idle until seen, plays once on enter, the pin lands at about 4 s, nothing is pinned
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage(); await p.goto(base + "/", { waitUntil: "load" }); await p.waitForTimeout(1200);
  const before = await p.evaluate(() => document.querySelector("#reach .reach").dataset.play);
  await p.evaluate(() => { document.getElementById("reach").scrollIntoView(); }); await p.waitForTimeout(700);
  const during = await p.evaluate(() => ({ play: document.querySelector("#reach .reach").dataset.play, pin: getComputedStyle(document.querySelector("#reach .reach-pin")).opacity }));
  await p.waitForTimeout(4600);
  const after = await p.evaluate(() => ({ pin: getComputedStyle(document.querySelector("#reach .reach-pin")).opacity, tracks: document.querySelectorAll("#reach .track").length }));
  ok(before === "idle" && during.play === "run" && during.pin === "0" && after.pin === "1" && after.tracks === 0, "map: idle until seen, plays once on enter, Warangal pin lands at the end, no pinned track", JSON.stringify({ before, during, after }));
  await c.close();
}

// ---- Reduced motion: static poster, no live scene, map and numbers show their final state
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await c.newPage(); await p.goto(base + "/", { waitUntil: "load" }); await p.waitForTimeout(3500);
  const s = await p.evaluate(() => ({ canvas: document.querySelectorAll("canvas").length, live: document.querySelector("#hero")?.hasAttribute("data-live"), play: document.querySelector("#reach .reach").dataset.play, pin: getComputedStyle(document.querySelector("#reach .reach-pin")).opacity, replay: document.querySelector("#reach .reach button").hidden }));
  ok(s.canvas === 0 && !s.live, "reduced motion: poster only, no canvas", JSON.stringify(s));
  ok(s.play === "done" && s.pin === "1" && s.replay, "reduced motion: map shows its final state, no Replay button", JSON.stringify(s));
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
// ---- policy (V7): event photographs only on /gallery, event pages and the Home cover rows (owner decision, V5 rule relaxed); never elsewhere; no phone numbers or WhatsApp links
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const photoBad = [], phoneBad = [];
  for (const r of routes) {
    const p = await c.newPage(); await p.goto(base + r, { waitUntil: "load" }); await p.waitForTimeout(500);
    const info = await p.evaluate(() => ({ imgs: [...document.querySelectorAll("img,source")].map((i) => i.currentSrc || i.src || i.srcset || "").filter((u) => /\/images\/(events|moments)\//.test(u)).length, html: document.documentElement.outerHTML.replace(/data:[^"')\s]+/g, "") }));
    if (!(r === "/" || r === "/gallery" || r.startsWith("/initiatives")) && info.imgs > 0) photoBad.push(r);
    if (/(\+91[\s-]?)?\b[6-9]\d{9}\b/.test(info.html.replace(/\d{10,}\.\d+/g, "")) || /chat\.whatsapp\.com|wa\.me/.test(info.html)) phoneBad.push(r);
    await p.close();
  }
  ok(photoBad.length === 0, "event photographs appear only on /, /gallery and /initiatives/*", photoBad.join(","));
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
  const F = p.locator("form");
  ok((await p.locator('[role="tab"]').count()) === 4 && (await F.locator('input[type="checkbox"]').count()) === 0, "contact: four tabs, and no age checkbox");
  await F.locator('button[type="submit"]').click(); await p.waitForTimeout(400);
  const inv = await p.evaluate(() => document.querySelectorAll("form [aria-invalid=true]").length);
  ok(inv >= 3 && (await p.locator('.toast-in[role="alert"]').count()) === 1, "form: empty submit shows inline errors and an alert toast", `invalid=${inv}`);
  await F.locator('input[name="name"]').fill("Test Person"); await F.locator('input[name="email"]').fill("test@example.com"); await F.locator('textarea[name="message"]').fill("Hello, a question about the club.");
  await F.locator('input[name="company"]').fill("bot", { force: true }).catch(() => {});
  await F.locator('button[type="submit"]').click(); await p.waitForTimeout(300);
  ok((await p.locator('.toast-in[role="status"]').count()) === 0, "form: honeypot filled sends nothing");
  await F.locator('input[name="company"]').fill("", { force: true }).catch(() => {});
  const nav = p.waitForEvent("framenavigated", { timeout: 1500 }).catch(() => null);
  await F.locator('button[type="submit"]').click(); await p.waitForTimeout(900);
  ok((await p.locator('.toast-in[role="status"]').count()) === 1, "form: valid submit shows the success toast (mailto handoff)");
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
