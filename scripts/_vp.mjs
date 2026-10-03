// viewport (not full-page) screenshot at scroll y, after settling. node scripts/_vp.mjs <route|home> <w> <h> <out> [y]
import { base, launch } from "./_v7.mjs";
const [route, w, h, out, y = "0"] = process.argv.slice(2);
const b = await launch(); const p = await (await b.newContext({ viewport: { width: +w, height: +h }, isMobile: +w < 500 })).newPage();
await p.goto(base + (route === "home" ? "/" : route), { waitUntil: "load" }); await p.waitForTimeout(1800);
await p.evaluate((v) => window.scrollTo(0, v), +y); await p.waitForTimeout(1500);
await p.screenshot({ path: out }); await b.close();
