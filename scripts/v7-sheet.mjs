// Contact sheet of a folder of jpgs. Usage: node scripts/v7-sheet.mjs <dir> <prefix> <out.jpg> [cols] [from] [to]
import sharp from "sharp";
import { readdirSync } from "node:fs";
const [dir, prefix, out, cols = "4", from = "0", to = "999"] = process.argv.slice(2);
const files = readdirSync(dir).filter((f) => f.startsWith(prefix) && f.endsWith(".jpg")).sort().slice(Number(from), Number(to));
const C = Number(cols), tw = 640;
const metas = await Promise.all(files.map((f) => sharp(`${dir}/${f}`).metadata()));
const th = Math.round(tw * 0.75);
const rows = Math.ceil(files.length / C);
const tiles = await Promise.all(files.map(async (f, i) => ({ input: await sharp(`${dir}/${f}`).resize(tw, th, { fit: "contain", background: "#222" }).toBuffer(), left: (i % C) * (tw + 6), top: Math.floor(i / C) * (th + 6) })));
await sharp({ create: { width: C * (tw + 6), height: rows * (th + 6), channels: 3, background: "#888" } }).composite(tiles).jpeg({ quality: 70 }).toFile(out);
console.log(files.length, "tiles ->", out);
