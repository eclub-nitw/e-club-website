"use client";
import { useEffect, useRef } from "react";

/**
 * Time-based playback for the reach scene. The server renders the final state (`data-play="done"`), so no-JS and reduced-motion visitors see
 * the finished map. With motion allowed it resets to `idle`, and when the block first enters the viewport flips to `run`: CSS (see .reach in
 * globals.css) plays the sequence once, about 4 seconds. "Replay" restarts it. No scroll listeners.
 */
export function ReachPlayer({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.play = "idle";
    btn.current?.removeAttribute("hidden");
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.dataset.play = "run"; io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const replay = () => {
    const el = root.current;
    if (!el) return;
    el.dataset.play = "idle";
    void el.offsetWidth; // flush so the animations restart from their first frame
    el.dataset.play = "run";
  };

  return (
    <div ref={root} data-play="done" className="reach">
      {children}
      <button ref={btn} type="button" hidden onClick={replay} className="t-label mt-4 inline-flex min-h-11 items-center underline underline-offset-4 hover:text-fg">Replay</button>
    </div>
  );
}
