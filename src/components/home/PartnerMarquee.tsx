"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Consented partner logos as a marquee whose speed follows scroll velocity (Web Animations API: transform only),
 * with a visible pause button (WCAG 2.2.2). Under reduced motion it is a static, wrapped list and the button is not shown.
 * Children are server-rendered <li> logos; the track shows them twice, the second copy hidden from assistive tech.
 */
export function PartnerMarquee({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const anim = useRef<Animation | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = el.animate([{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }], { duration: 45_000, iterations: Infinity });
    anim.current = a;
    let last = window.scrollY, lastT = performance.now(), boost = 0, raf = 0;
    const tick = (now: number) => {
      const y = window.scrollY, dt = Math.max(1, now - lastT);
      boost = Math.max(boost * 0.92, Math.min(6, (Math.abs(y - last) / dt) * 0.6)); // decays back to 1x
      last = y; lastT = now;
      a.updatePlaybackRate(1 + boost);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); a.cancel(); anim.current = null; };
  }, []);

  const toggle = () => { const next = !paused; setPaused(next); if (next) anim.current?.pause(); else anim.current?.play(); };

  return (
    <div className="relative overflow-hidden border-y border-line py-6">
      <div ref={track} className="flex w-max motion-reduce:w-auto">
        <ul className="flex items-center gap-x-14 pr-14 motion-reduce:flex-wrap motion-reduce:gap-y-6">{children}</ul>
        <ul aria-hidden="true" className="flex items-center gap-x-14 pr-14 motion-reduce:hidden">{children}</ul>
      </div>
      <button type="button" aria-pressed={paused} onClick={toggle} className="motion-reduce:hidden absolute right-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center border border-line bg-bg hover:border-accent">
        <span className="sr-only">{paused ? "Play" : "Pause"} scrolling logos</span>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="currentColor">{paused ? <path d="M3 1.5v11l9-5.5z" /> : <path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" />}</svg>
      </button>
    </div>
  );
}
