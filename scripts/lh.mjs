// Usage: node scripts/lh.mjs <url> [runs]  -> Lighthouse mobile, N valid runs; prints each run and the median. Needs a prod server.
// Runs from a slow machine are discarded: Lighthouse records a CPU benchmark (healthy here: ~2400); below MIN_BENCH (default 1800) the run is rejected and retried.
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const [url, runs = "5"] = process.argv.slice(2);
const dir = mkdtempSync(join(tmpdir(), "lh-"));
const rows = [];
const MIN_BENCH = Number(process.env.MIN_BENCH ?? 1800);
let attempts = 0, rejected = 0;
while (rows.length < Number(runs) && attempts < Number(runs) * 4) {
  attempts++; const i = rows.length;
  const out = join(dir, `${i}.json`);
  execFileSync("npx", ["lighthouse", url, "--only-categories=performance,accessibility,seo,best-practices", "--quiet", "--chrome-flags=--headless=new", "--output=json", `--output-path=${out}`], { stdio: "ignore", shell: true });
  const r = JSON.parse(readFileSync(out, "utf8")); const a = r.audits, c = r.categories;
  const bench = r.environment.benchmarkIndex;
  if (bench < MIN_BENCH) { rejected++; console.log(`  rejected (machine too slow: benchmark ${Math.round(bench)} < ${MIN_BENCH})`); continue; }
  const lcpEl = a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? "";
  rows.push({ bench, perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100), seo: Math.round(c.seo.score * 100), bp: Math.round(c["best-practices"].score * 100),
    lcp: a["largest-contentful-paint"].numericValue / 1000, fcp: a["first-contentful-paint"].numericValue / 1000, tbt: a["total-blocking-time"].numericValue, cls: a["cumulative-layout-shift"].numericValue, kb: a["total-byte-weight"].numericValue / 1024, lcpEl: lcpEl.slice(0, 80) });
  console.log(`run ${i + 1} [bench ${Math.round(rows[i].bench)}]: perf ${rows[i].perf} a11y ${rows[i].a11y} seo ${rows[i].seo} bp ${rows[i].bp} LCP ${rows[i].lcp.toFixed(2)}s FCP ${rows[i].fcp.toFixed(2)}s TBT ${rows[i].tbt.toFixed(0)}ms CLS ${rows[i].cls.toFixed(3)} ${rows[i].kb.toFixed(0)}KiB ${rows[i].lcpEl}`);
}
const med = (k) => { const v = rows.map((r) => r[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
console.log(`(${rejected} slow-machine runs rejected)`);
if (!rows.length) { console.log("NO VALID RUNS: machine too slow, close heavy programs and retry"); process.exit(2); }
console.log(`MEDIAN of ${rows.length}: perf ${med("perf")} a11y ${med("a11y")} seo ${med("seo")} bp ${med("bp")} LCP ${med("lcp").toFixed(2)}s FCP ${med("fcp").toFixed(2)}s TBT ${med("tbt").toFixed(0)}ms CLS ${med("cls").toFixed(3)} ${med("kb").toFixed(0)}KiB`);
