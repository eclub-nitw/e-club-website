// Usage: node scripts/render-hero-poster.mjs [landscape|portrait]  -> renders the live hero scene (no text, no chrome) to public/images/generated/hero-scene.webp
// Needs a production server on :3100 and a real GPU (headed Chrome). The poster then matches the live scene exactly.
import { chromium } from "@playwright/test";
import sharp from "sharp";
const b = await chromium.launch({ channel: "chrome", headless: false, args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist"] });
const portrait = process.argv[2] === "portrait";
const VP = portrait ? { width: 390, height: 844 } : { width: 1600, height: 900 };
const p = await (await b.newContext({ viewport: VP, deviceScaleFactor: portrait ? 2 : 1 })).newPage();
await p.goto("http://localhost:3100/", { waitUntil: "load" });
await p.waitForFunction(() => document.querySelector("[data-scene]")?.getAttribute("data-scene") === "live", null, { timeout: 90000 });
await p.addStyleTag({ content: "header, nav, .hero-scrim, main > section:first-of-type > div.mx-auto, .grain::after { visibility: hidden !important; display: none !important; } body::after { display: none !important; } html { overflow: hidden !important; } div.rounded-full.border-accent { display: none !important; }" });
await p.mouse.move(VP.width / 2, VP.height / 2); // neutral parallax
await p.waitForTimeout(4500); // rise-in finished, camera damped to rest
const png = await p.screenshot({ clip: { x: 0, y: 0, width: VP.width, height: Math.round(VP.height * 0.92) } });
const name = portrait ? "hero-scene-portrait" : "hero-scene";
await sharp(png).webp({ quality: 80 }).toFile(`public/images/generated/${name}.webp`);
await sharp(png).png().toFile(`docs/handoff/phase2/${name}-render.png`);
console.log("done");
await b.close();
