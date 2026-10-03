import { base, launch, settle } from "./_v7.mjs";
const [route, w, h, out] = process.argv.slice(2);
const b = await launch(); const p = await (await b.newContext({ viewport: { width: +w, height: +h }, isMobile: +w < 500 })).newPage();
await p.goto(base + (route === "home" ? "/" : route), { waitUntil: "load" }); await p.waitForTimeout(1200); await settle(p);
await p.screenshot({ path: out, fullPage: true }); await b.close();
