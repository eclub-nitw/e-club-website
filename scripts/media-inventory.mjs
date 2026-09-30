// Inventories raw-media (never committed), scores stills, writes contact sheets + docs/handoff/v3/media-scores.json
import sharp from "sharp";
import { readdir, stat, writeFile } from "node:fs/promises";
const D = "raw-media", OUT = "docs/handoff/v3";
const files = [...(await readdir(D)).filter(f=>!/\.heic$/i.test(f)&&f!=="_heic"&&f!=="generated"), ...(await readdir(D+"/_heic")).map(f=>"_heic/"+f)].sort();
const rows = [];
for (const f of files) {
  const s = await stat(`${D}/${f}`); if (!s.isFile()) continue;
  const ext = f.split(".").pop().toLowerCase();
  const row = { f, ext, mb: +(s.size / 1e6).toFixed(2) };
  if (["jpg", "jpeg", "heic"].includes(ext)) {
    const img = sharp(`${D}/${f}`, { failOn: "none" }).rotate();
    const m = await sharp(`${D}/${f}`).metadata();
    const portrait = (m.orientation ?? 1) >= 5;
    row.w = portrait ? m.height : m.width; row.h = portrait ? m.width : m.height;
    const g = await img.clone().resize(512).greyscale().convolve({ width: 3, height: 3, kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0] }).raw().toBuffer();
    let mean = 0; for (const v of g) mean += v; mean /= g.length;
    let v2 = 0; for (const v of g) v2 += (v - mean) ** 2; row.sharp = Math.round(v2 / g.length);
    const st = await img.clone().resize(256).stats(); row.lum = Math.round(st.channels.reduce((a, c) => a + c.mean, 0) / 3);
    row.type = "still";
  } else row.type = "video";
  rows.push(row);
}
await writeFile(`${OUT}/media-scores.json`, JSON.stringify(rows, null, 1));
const stills = rows.filter(r => r.type === "still");
const W = 400, H = 300, COLS = 4;
for (let p = 0; p * 12 < stills.length; p++) {
  const chunk = stills.slice(p * 12, p * 12 + 12);
  const comps = await Promise.all(chunk.map(async (r, i) => {
    const idx = p * 12 + i;
    const buf = await sharp(`${D}/${r.f}`, { failOn: "none" }).rotate().resize(W, H, { fit: "contain", background: "#000" }).toBuffer();
    const label = Buffer.from(`<svg width="${W}" height="26"><rect width="100%" height="100%" fill="#000a"/><text x="6" y="18" font-size="15" fill="#fff" font-family="monospace">#${idx} s${r.sharp} l${r.lum}</text></svg>`);
    const img = await sharp(buf).composite([{ input: label, top: 0, left: 0 }]).toBuffer();
    return { input: img, left: (i % COLS) * W, top: Math.floor(i / COLS) * H };
  }));
  await sharp({ create: { width: W * COLS, height: H * Math.ceil(chunk.length / COLS), channels: 3, background: "#111" } }).composite(comps).jpeg({ quality: 70 }).toFile(`${OUT}/sheet-${p}.jpg`);
}
console.log(rows.length, "files;", stills.length, "stills;", rows.filter(r => r.type === "video").length, "videos");
