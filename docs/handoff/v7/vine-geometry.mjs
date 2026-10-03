// Vine candidates. Geometry in a 64 x 560 box, hanging from the top-left corner.
const bez = (p0, p1, p2, p3, t) => { const u = 1 - t; return [u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0], u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]]; };
const seg = [[[24,-6],[44,90],[10,170],[28,250]], [[28,250],[44,330],[16,410],[26,520]]];
const pts = []; for (const s of seg) for (let i = 0; i < 12; i++) pts.push(bez(...s, i/12)); pts.push(seg[1][3]);
const len = [0]; for (let i=1;i<pts.length;i++) len.push(len[i-1]+Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]));
const L = len[len.length-1];
const at = (f) => { const d = f*L; let i = 1; while (i < len.length-1 && len[i] < d) i++; const t = (d-len[i-1])/(len[i]-len[i-1]||1); const p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; const ang = Math.atan2(pts[i][1]-pts[i-1][1], pts[i][0]-pts[i-1][0]); return {p, ang}; };
// tapered stem polygon
const left = [], right = [];
for (let i = 0; i < pts.length; i++) { const a = at(len[i]/L); const w = 2.4 - 1.7*(len[i]/L); const nx = -Math.sin(a.ang), ny = Math.cos(a.ang); left.push([pts[i][0]+nx*w, pts[i][1]+ny*w]); right.push([pts[i][0]-nx*w, pts[i][1]-ny*w]); }
const stem = "M" + left.map(p => p.map(v=>v.toFixed(1)).join(" ")).join("L") + "L" + right.reverse().map(p => p.map(v=>v.toFixed(1)).join(" ")).join("L") + "Z";
const leaf = "M0 0C5-7 14-9 22-2C14 5 6 5 0 0Z";
const deg = (r) => (r*180/Math.PI).toFixed(1);
let A = `<path d="${stem}" fill="#2c8b93"/>`;
const F = [0.14, 0.30, 0.46, 0.62, 0.78];
F.forEach((f, j) => { const {p, ang} = at(f); const sc = 0.85 - j*0.06;
  A += `<g transform="translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${sc.toFixed(2)})"><path d="${leaf}" transform="rotate(${deg(ang-0.95)})" fill="#36afaa"/><path d="${leaf}" transform="rotate(${deg(ang+0.95)}) scale(1 -1)" fill="#36afaa"/></g>`; });
const tip = at(1).p; A += `<circle cx="${tip[0].toFixed(1)}" cy="${(tip[1]+4).toFixed(1)}" r="5" fill="#ed9038"/>`;
// B: plumb line with unfolding leaves (straight line, leaves opening as small chevrons)
let B = `<path d="M14 -6V520" stroke="#2c8b93" stroke-width="2"/>`;
F.forEach((f, j) => { const y = f*520; B += `<g transform="translate(14 ${y.toFixed(0)})"><path d="M0 0L-20 14L0 8Z" fill="#36afaa"/><path d="M0 0L20 14L0 8Z" fill="#36afaa"/></g>`; });
B += `<circle cx="14" cy="526" r="5" fill="#ed9038"/>`;
// C: pennant growth line (a line with alternating triangular pennants)
let C = `<path d="M14 -6V520" stroke="#2c8b93" stroke-width="1.5"/>`;
F.forEach((f, j) => { const y = f*520; const s = j%2?-1:1; C += `<path d="M14 ${y.toFixed(0)}l${22*s} 7l${-22*s} 7Z" fill="#36afaa"/>`; });
C += `<circle cx="14" cy="526" r="5" fill="#ed9038"/>`;
import { writeFileSync } from "node:fs";
const page = (name, svg) => `<!doctype html><body style="margin:0;background:#0b2226;color:#f5f1e6;font:16px sans-serif"><svg viewBox="0 0 64 560" style="position:fixed;left:0;top:0;height:min(80vh,560px)" fill="none">${svg}</svg><div style="padding:120px 40px 0 40px;max-width:700px"><p style="font:12px monospace;letter-spacing:.14em">01 — NUMBERS · CANDIDATE ${name}</p><h2 style="font-size:40px">Venture Vortex in numbers</h2><p>Verified facts about this year's flagship.</p></div></body>`;
writeFileSync("A.html", page("A vine", A)); writeFileSync("B.html", page("B plumb-line", B)); writeFileSync("C.html", page("C pennant", C));
writeFileSync("geom.json", JSON.stringify({ stem, F: F.map((f,j)=>{ const {p,ang}=at(f); return {x:+p[0].toFixed(1), y:+p[1].toFixed(1), a:+deg(ang), s:+(0.85-j*0.06).toFixed(2)}; }), tip }));
console.log(L.toFixed(0), JSON.stringify(tip));
