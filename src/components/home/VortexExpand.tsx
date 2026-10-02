"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { dive } from "@/data/dive";
import { canRunWebGL } from "@/lib/webgl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollTrack } from "@/components/ui/ScrollTrack";
import { H2, Label } from "@/components/ui/Type";

const ExpandScene = dynamic(() => import("@/components/three/ExpandScene"), { ssr: false });
const STACK = dive.slice(0, 8);
const ALT = "Generated artwork, not a photograph.";

/**
 * Chapter "Flagship", part one: the vortex expand. Pinned: a small vortex ring grows until it fills the viewport, then the page falls
 * through it and down a tunnel of generated art and the club's posters (scrubbed by scroll, reversible), landing on the stage below.
 * Touch, reduced motion, low-end GPUs and Save-Data get a vertical stack of the same art with clip-path reveals instead. One canvas,
 * mounted only near the viewport and torn down by React on leave.
 */
export function VortexExpand({ number, children }: { number: string; children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [mount, setMount] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!canRunWebGL()) { const id = requestAnimationFrame(() => setFallback(true)); return () => cancelAnimationFrame(id); }
    const io = new IntersectionObserver(([e]) => { setOnScreen(e.isIntersecting); if (e.isIntersecting) setMount(true); }, { rootMargin: "60% 0px" });
    io.observe(el);
    const vis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, []);

  // One canvas alive at a time: far from the viewport the scene is torn down (React unmounts the canvas and its GPU resources).
  useEffect(() => {
    if (onScreen || !mount) return;
    const t = window.setTimeout(() => { setMount(false); setDrawn(false); }, 2500);
    return () => clearTimeout(t);
  }, [onScreen, mount]);

  return (
    <section id="flagship" ref={root} data-section={`${number} — Flagship`} data-fallback={fallback || undefined} aria-label="Flagship: Venture Vortex 2026" className="dive relative bg-bg text-fg">
      <div className="dive-live">
        <ScrollTrack onScrub={(p) => { progress.current = p; }} style={{ "--track-h": "360vh" } as React.CSSProperties}>
          <div className="stage">
            <img src="/images/dive/stage.webp" alt="" width={1024} height={576} loading="lazy" decoding="async" className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${drawn ? "opacity-0" : "opacity-40"}`} />
            <div aria-hidden="true" data-scene={mount ? (drawn ? "live" : "loading") : "still"} className={`absolute inset-0 transition-opacity duration-700 ${drawn ? "opacity-100" : "opacity-0"}`}>
              {mount && !fallback && <ExpandScene progress={progress} active={onScreen && tabVisible} onIndex={setIndex} onReady={() => setDrawn(true)} />}
            </div>
            {/* radial vignette and the closing fade to the stage ink: opacity only */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg)_100%)]" style={{ opacity: "calc(0.25 + var(--p) * 0.5)" }} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-bg" style={{ opacity: "clamp(0, calc((var(--p) - 0.9) * 10), 1)" }} />
            <div className="pointer-events-none absolute inset-x-0 top-0 pt-24"><Container className="flex items-start justify-between gap-6"><Label className="w-full border-t border-line pt-4">{number} — Flagship</Label><a href="#flagship-stage" className="t-label pointer-events-auto inline-flex min-h-11 shrink-0 items-center whitespace-nowrap pt-2 underline underline-offset-4 hover:text-accent-text">Skip the dive</a></Container></div>
            <div className="pointer-events-none absolute inset-0 flex items-center" style={{ opacity: "clamp(0, calc(1 - var(--p) * 6), 1)" }}>
              <Container><H2 className="max-w-[14ch]">Venture Vortex 2026</H2><p className="t-label mt-4 text-muted">Scroll to enter</p></Container>
            </div>
            <div className="absolute inset-x-0 bottom-0 pb-8 md:pb-10"><Container className="flex items-end justify-between gap-6">
              <Label aria-hidden="true" className="tabular">{String(index + 1).padStart(2, "0")} / {String(dive.length).padStart(2, "0")} · {ALT}</Label>
            </Container></div>
          </div>
        </ScrollTrack>
      </div>

      <div className="dive-stack px-5 py-20 md:px-10">
        <Container className="px-0 md:px-0">
          <Label className="mb-8 border-t border-line pt-4">{number} — Flagship</Label>
          <ul className="grid gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-14">
            {STACK.map((d, i) => (
              <li key={d.slug} className={i % 2 ? "md:mt-20" : ""}>
                <Reveal>
                  <div className="crop relative aspect-[4/3] overflow-hidden rounded-[2px] bg-surface">
                    <img src={`/images/dive/${d.slug}.webp`} alt="" width={d.w} height={d.h} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                  </div>
                </Reveal>
                <Label className="mt-3 flex justify-between gap-4"><span>{d.poster ? "Club poster" : ALT}</span><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span></Label>
              </li>
            ))}
          </ul>
        </Container>
      </div>
      {children}
    </section>
  );
}
