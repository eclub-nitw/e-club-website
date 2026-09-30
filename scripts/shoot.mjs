// Verification helper: drives a local Chrome over CDP (no dependencies).
// Usage: node scripts/shoot.mjs <outDir> <path>[,<path>...] [--rm]   (server must be running on :3100)
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const [outDir, pathsArg, flag] = process.argv.slice(2);
const reduced = flag === "--rm";
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const port = 9333;
const base = "http://localhost:3100";
mkdirSync(outDir, { recursive: true });

const chrome = spawn(chromePath, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, "--user-data-dir=" + process.env.TEMP + "/shoot-profile", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ws;
for (let i = 0; i < 40; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
    break;
  } catch { await sleep(250); }
}
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); pending.get(d.id)?.(d); };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.result.value;

const viewports = [[360, 800, true], [768, 1024, false], [1440, 900, false]];
const report = [];
for (const p0 of pathsArg.split(",")) { const p = p0 === "home" ? "/" : p0; {
  for (const [w, h, mobile] of viewports) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile });
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }] });
    await send("Page.navigate", { url: base + p });
    await sleep(1500);
    // scroll through the page so IntersectionObserver reveals fire
    const total = await evalJs("document.documentElement.scrollHeight");
    for (let y = 0; y < total; y += h * 0.6) { await evalJs(`window.scrollTo(0, ${y})`); await sleep(120); }
    await sleep(1200);
    await evalJs("window.scrollTo(0,0)"); await sleep(400);
    const m = await evalJs(`JSON.stringify({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h1: document.querySelectorAll('h1').length, sh: document.documentElement.scrollHeight})`);
    const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
    const name = `${p === "/" ? "home" : p.slice(1).replace(/\//g, "-")}-${w}${reduced ? "-rm" : ""}.png`;
    writeFileSync(`${outDir}/${name}`, Buffer.from(shot.result.data, "base64"));
    report.push(`${name} ${m}`);
  }
}}
console.log(report.join("\n"));
ws.close(); chrome.kill();
