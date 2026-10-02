"use client";
import { useEffect, useRef } from "react";

/**
 * A tall track with a sticky stage inside (see `.track` in globals.css). While it is on screen, scroll progress through the track is
 * written to `--p` (0..1) and the active phase to `data-step`, so CSS does all the drawing with transform/opacity only. Without JS
 * or under reduced motion `--p` stays at 1, the track is not tall, and the scene shows its final state.
 */
export function ScrollTrack({ steps = 1, onStep, onScrub, className = "", children, ...rest }: {
  steps?: number; onStep?: (step: number) => void; onScrub?: (p: number) => void; className?: string; children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const onStepRef = useRef(onStep), onScrubRef = useRef(onScrub);
  useEffect(() => { onStepRef.current = onStep; onScrubRef.current = onScrub; });
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.live = "";
    let raf = 0, on = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
      el.style.setProperty("--p", p.toFixed(4));
      onScrubRef.current?.(p);
      const step = Math.min(steps - 1, Math.floor(p * steps));
      if (el.dataset.step !== String(step)) { el.dataset.step = String(step); onStepRef.current?.(step); }
    };
    const tick = () => { if (!raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting === on) return;
      on = e.isIntersecting;
      if (on) { window.addEventListener("scroll", tick, { passive: true }); window.addEventListener("resize", tick); update(); }
      else { window.removeEventListener("scroll", tick); window.removeEventListener("resize", tick); }
    }, { rootMargin: "50% 0px" });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("scroll", tick); window.removeEventListener("resize", tick); };
  }, [steps]);
  return <div ref={ref} className={`track ${className}`} data-step={steps - 1} {...rest}>{children}</div>;
}
