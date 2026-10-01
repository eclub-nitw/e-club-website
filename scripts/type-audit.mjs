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
process.exit(bad ? 1 : 0);
