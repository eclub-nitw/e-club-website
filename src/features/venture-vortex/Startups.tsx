"use client";
// The 50 startups sit on the 8 arms of a spiral galaxy (the vortex). Desktop: galaxy. Mobile: grouped list.
import Image from "next/image";
import { useMemo, useState } from "react";
import { startups, startupGroups, startupsDisclaimer, type Startup, type StartupGroup } from "@/data/startups";
import { Body, H2, H3, Label } from "@/components/ui/Type";

type Placed = { s: Startup; x: number; y: number; gi: number; dx: number; dy: number; dur: number };
const TWIST = 1.9; // radians an arm turns from centre to rim

function place(): Placed[] {
  const out: Placed[] = [];
  startupGroups.forEach((g, gi) => {
    const list = startups.filter((s) => s.group === g);
    const base = (gi / startupGroups.length) * Math.PI * 2 - Math.PI / 2;
    list.forEach((s, i) => {
      const t = (i + 1) / (list.length + 1);
      const r = 0.21 + 0.76 * t;
      const a = base + t * TWIST;
      const k = (gi * 7 + i * 13) % 10; // deterministic pseudo-random for drift
      out.push({ s, gi, x: 50 + Math.cos(a) * r * 46, y: 50 + Math.sin(a) * r * 46, dx: (k % 2 ? 1 : -1) * (3 + (k % 4)), dy: (k % 3 ? -1 : 1) * (3 + (k % 3)), dur: 7 + k });
    });
  });
  return out;
}
function armPoints(gi: number): string {
  const base = (gi / startupGroups.length) * Math.PI * 2 - Math.PI / 2;
  const pts: string[] = [];
  for (let t = 0; t <= 1.02; t += 0.04) {
    const r = 0.21 + 0.76 * t, a = base + t * TWIST;
    pts.push(`${(50 + Math.cos(a) * r * 46).toFixed(2)},${(50 + Math.sin(a) * r * 46).toFixed(2)}`);
  }
  return pts.join(" ");
}
const initials = (n: string) => n.split(/[\s.]+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

function Disc({ s, size }: { s: Startup; size: string }) {
  return (
    <span className="grid place-items-center rounded-full bg-vortex-paper" style={{ width: size, height: size }}>
      {s.logo
        ? <Image src={s.logo} alt="" width={40} height={40} unoptimized className="h-[56%] w-[56%] object-contain" />
        : <span className="t-label text-vortex-ink">{initials(s.name)}</span>}
    </span>
  );
}

export function Startups({ num }: { num: string }) {
  const [group, setGroup] = useState<StartupGroup | "All">("All");
  const [picked, setPicked] = useState<Startup | null>(null);
  const placed = useMemo(() => place(), []);
  const active = (g: StartupGroup) => group === "All" || group === g;

  return (
    <section id="startups" aria-labelledby="startups-h" data-section={`${num} — The 50`} className="mx-auto max-w-[1280px] px-5 py-24 md:px-10 md:py-32">
      <Label className="border-t border-line pt-4">{num} — The 50</Label>
      <H2 id="startups-h" className="mt-6 max-w-[16ch]">Pick one of these fifty.</H2>
      <Body className="mt-4">One startup per team, from AI to agritech. Filter by sector, then tap a name to see the official Round 1 option.</Body>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by sector">
        {(["All", ...startupGroups] as const).map((g) => (
          <button key={g} type="button" aria-pressed={group === g} onClick={() => { setGroup(g); setPicked(null); }}
            className={`t-label min-h-11 rounded-[2px] border px-4 transition-colors ${group === g ? "border-accent bg-accent text-accent-fg" : "border-line text-muted hover:border-fg hover:text-fg"}`}>
            {g}
          </button>
        ))}
      </div>

      {/* Desktop galaxy */}
      <div className="relative mx-auto mt-10 hidden aspect-square w-full max-w-[880px] md:block">
        <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none">
          {startupGroups.map((g, gi) => (
            <polyline key={g} points={armPoints(gi)} stroke="var(--color-vortex-plum)" strokeWidth={1.2} vectorEffect="non-scaling-stroke" strokeLinecap="round"
              style={{ opacity: active(g) ? 0.9 : 0.15, transition: "opacity .4s" }} />
          ))}
        </svg>
        <div className="absolute left-1/2 top-1/2 grid h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line text-center" aria-live="polite">
          {picked ? (
            <div className="px-3">
              <Label>Option {picked.n} · {picked.sector}</Label>
              <H3 className="mt-1">{picked.name}</H3>
            </div>
          ) : (
            <div><p className="t-stat tabular text-highlight">50</p><Label className="mt-1">startups</Label></div>
          )}
        </div>
        {placed.map(({ s, x, y, gi, dx, dy, dur }) => {
          const on = active(startupGroups[gi]);
          return (
            <button key={s.n} type="button" onClick={() => setPicked(s)} aria-label={`${s.n}. ${s.name}, ${s.sector}`}
              className="drift group absolute rounded-full outline-offset-4 transition-opacity duration-300 hover:z-10 focus-visible:z-10"
              style={{ left: `${x}%`, top: `${y}%`, width: "5.4%", height: "5.4%", opacity: on ? 1 : 0.16, pointerEvents: on ? "auto" : "none",
                ["--dx" as string]: `${dx}px`, ["--dy" as string]: `${dy}px`, ["--dur" as string]: `${dur}s` }}>
              <Disc s={s} size="100%" />
              <span className="t-label pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-[2px] bg-surface px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile list */}
      <div className="mt-8 space-y-10 md:hidden">
        {startupGroups.filter(active).map((g) => (
          <div key={g}>
            <h3 className="t-label border-b border-line pb-2 text-highlight">{g}</h3>
            <ul className="mt-2 divide-y divide-line">
              {startups.filter((s) => s.group === g).map((s) => (
                <li key={s.n} className="flex items-center gap-3 py-3">
                  <Disc s={s} size="40px" />
                  <span className="t-h3">{s.name}</span>
                  <span className="t-label ml-auto text-muted">{s.sector}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="t-ui mt-12 max-w-[70ch] text-muted">{startupsDisclaimer}</p>
    </section>
  );
}
