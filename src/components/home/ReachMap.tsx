import { rounds } from "@/data/timeline";
import { indiaMap, projectLatLon } from "@/data/india-map";
import { home, reach } from "@/data/reach";
import { fmtRange } from "@/lib/format";
import { Label } from "@/components/ui/Type";
import { ReachPlayer } from "./ReachPlayer";

const [r1, r2, r3] = rounds;
const [hx, hy] = projectLatLon(home.lat, home.lon);
const range = (r: { start: string; end: string }) => fmtRange(r.start, r.end).replace(/ 2026$/, "");
// Row 0 is the eligibility; 1 to 3 are the rounds, lit in sequence by the player. All from data/event.ts and data/timeline.ts.
const ROWS = [
  { key: "Open across India", title: "UG, PG and working professionals", sub: "Any college, any city" },
  { key: "Round 1 · Online", title: range(r1), sub: `${r1.name} · registration to 3 Oct` },
  { key: "Round 2 · Online", title: range(r2), sub: r2.name },
  { key: "Round 3 · Warangal campus", title: range(r3), sub: r3.name },
] as const;

/**
 * "Campus to India", compact, inside the spotlight block (it is about the competition, not the club). Not pinned. On entering the viewport a glow
 * covers the country for Round 1, a ring runs out for Round 2, then the glow contracts into one pin on Warangal for the on-campus finale; the
 * ledger rows light in step. About four seconds, once; "Replay" repeats it. No cities, college counts or participants are shown: only rows present
 * in data/reach.ts get extra pins. Reduced motion and no JS: the finished state.
 */
export function ReachMap() {
  return (
    <ReachPlayer>
      <div className="grid items-center gap-x-[clamp(32px,5vw,96px)] gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div data-content className="relative mx-auto w-full max-w-[min(100%,calc(62svh*0.894))]" style={{ aspectRatio: `${indiaMap.width} / ${indiaMap.height}` }}>
          <svg aria-hidden="true" viewBox={indiaMap.viewBox} className="absolute inset-0 size-full overflow-visible" fill="none">
            <defs><clipPath id="in-clip"><path d={indiaMap.path} /></clipPath></defs>
            <path d={indiaMap.path} fill="var(--color-club-deep)" stroke="var(--color-club-cyan)" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
            <g clipPath="url(#in-clip)">
              <circle className="reach-cover" cx={hx} cy={hy} r={1100} fill="var(--color-club-cyan)" opacity={0.22} />
              <circle className="reach-ring" cx={hx} cy={hy} r={1100} stroke="var(--color-club-cyan)" strokeWidth={5} />
            </g>
            {reach.map((c) => { const [x, y] = projectLatLon(c.lat, c.lon); return <circle key={c.city} cx={x} cy={y} r={5} fill="var(--color-club-cyan)" />; })}
            <g className="reach-pin">
              <circle className="reach-pulse" cx={hx} cy={hy} r={22} fill="var(--accent)" />
              <circle cx={hx} cy={hy} r={9} fill="var(--accent)" />
              <path d={`M${hx} ${hy}L${hx + 120} ${hy - 90}h110`} stroke="var(--accent)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
          <span className="reach-pin t-label absolute whitespace-nowrap text-accent-text" style={{ left: `${((hx + 130) / indiaMap.width) * 100}%`, top: `${((hy - 90) / indiaMap.height) * 100}%`, transform: "translateY(-130%)" }}>{home.city}</span>
        </div>

        <ol className="border-b border-line">
          {ROWS.map((r, i) => (
            <li key={r.key} className={`reach-row row-${i} border-t border-line py-5`}>
              <Label className="text-inherit">{r.key}</Label>
              <p className="t-h3 mt-2">{r.title}</p>
              <p className="t-body mt-1">{r.sub}</p>
            </li>
          ))}
        </ol>
      </div>
    </ReachPlayer>
  );
}
