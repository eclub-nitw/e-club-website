"use client";
import { useEffect, useRef, useState } from "react";
import { usePhase } from "@/lib/hooks";
import { viewOf, type Phase } from "@/lib/phase";

/**
 * Announcement strip. One row, duplicated, translated by a small rAF loop whose speed follows scroll velocity (transform only).
 * Runs only while on screen; the pause button (WCAG 2.2.2) and reduced motion stop it, and reduced motion shows a wrapped static list.
 */
export function Ticker({ phase, items: rest }: { phase: Phase; items: string[] }) {
  const items = [viewOf(usePhase(phase)).ticker, ...rest];
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const el = root.current, tr = track.current;
    if (!el || !tr || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0, vel = 1, raf = 0, last = 0, lastY = window.scrollY, on = false;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
      const dy = Math.abs(window.scrollY - lastY); lastY = window.scrollY;
      vel += (1 + Math.min(4, dy / 14) - vel) * 0.08;
      if (!pausedRef.current) {
        x -= 56 * vel * dt;
        const half = tr.scrollWidth / 2;
        if (x <= -half) x += half;
        tr.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; last = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const row = (dup: boolean) => items.map((t, i) => (
    <li key={`${dup ? "d" : "a"}${i}`} aria-hidden={dup || undefined} className={`flex shrink-0 items-center gap-8 pr-8 ${dup ? "ticker-dup" : ""}`}>
      <span className="t-label whitespace-nowrap">{t}</span><span aria-hidden="true" className="size-1.5 rotate-45 bg-accent-fg/70" />
    </li>
  ));

  return (
    <div ref={root} aria-label="Announcements" role="region" className="ticker relative overflow-hidden bg-accent text-accent-fg">
      <div className="mx-auto flex max-w-[1920px] items-center">
        <ul ref={track} className="ticker-track flex min-h-12 w-max items-center">{row(false)}{row(true)}</ul>
        <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} className="ticker-toggle t-label absolute right-0 top-0 z-10 flex h-full min-w-11 items-center bg-accent px-4 text-accent-fg shadow-[-12px_0_12px_var(--accent)]">
          {paused ? "Play" : "Pause"}<span className="sr-only"> announcements</span>
        </button>
      </div>
    </div>
  );
}
