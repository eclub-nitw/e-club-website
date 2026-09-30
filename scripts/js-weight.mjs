// Usage: node scripts/js-weight.mjs http://localhost:3100/  -> gz bytes of every script the page references
import { gzipSync } from "node:zlib";
const url = process.argv[2] ?? "http://localhost:3100/";
const html = await (await fetch(url)).text();
const srcs = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]))];
let total = 0;
for (const s of srcs) {
  const buf = Buffer.from(await (await fetch(new URL(s, url))).arrayBuffer());
  const gz = gzipSync(buf, { level: 9 }).length;
  total += gz;
}
console.log(`${srcs.length} scripts, ${(total / 1024).toFixed(1)} KB gz (initial, referenced in HTML)`);
