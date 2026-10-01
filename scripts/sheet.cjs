// Usage: node scripts/sheet.cjs out.jpg cols cellW cellH file...   Contact sheet of screenshots (top-aligned crop).
const sharp = require("sharp");
const [out, cols, cw, ch, ...files] = process.argv.slice(2);
const c = +cols, W = +cw, H = +ch;
(async () => {
  const th = await Promise.all(files.map((f) => sharp(f).resize(W, H, { fit: "cover", position: "top" }).jpeg({ quality: 72 }).toBuffer()));
  await sharp({ create: { width: W * c, height: H * Math.ceil(files.length / c), channels: 3, background: "#000" } })
    .composite(th.map((b, i) => ({ input: b, left: (i % c) * W, top: Math.floor(i / c) * H }))).jpeg({ quality: 72 }).toFile(out);
})();
