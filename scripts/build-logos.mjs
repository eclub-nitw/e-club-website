// raw-media/logos/* -> public/images/brand and public/images/partners (WebP). Nothing is upscaled; sharp drops metadata.
// E-Club logo: the file is a JPEG on a white field. White connected to the border is flood-filled to transparent (tolerance below), the edge is
// feathered one pixel, and the result is cropped to the roundel. The white inside the ring is part of the drawing and stays.
// Partner logos stay opaque: they are shown on an equal white plate (PartnerGrid), which hides each file's own background.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "raw-media/logos";
await mkdir("public/images/brand", { recursive: true });
await mkdir("public/images/partners", { recursive: true });
const report = [];

// ---- E-Club: remove the outer white field
{
  const { data, info } = await sharp(`${SRC}/eclub-logo.jpeg`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const white = (i) => data[i] > 238 && data[i + 1] > 238 && data[i + 2] > 238;
  const out = Buffer.alloc(W * H * 4);
  const bg = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => { const p = y * W + x; if (!bg[p] && white(p * 3)) { bg[p] = 1; stack.push(p); } };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) {
    const p = stack.pop(), x = p % W, y = (p / W) | 0;
    if (x > 0) push(x - 1, y); if (x < W - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < H - 1) push(x, y + 1);
  }
  // alpha: 0 in the removed field; the 1px band next to it fades by how far from white the pixel is (kills the light JPEG fringe)
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = y * W + x, i = p * 3;
    let a = bg[p] ? 0 : 255;
    if (!bg[p]) {
      const near = (x > 0 && bg[p - 1]) || (x < W - 1 && bg[p + 1]) || (y > 0 && bg[p - W]) || (y < H - 1 && bg[p + W]);
      if (near) a = Math.max(0, Math.min(255, Math.round(((255 - Math.min(data[i], data[i + 1], data[i + 2])) / (255 - 150)) * 255)));
    }
    out[p * 4] = data[i]; out[p * 4 + 1] = data[i + 1]; out[p * 4 + 2] = data[i + 2]; out[p * 4 + 3] = a;
    if (a > 8) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  }
  const pad = 3;
  const box = { left: Math.max(0, minX - pad), top: Math.max(0, minY - pad), width: Math.min(W, maxX - minX + 1 + 2 * pad), height: Math.min(H, maxY - minY + 1 + 2 * pad) };
  const base = sharp(out, { raw: { width: W, height: H, channels: 4 } }).extract(box);
  const size = Math.min(box.width, 800); // native is ~370px wide; never upscale
  const png = await base.clone().resize({ width: size, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100 }).toFile("public/images/brand/eclub-logo.webp");
  const small = await base.clone().resize({ width: Math.min(box.width, 400), withoutEnlargement: true }).png().toFile("public/images/brand/eclub-logo-400.png");
  await base.clone().resize({ width: 300, height: 300, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ palette: true, quality: 92 }).toFile("public/images/brand/eclub-logo-og.png"); // OG image and the 64px favicon (src/app/icon.png) are derived from this one; keep both small: a 450KB favicon cost the pages about 2s of simulated LCP
  report.push(`eclub-logo.webp ${png.width}x${png.height}`, `eclub-logo-400.png ${small.width}x${small.height}`);
}

// ---- NITW emblem: the WebP (640x720, transparent outside the shield) is 3x the pixels of the 199x253 JPEG, so it is the sharper file
{
  const r = await sharp(`${SRC}/nitw-logo.webp`).webp({ quality: 92, alphaQuality: 100 }).toFile("public/images/brand/nitw-logo.webp");
  report.push(`nitw-logo.webp ${r.width}x${r.height} (kept: sharper than nitwlogo.jpeg 199x253)`);
}

// ---- Partners
const partners = [
  ["unstop", "unstop logo.jpeg", {}, 640],
  ["masters-union", "masters union logo.png", { left: 4, top: 4, width: 1327, height: 258 }, 800], // the source has a 3px dark screenshot border on its top and left edges
  ["school2startup", "school2startup logo.jpeg", {}, 447],
];
for (const [slug, file, crop, width] of partners) {
  let img = sharp(`${SRC}/${file}`).flatten({ background: "#fff" });
  if (crop.width) img = img.extract(crop);
  const r = await img.resize({ width, withoutEnlargement: true }).webp({ quality: 90 }).toFile(`public/images/partners/${slug}.webp`);
  report.push(`partners/${slug}.webp ${r.width}x${r.height}`);
}
console.log(report.join("\n"));
