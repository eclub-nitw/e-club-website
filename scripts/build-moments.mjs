// V4 Moments treatment. Usage: node scripts/build-moments.mjs
// The <= 8 frames chosen by technical quality get ONE unified treatment: greyscale mapped to an ink-teal -> warm-paper duotone,
// cropped to 3:2, 1600 and 1024 wide. Event photos appear nowhere else on Home.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

export const MOMENTS = ["02-22", "01-15", "01-13", "01-03", "02-21", "03-33", "01-07", "01-09"];
const INK = [8, 26, 30], MID = [38, 96, 102], PAPER = [245, 235, 214];
const OUT = "public/images/moments"; await mkdir(OUT, { recursive: true });
for (const id of MOMENTS) {
  const src = `public/images/events/club-event-${id.slice(0, 2)}/${id}-1600.webp`;
  const { data, info } = await sharp(src).resize(1600, 1067, { fit: "cover", position: "centre" }).grayscale().normalise({ lower: 8, upper: 97 }).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0; i < data.length; i++) {
    const t = Math.pow(data[i] / 255, 1.7); // deep mids so the ink-teal shadows hold and only highlights go warm
    const lo = t < 0.5, u = lo ? t / 0.5 : (t - 0.5) / 0.5, a = lo ? INK : MID, b = lo ? MID : PAPER;
    for (let c = 0; c < 3; c++) out[i * 3 + c] = a[c] + (b[c] - a[c]) * u;
  }
  const img = sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } });
  for (const w of [1024, 1600]) {
    const r = img.clone().resize(w);
    await r.clone().avif({ quality: 50, effort: 6 }).toFile(`${OUT}/${id}-${w}.avif`);
    await r.clone().webp({ quality: 74 }).toFile(`${OUT}/${id}-${w}.webp`);
  }
  console.log(id);
}
