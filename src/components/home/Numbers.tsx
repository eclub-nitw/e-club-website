"use client";
import { useEffect, useRef, useState } from "react";
import { copy } from "@/data/copy";
import { event } from "@/data/event";
import { startups } from "@/data/startups";
import { Container } from "@/components/ui/Container";
import { ScrollTrack } from "@/components/ui/ScrollTrack";
import { H2, Label } from "@/components/ui/Type";

// Verified Venture Vortex facts only (data/event.ts, data/startups.ts). Not club-lifetime figures.
const STATS = [
  { value: String(event.rounds.length), label: "Rounds", note: "Two online, one on campus" },
  { value: String(startups.length), label: "Startups to choose from", note: "Round 1 teardown" },
  { value: `${event.team.min}–${event.team.max}`, label: "Members per team", note: "Cross-college allowed" },
  { value: "₹50,000", label: "Prize pool", note: "Total cash pool" },
  { value: "30–31 Oct", label: "Finale", note: "On campus, NIT Warangal" },
];

const PARTS = /^(\D*)(\d[\d,]*)(\D*)$/;

/** Counts up once when `run` first turns true; the server HTML and reduced motion show the final value. */
function Counter({ value, run }: { value: string; run: boolean }) {
  const m = PARTS.exec(value);
  const target = m ? Number(m[2].replace(/,/g, "")) : NaN;
  const [shown, setShown] = useState<number | null>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!run || started.current || Number.isNaN(target) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    started.current = true;
    const t0 = performance.now(); let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 900);
      setShown(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);
  if (!m || shown === null) return <>{value}</>;
  return <>{m[1]}{shown.toLocaleString("en-IN")}{m[3]}</>;
}

/**
 * Chapter "Venture Vortex in numbers". Desktop: the stage is pinned while five verified figures light up in sequence (count-up, orange
 * on the current row, a hairline that grows with scroll). Elsewhere it is a plain five-row ledger.
 */
export function Numbers({ number }: { number: string }) {
  const [step, setStep] = useState(0);
  return (
    <section id="numbers" data-section={`${number} — Numbers`} aria-labelledby="numbers-h" className="relative bg-bg text-fg">
      <ScrollTrack steps={STATS.length} onStep={setStep} style={{ "--track-h": "420vh" } as React.CSSProperties}>
        <div className="stage flex items-center py-20 md:py-0">
          <Container className="w-full">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
              <header className="relative">
                <Label className="border-t border-line pt-4">{number} — Numbers</Label>
                <H2 id="numbers-h" className="mt-6">{copy.numbers.title}</H2>
                <p className="t-body mt-4">{copy.numbers.line}</p>
                <span aria-hidden="true" className="absolute -left-4 top-24 hidden h-40 w-px origin-top bg-accent lg:block" style={{ transform: "scaleY(var(--p))" }} />
              </header>
              <dl>
                {STATS.map((s, i) => (
                  <div key={s.label} data-on={i <= step} className="stat-row grid items-baseline gap-x-8 gap-y-1 border-t border-line py-4 md:grid-cols-[minmax(0,15rem)_1fr] md:py-5">
                    <dt className={`t-stat tabular ${i === step ? "text-accent-text" : ""}`}><Counter value={s.value} run={i <= step} /></dt>
                    <dd className="m-0"><p className="t-h3">{s.label}</p><Label className="mt-1">{s.note}</Label></dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </div>
      </ScrollTrack>
    </section>
  );
}
