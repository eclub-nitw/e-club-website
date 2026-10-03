// A3: why does the Home About right column look empty? Measures the grid, the art element, its load state, reveal state and mean luminance.
import { base, launch, settle } from "./_v7.mjs";
import sharp from "sharp";
const browser = await launch();
for (const [w, h] of [[1366, 768], [1440, 900], [1920, 1080]]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  await page.goto(base + "/", { waitUntil: "load" });
  await page.evaluate(() => document.querySelector("#about").scrollIntoView());
  await page.waitForTimeout(2500);
  const m = await page.evaluate(() => {
    const s = document.querySelector("#about"), r = (e) => { const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
    const grid = s.querySelector(".grid"), cols = [...grid.children], img = s.querySelector("img"), crop = s.querySelector(".crop");
    return { section: r(s), grid: r(grid), cols: cols.map(r), crop: r(crop), imgComplete: img.complete, natural: [img.naturalWidth, img.naturalHeight], imgOpacity: getComputedStyle(img).opacity, cropClip: getComputedStyle(crop).clipPath, mask: [...s.querySelectorAll(".mask-word")].length, masked: !!s.querySelector(".mask-in") };
  });
  console.log(w, JSON.stringify(m)); const el = await page.$("#about .crop");
  const buf = await page.screenshot({ clip: { x: m.crop[0], y: Math.max(0, m.crop[1]), width: Math.max(1, m.crop[2]), height: Math.max(1, Math.min(m.crop[3], h - Math.max(0, m.crop[1]))) } });
  const st = await sharp(buf).stats();
  const lum = Math.round(st.channels.slice(0, 3).reduce((a, c) => a + c.mean, 0) / 3);
  console.log(w, JSON.stringify(m), "meanLuma", lum);
  await page.locator("#about").screenshot({ path: `docs/handoff/v8/before/diag-about-${w}.png` });
}
await browser.close();
