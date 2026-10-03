// nitw.png (repo root, owner-supplied) -> public/images/brand/nitw-logo.webp, trimmed of its transparent margin, 640px wide.
// The E-Club logo file is not in the repo yet (TODO(owner)); when it is, add it here the same way and set site.logos.eclub.
import sharp from "sharp";
const img = sharp("nitw.png").trim({ threshold: 10 });
const { data, info } = await img.clone().resize({ width: 640 }).webp({ quality: 90, alphaQuality: 100 }).toBuffer({ resolveWithObject: true });
await sharp(data).toFile("public/images/brand/nitw-logo.webp");
console.log(info.width, info.height);
