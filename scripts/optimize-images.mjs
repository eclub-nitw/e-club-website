// Usage: npm i -D sharp && node scripts/optimize-images.mjs public/images/events/<slug>
// Resizes to max 1600px wide and writes .webp next to the originals (keep originals on Drive, not in git).
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const dir = process.argv[2];
if (!dir) { console.error("Give a folder"); process.exit(1); }
for (const f of await readdir(dir)) {
  if (!/\.(jpe?g|png)$/i.test(f)) continue;
  const out = path.join(dir, f.replace(/\.(jpe?g|png)$/i, ".webp"));
  await sharp(path.join(dir, f)).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
  console.log("→", out);
}
