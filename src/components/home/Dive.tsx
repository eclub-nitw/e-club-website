"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { canRunWebGL } from "@/lib/webgl";
import { Reveal } from "@/components/ui/Reveal";

const DiveScene = dynamic(() => import("./DiveScene"), { ssr: false });

export type Frame = { id: string; src: string; alt: string; caption: string };
const STACK_MAX = 8;

/**
 * Home scene 2, "The Dive". Desktop with a capable GPU: a pinned ~350vh WebGL tunnel of the club's photographs, flown through with scroll.
 * Everyone else (touch, reduced motion, 4 or fewer cores, Save-Data, no WebGL): a vertical stack of the same photographs with
 * clip-path reveals and captions. CSS picks the layout before JS runs (`.dive-live` only under fine pointer + no reduced motion);
 * if the device then fails the capability test, `data-fallback` flips it back to the stack. Nothing is gated: a skip link is always present.
 */
export function Dive({ frames }: { frames: Frame[] }) {
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
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
        progress.current = p;
        setIndex(Math.round(p * (frames.length - 1)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [frames.length]);

  const cur = frames[index];
  return (
    <section id="dive" ref={root} data-section="02 — The Dive" data-fallback={fallback || undefined} aria-label="The Dive: photographs from club events" className="dive relative bg-bg text-fg">
      <div className="dive-live relative h-[350vh]">
        <div className="sticky top-0 h-svh overflow-hidden">
          {/* Still of the first frame until the canvas has drawn, so the pinned screen is never empty. */}
          <picture><img src={frames[0].src} alt="" width={1024} height={768} loading="lazy" decoding="async" className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${drawn ? "opacity-0" : "opacity-50"}`} /></picture>
          <div aria-hidden="true" data-scene={mount ? (drawn ? "live" : "loading") : "still"} className={`absolute inset-0 transition-opacity duration-700 ${drawn ? "opacity-100" : "opacity-0"}`}>
            {mount && !fallback && <DiveScene frames={frames} progress={progress} active={onScreen && tabVisible} onReady={() => setDrawn(true)} />}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-5 pt-24 md:px-10">
            <p className="label text-fg">02 — The Dive</p>
            <p className="label tabular text-muted" aria-hidden="true">{String(index + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-5 pb-8 md:px-10 md:pb-10">
            <p className="label max-w-[40ch] text-fg" aria-live="off">{cur.caption}</p>
            <a href="#manifesto" className="label pointer-events-auto inline-flex min-h-11 items-center underline underline-offset-4 hover:text-accent">Skip the dive</a>
          </div>
        </div>
      </div>

      <div className="dive-stack px-5 py-16 md:px-10">
        <p className="label mb-8 border-t border-line pt-4 text-muted">02 — The Dive</p>
        <ul className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-14">
          {frames.slice(0, STACK_MAX).map((f, i) => (
            <li key={f.id} className={i % 2 ? "md:mt-20" : ""}>
              <figure>
                <Reveal>
                  <div className="crop relative aspect-[4/3] overflow-hidden rounded-[2px] bg-surface">
                    <picture><img src={f.src} alt={f.alt} width={1024} height={768} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" /></picture>
                  </div>
                </Reveal>
                <figcaption className="label mt-3 flex justify-between gap-4 text-muted"><span>{f.caption}</span><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span></figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-12 max-w-[1280px]"><Link href="/gallery" className="label underline underline-offset-4 hover:text-accent">All photographs in the gallery</Link></p>
      </div>
    </section>
  );
}
