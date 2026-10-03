// V7 gap audit. Usage: node scripts/gap-audit.mjs [route,route] [width,width]   (production server on :3100, or BASE_URL)
// Content box = a text line, <img>/<svg>/<canvas>/<video>, or an element with a hairline border. For each top-level section of <main>:
//   gap  = distance from the previous section's last content box to this section's first content box (fail > 160px at >=1024, > 96px below);
//   blank = share of the section's height that no content box covers (interior bands taller than 64px, plus any top/bottom margin beyond 96px); fail > 35%.
// A section marked [data-gap-ok] (the pinned vortex dive, whose height is its scroll runway) is reported but not failed.
import { launch, routes as sitemapRoutes, settle, base, WIDTHS } from "./_v7.mjs";

const only = process.argv[2]?.split(",").filter(Boolean);
const widths = process.argv[3]?.split(",").map(Number) ?? WIDTHS;
const browser = await launch();
let fails = 0;
const lines = [];

for (const r of only ?? await sitemapRoutes()) {
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 740 : 900 } });
    const p = await ctx.newPage();
    await p.goto(base + r, { waitUntil: "load" });
    await settle(p);
    const secs = await p.evaluate(() => {
      const main = document.querySelector("main");
      const out = [];
      for (const s of main.children) {
        const sr = s.getBoundingClientRect();
        if (sr.height < 2) continue;
        const boxes = [];
        const push = (rc) => { if (rc.width >= 1 && rc.height >= 1) boxes.push([rc.top + scrollY, rc.bottom + scrollY]); };
        const walker = document.createTreeWalker(s, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement;
          if (!n.nodeValue.trim() || el.closest(".sr-only, [aria-hidden=true]") || !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
          const range = document.createRange(); range.selectNodeContents(n);
          for (const rc of range.getClientRects()) push(rc);
        }
        for (const el of s.querySelectorAll("img, svg, canvas, video, *")) {
          const cs = getComputedStyle(el);
          const media = /^(IMG|SVG|CANVAS|VIDEO)$/i.test(el.tagName);
          const hair = el.children.length > 0 || media ? (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== "none") || (parseFloat(cs.borderBottomWidth) > 0 && cs.borderBottomStyle !== "none") : false;
          if (!media && !hair) continue;
          if (el.closest("[aria-hidden=true]") && !hair) continue; // decorative backdrops are not content
          if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
          const rc = el.getBoundingClientRect();
          if (hair && !media) push({ width: rc.width, height: 1, top: parseFloat(cs.borderTopWidth) > 0 ? rc.top : rc.bottom - 1, bottom: parseFloat(cs.borderTopWidth) > 0 ? rc.top + 1 : rc.bottom });
          else push(rc);
        }
        boxes.sort((a, b) => a[0] - b[0]);
        const top = sr.top + scrollY, bottom = sr.bottom + scrollY;
        if (!boxes.length) { out.push({ id: s.id || s.tagName.toLowerCase(), top, bottom, first: top, last: bottom, blank: 100, ok: s.hasAttribute("data-gap-ok") }); continue; }
        // interior blank: walk merged intervals
        let cursor = boxes[0][1], blank = 0;
        for (const [a, b] of boxes) { if (a - cursor > 64) blank += a - cursor; cursor = Math.max(cursor, b); }
        const first = boxes[0][0], last = Math.max(...boxes.map((b) => b[1]));
        blank += Math.max(0, first - top - 96) + Math.max(0, bottom - last - 96);
        out.push({ id: s.id || s.tagName.toLowerCase(), top, bottom, first, last, blank: Math.round((blank / (bottom - top)) * 100), ok: s.hasAttribute("data-gap-ok") });
      }
      return out;
    });
    const limit = w >= 1024 ? 160 : 96;
    secs.forEach((s, i) => {
      const gap = i === 0 ? 0 : Math.round(s.first - secs[i - 1].last);
      const bad = !s.ok && (gap > limit || s.blank > 35);
      if (bad) fails++;
      lines.push(`${bad ? "FAIL" : s.ok ? "SKIP" : "PASS"}  ${r} @${w}  #${s.id}  gap=${gap}px (max ${limit})  blank=${s.blank}%  h=${Math.round(s.bottom - s.top)}px`);
    });
    await ctx.close();
  }
}
await browser.close();
console.log(lines.join("\n"));
console.log(`\n${fails} failing sections`);
process.exit(fails ? 1 : 0);
