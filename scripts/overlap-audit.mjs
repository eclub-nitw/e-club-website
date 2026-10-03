// V7 overlap audit. Usage: node scripts/overlap-audit.mjs [route,route] [width,width]   (production server on :3100, or BASE_URL)
// For each route and width: every line box of visible text and every <img>/<svg>/<canvas> inside <main> sections; a pair that intersects by more
// than 2px in both axes is a failure. Excused: anything inside [data-overlap-ok] or [aria-hidden=true] (decorative backdrops, ghost words, stacked states).
import { launch, routes as sitemapRoutes, settle, base, WIDTHS } from "./_v7.mjs";

const only = process.argv[2]?.split(",").filter(Boolean);
const widths = process.argv[3]?.split(",").map(Number) ?? WIDTHS;
const browser = await launch();
let fails = 0;
const rows = [];

for (const r of only ?? await sitemapRoutes()) {
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 740 : 900 } });
    const p = await ctx.newPage();
    await p.goto(base + r, { waitUntil: "load" });
    await settle(p);
    const found = await p.evaluate(() => {
      const label = (el) => (el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : "")).slice(0, 40);
      const hostOf = (el) => el.closest("section, main > div, main > header") ?? document.querySelector("main");
      const items = [];
      const add = (el, rect, text) => {
        if (rect.width < 1 || rect.height < 1) return;
        if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return;
        if (el.closest("[data-overlap-ok], [aria-hidden=true]")) return; // decorative backdrops and ghost words carry no information
        const host = hostOf(el);
        items.push({ host, el, text, x: rect.left + scrollX, y: rect.top + scrollY, r: rect.right + scrollX, b: rect.bottom + scrollY });
      };
      const main = document.querySelector("main");
      if (!main) return [];
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!n.nodeValue.trim() || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentElement.tagName) || n.parentElement.closest("details:not([open]) > :not(summary)")) continue;
        const range = document.createRange(); range.selectNodeContents(n);
        if (n.parentElement.closest(".sr-only")) continue;
        for (const rc of range.getClientRects()) {
          const k = rc.height * 0.15; // the font box is taller than the glyphs; compare the inked middle so tight line-heights do not count
          add(n.parentElement, { left: rc.left, right: rc.right, top: rc.top + k, bottom: rc.bottom - k, width: rc.width, height: rc.height - 2 * k }, n.nodeValue.trim().slice(0, 28));
        }
      }
      for (const el of main.querySelectorAll("img, svg, canvas, video")) { if (!el.closest("svg:not(:scope)") || el.tagName === "svg") add(el, el.getBoundingClientRect(), `<${el.tagName.toLowerCase()}>`); }
      const out = [];
      for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
        const a = items[i], c = items[j];
        if (a.host !== c.host || a.el === c.el || a.el.contains(c.el) && a.text.startsWith("<") || c.el.contains(a.el) && c.text.startsWith("<") && false) continue;
        const ix = Math.min(a.r, c.r) - Math.max(a.x, c.x), iy = Math.min(a.b, c.b) - Math.max(a.y, c.y);
        if (ix > 2 && iy > 2) out.push(`${label(a.host)} :: "${a.text}" (${label(a.el)}) x "${c.text}" (${label(c.el)}) ${Math.round(ix)}x${Math.round(iy)}px @y=${Math.round(Math.max(a.y, c.y))}`);
      }
      return out;
    });
    const uniq = [...new Set(found)];
    fails += uniq.length ? 1 : 0;
    rows.push({ route: r, width: w, overlaps: uniq.length, first: uniq.slice(0, 6) });
    await ctx.close();
  }
}
await browser.close();
for (const x of rows) console.log(`${x.overlaps ? "FAIL" : "PASS"}  ${x.route} @${x.width}  overlaps=${x.overlaps}`);
for (const x of rows.filter((y) => y.overlaps)) { console.log(`\n${x.route} @${x.width}`); x.first.forEach((l) => console.log("  " + l)); }
console.log(`\n${fails} route/width combinations with overlaps`);
process.exit(fails ? 1 : 0);
