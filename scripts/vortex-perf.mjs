// Vortex GPU measurement. Usage: node scripts/vortex-perf.mjs [label]   (production server on :3100, real GPU, headed-equivalent Chrome)
// Scrolls the pinned vortex track at a steady pace for 10 s at CPU throttle 1x and 4x and reports, from inside the page: frame time (average, p95),
// long tasks (>50 ms), WebGL draw calls and texture upload bytes per second, drawing-buffer size and DPR; and from CDP SystemInfo: GPU-process
// CPU time as a share of wall time ("GPU busy", an approximation: CPU time spent by Chrome's GPU process, not the GPU's own utilisation).
import { launch, base } from "./_v7.mjs";

const label = process.argv[2] ?? "run";
const DPR = Number(process.env.DPR ?? 1), CSS = process.env.CSS ?? "", RATES = (process.env.RATES ?? "1,4").split(",").map(Number); // CSS: experiment styles injected before measuring
const init = () => {
  const st = { draws: 0, texBytes: 0, ctx: null, frames: [], long: 0, on: false };
  window.__perf = st;
  for (const C of [WebGLRenderingContext, WebGL2RenderingContext]) {
    for (const fn of ["drawArrays", "drawElements", "drawArraysInstanced", "drawElementsInstanced"]) { const o = C.prototype[fn]; C.prototype[fn] = function (...a) { if (st.on) st.draws++; return o.apply(this, a); }; }
    const t = C.prototype.texImage2D; C.prototype.texImage2D = function (...a) { const img = a[a.length - 1]; if (st.on && img && img.width) st.texBytes += img.width * img.height * 4; return t.apply(this, a); };
    const g = C.prototype.getContext; void g;
  }
  const gc = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (...a) { const c = gc.apply(this, a); if (c && /webgl/.test(String(a[0]))) st.ctx = { canvas: this, gl: c }; return c; };
  new PerformanceObserver((l) => { if (st.on) st.long += l.getEntries().length; }).observe({ entryTypes: ["longtask"] });
};

const browser = await launch();
const out = {};
for (const rate of RATES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: DPR });
  await ctx.addInitScript(init);
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await p.goto(base + "/", { waitUntil: "load" });
  if (CSS) await p.addStyleTag({ content: CSS });
  await p.waitForTimeout(6000); // let the idle warm-up and texture uploads finish, as a visitor would have
  await p.evaluate(() => document.getElementById("dive").scrollIntoView());
  await p.waitForTimeout(800);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate });
  const bcdp = await browser.newBrowserCDPSession();
  const gpuCpu = async () => { const { processInfo } = await bcdp.send("SystemInfo.getProcessInfo"); return processInfo.filter((x) => x.type === "GPU").reduce((s, x) => s + x.cpuTime, 0); };
  const g0 = await gpuCpu(), t0 = Date.now();
  const r = await p.evaluate(async (__IDLE__) => {
    const st = window.__perf; st.on = true; st.draws = 0; st.texBytes = 0; st.long = 0;
    const el = document.getElementById("dive"); const track = el.querySelector(".track");
    const top = track.getBoundingClientRect().top + scrollY, span = track.offsetHeight - innerHeight;
    const ms = 10000, t0 = performance.now(); const idle = __IDLE__; let last = t0; const dts = [];
    await new Promise((res) => { const tick = (n) => { dts.push(n - last); last = n; const k = Math.min(1, (n - t0) / ms); window.scrollTo(0, idle ? top + span * 0.5 : top + span * k); if (k < 1) requestAnimationFrame(tick); else res(); }; requestAnimationFrame(tick); });
    st.on = false;
    dts.shift(); dts.sort((a, b) => a - b);
    const gl = st.ctx?.gl, c = st.ctx?.canvas; const ext = gl?.getExtension("WEBGL_debug_renderer_info");
    return { frames: dts.length, avg: dts.reduce((a, b) => a + b, 0) / dts.length, p95: dts[Math.floor(dts.length * 0.95)], max: dts.at(-1), long: st.long, drawsPerFrame: st.draws / dts.length, texMB: st.texBytes / 1048576,
      canvas: c ? `${c.width}x${c.height}` : null, dpr: devicePixelRatio, renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "n/a", live: !!c, drawsTotal: st.draws };
  }, process.env.IDLE === "1");
  const g1 = await gpuCpu();
  r.gpuBusyPct = +(((g1 - g0) / ((Date.now() - t0) / 1000)) * 100).toFixed(1);
  out[`${rate}x`] = r;
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ label, ...out }, null, 1));
