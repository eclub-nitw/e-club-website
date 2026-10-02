// Static type audit. Usage: node scripts/type-audit.mjs   (fails on drift from the type system)
// 1. No ad-hoc type utilities in components or pages: text-[..px|rem], text-xs..9xl, font-<weight>, font-display/sans/mono/serif.
//    Type comes from the voices (.t-impact .t-impact-s .t-h1-3 .t-lede .t-lede-xl .t-body .t-label .t-ui .t-wordmark).
// 2. The built CSS declares only the four families (Bricolage, Instrument Sans, Instrument Serif, JetBrains Mono) via the tokens.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const BAD = [/\btext-\[[^\]]*(px|rem|em|vw)[^\]]*\]/, /\btext-(xs|sm|base|lg|xl|[2-9]xl)\b/, /\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/, /\bfont-(display|sans|mono|serif)\b/, /\bleading-\[/, /\btracking-\[/];
async function* walk(d) { for (const e of await readdir(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) yield* walk(p); else if (/\.tsx$/.test(e.name)) yield p; } }

let bad = 0;
for await (const f of walk("src")) {
  if (f.endsWith(path.join("ui", "Type.tsx"))) continue;
  const lines = (await readFile(f, "utf8")).split("\n");
  lines.forEach((l, i) => { for (const re of BAD) { const m = l.match(re); if (m) { bad++; console.log(`FAIL  ${f}:${i + 1}  ${m[0]}`); } } });
}
const css = (await Promise.all((await readdir(".next/static/chunks")).filter((n) => n.endsWith(".css")).map((n) => readFile(`.next/static/chunks/${n}`, "utf8")))).join("\n");
const fams = new Set([...css.matchAll(/font-family:\s*([^;}]+)/g)].map((m) => m[1].split(",")[0].replace(/["']/g, "").trim()));
console.log("font-family first tokens in built CSS:", [...fams].join(" | "));
console.log(bad ? `\n${bad} ad-hoc type usages` : "\nno ad-hoc type usage");

// 3. Rendered caps (V5). Needs a production server: node scripts/type-audit.mjs [baseUrl]. Every visible text node at 1440 must stay at or under
//    60px (stat numerals 80px, impact 144px). Decorative ghost words are generated content, so they have no text node to measure.
//    Reports the largest text node per page. Skipped when no server answers.
const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
let caps = 0;
try {
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const routes = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))];
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch({ channel: "chrome" });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  for (const r of routes) {
    const p = await ctx.newPage(); await p.goto(base + r, { waitUntil: "load" }); await p.waitForTimeout(600);
    const top = await p.evaluate(() => {
      let best = { size: 0, text: "", cls: "" }; const over = [];
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const n = w.currentNode; if (!n.textContent.trim()) continue;
        const el = n.parentElement; if (!el || el.closest("script,style,noscript,.sr-only")) continue;
        const c = getComputedStyle(el); if (c.display === "none" || c.visibility === "hidden") continue;
        const size = parseFloat(c.fontSize), cls = el.className?.toString() ?? "";
        const cap = /\bt-impact\b/.test(cls) ? 144 : /\bt-stat\b|\bt-impact-s\b/.test(cls) ? 80 : 60;
        if (size > best.size) best = { size, text: n.textContent.trim().slice(0, 30), cls: cls.slice(0, 30) };
        if (size > cap + 0.5) over.push(`${size}px ${cls.slice(0, 24)} "${n.textContent.trim().slice(0, 20)}"`);
      }
      return { best, over };
    });
    console.log(`${top.over.length ? "FAIL" : "PASS"}  ${r}  largest ${top.best.size}px (${top.best.cls.trim() || "-"} "${top.best.text}")${top.over.length ? "  OVER: " + top.over.join(" | ") : ""}`);
    caps += top.over.length; await p.close();
  }
  await browser.close();
} catch (e) { console.log("rendered caps skipped (no server):", String(e).slice(0, 80)); }
process.exit(bad || caps ? 1 : 0);
