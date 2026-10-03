// V8 rule: the club is generic everywhere except an allowlist. Renders every route from `next start` (BASE_URL, default :3100) with JavaScript off,
// removes the allowlisted blocks, and fails if a banned term remains in the HTML, the meta tags or the JSON-LD of a non-allowlisted route.
// Allowlist: the nav spotlight button, the Home spotlight block / chip / ticker / Initiatives row (anything linking to /venture-vortex plus #spotlight and
// the announcements region), /initiatives "How to take part", the /sponsors event-partners block, /venture-vortex, and Event JSON-LD.
// Usage: node scripts/qa-v8-generic.mjs
import { base, launch, routes } from "./_v7.mjs";

const BANNED = [/venture\s+vortex/i, /unstop/i, /round\s*[123]\b/i, /₹\s?50,?000/, /technozion/i, /masters[’']?\s+union/i, /school2startup/i, /uplearn/i];
const EXTRA_ROUTES = ["/privacy", "/terms", "/cookies", "/disclaimer", "/accessibility"];
// Legal text is human-reviewed and not edited by the tech team: known mentions are reported, not failed (docs/LEGAL-REVIEW-NOTES.md).
const LEGAL = new Set(EXTRA_ROUTES);
const SKIP = new Set(["/venture-vortex"]); // allowlisted whole

const REMOVE = [
  "header[data-hidden]", "dialog",                       // nav (spotlight button) and the mobile menu
  '[aria-label="Announcements"]',                          // ticker
  "#spotlight", "#take-part", "#vortex-partners",          // spotlight block, take-part ledger, event partners
  'a[href="/venture-vortex"]',                             // chip, row, buttons that point at the spotlight page
  "script:not([type='application/ld+json'])",              // RSC payload repeats the removed blocks
];

const browser = await launch();
const ctx = await browser.newContext({ javaScriptEnabled: false });
const page = await ctx.newPage();
let fails = 0;
const list = [...new Set([...(await routes()), ...EXTRA_ROUTES])].filter((r) => !SKIP.has(r));
for (const r of list) {
  const html = await (await fetch(base + r)).text();
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  const rest = await page.evaluate((sel) => {
    for (const s of sel) document.querySelectorAll(s).forEach((e) => e.remove());
    // Event JSON-LD is allowlisted; Organization and BreadcrumbList JSON-LD is not.
    document.querySelectorAll("script[type='application/ld+json']").forEach((e) => { if (/"@type":"Event"/.test(e.textContent ?? "")) e.remove(); });
    return document.documentElement.outerHTML;
  }, REMOVE);
  const hits = BANNED.map((re) => rest.match(re)).filter(Boolean).map((m) => `${m[0]} …${rest.slice(Math.max(0, m.index - 50), m.index + 50).replace(/\s+/g, " ")}…`);
  const tag = hits.length === 0 ? "PASS" : LEGAL.has(r) ? "FLAG (legal text, not edited)" : "FAIL";
  if (tag === "FAIL") fails++;
  console.log(`${tag.padEnd(30)} ${r}${hits.length ? "\n    " + hits.slice(0, 3).join("\n    ") : ""}`);
}
await browser.close();
console.log(fails ? `\n${fails} FAIL` : "\nall generic routes pass");
process.exit(fails ? 1 : 0);
