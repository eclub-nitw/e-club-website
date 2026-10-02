import { copy } from "@/data/copy";
import { rounds } from "@/data/timeline";
import { indiaMap, projectLatLon } from "@/data/india-map";
import { home, reach } from "@/data/reach";
import { fmtRange } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { ScrollTrack } from "@/components/ui/ScrollTrack";
import { H2, Label } from "@/components/ui/Type";

const [r1, r2, r3] = rounds;
const [hx, hy] = projectLatLon(home.lat, home.lon);
const range = (r: { start: string; end: string }) => fmtRange(r.start, r.end).replace(/ 2026$/, "");
// Phase 0 states the eligibility; 1 to 3 are the rounds. All from data/event.ts.
const PHASES = [
  { key: "Open across India", title: "UG, PG and working professionals", sub: "Any college, any city" },
  { key: "Round 1 · Online", title: range(r1), sub: r1.name },
  { key: "Round 2 · Online", title: range(r2), sub: r2.name },
  { key: "Round 3 · Warangal Campus", title: range(r3), sub: r3.name },
];

/**
 * Chapter "Campus to India". A pinned scene: the India outline sits on a tilted, layered plane, a soft glow ripples across it for the
 * two online rounds, then contracts into one pulsing pin on Warangal for the on-campus finale. The phase label is fixed and swaps with
 * scroll. No cities, college counts or participants are shown: only rows present in data/reach.ts get pins. Static fallback (reduced
 * motion, no JS): the final state, with the three rounds listed.
 */
export function CampusToIndia({ number }: { number: string }) {
  return (
    <section id="reach" data-section={`${number} — Reach`} aria-labelledby="reach-h" className="relative bg-bg text-fg">
      <ScrollTrack steps={4} style={{ "--track-h": "420vh" } as React.CSSProperties}>
        <div className="stage flex items-center py-20 md:py-0">
          <Container className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
            <div>
              <Label className="border-t border-line pt-4">{number} — Reach</Label>
              <H2 id="reach-h" className="mt-6">{copy.reach.title}</H2>
              <p className="t-body mt-4">{copy.reach.line}</p>

              <div aria-hidden="true" className="relative mt-8 min-h-[7.5rem] max-md:hidden">
                {PHASES.map((p, i) => (
                  <div key={p.key} className={`phase phase-${i}`}>
                    <Label className="text-accent-text">{p.key}</Label>
                    <p className="t-h3 mt-2">{p.title}</p>
                    <p className="t-body mt-1">{p.sub}</p>
                  </div>
                ))}
              </div>

              <ol className="mt-6 border-b border-line">
                {[r1, r2, r3].map((r, i) => (
                  <li key={r.id} className={`phase-row row-${i + 1} grid grid-cols-[4.5rem_1fr] gap-x-4 border-t border-line py-3`}>
                    <Label className="text-inherit">Round {r.n}</Label>
                    <span className="t-ui">{range(r)} · {r.mode.split(" · ")[0]}{i === 2 ? ", Warangal" : ""}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative mx-auto w-full max-w-[34rem] max-lg:max-h-[52svh]" style={{ aspectRatio: `${indiaMap.width} / ${indiaMap.height}` }}>
              <div aria-hidden="true" className="map-plane absolute inset-0">
                <svg viewBox={indiaMap.viewBox} className="absolute inset-0 size-full overflow-visible" fill="none">
                  <defs><clipPath id="in-clip"><path d={indiaMap.path} /></clipPath></defs>
                  {[0, 1, 2].map((k) => (
                    <path key={k} d={indiaMap.path} className="map-layer" style={{ "--z": -k * 7 } as React.CSSProperties} fill="var(--color-club-deep)" opacity={0.35 + k * 0.15} />
                  ))}
                  <path d={indiaMap.path} className="map-fill map-layer" style={{ "--z": 8 } as React.CSSProperties} fill="var(--color-club-deep)" stroke="var(--color-club-cyan)" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
                  <g clipPath="url(#in-clip)" className="map-glow">
                    {[0, 1.1, 2.2].map((d) => (
                      <circle key={d} cx={indiaMap.width / 2} cy={indiaMap.height / 2.2} r={300} fill="none" stroke="var(--color-club-cyan)" strokeWidth={2} className="ripple" style={{ animationDelay: `${d}s` }} />
                    ))}
                    <circle cx={indiaMap.width / 2} cy={indiaMap.height / 2.2} r={380} fill="var(--color-club-cyan)" opacity={0.12} />
                  </g>
                  {reach.map((c) => { const [x, y] = projectLatLon(c.lat, c.lon); return <circle key={c.city} cx={x} cy={y} r={5} fill="var(--color-club-cyan)" />; })}
                  <g className="map-pin">
                    <circle cx={hx} cy={hy} r={22} fill="var(--accent)" className="pulse" />
                    <circle cx={hx} cy={hy} r={22} fill="var(--accent)" className="pulse" style={{ animationDelay: "1.2s" }} />
                    <circle cx={hx} cy={hy} r={9} fill="var(--accent)" />
                    <path d={`M${hx} ${hy}L${hx + 120} ${hy - 90}h110`} stroke="var(--accent)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
                  </g>
                </svg>
                <span className="map-pin t-label absolute whitespace-nowrap text-accent-text" style={{ left: `${((hx + 130) / indiaMap.width) * 100}%`, top: `${((hy - 90) / indiaMap.height) * 100}%`, transform: "translateY(-130%)" }}>{home.city}</span>
              </div>
            </div>
          </Container>
        </div>
      </ScrollTrack>
    </section>
  );
}
