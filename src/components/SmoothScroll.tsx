"use client";
import { useEffect } from "react";

/**
 * Smooth scrolling (Lenis), loaded at idle so it is not part of the initial JS. Skipped under reduced motion and on touch devices:
 * measured on the mobile profile it raised TBT and event latency, and native touch scrolling is better anyway. The scroll scenes
 * read window scroll directly, so they behave the same with or without it.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    let cancelled = false;
    let stop = () => {};
    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.1 });
      let raf = 0;
      const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
      stop = () => { cancelAnimationFrame(raf); lenis.destroy(); };
    };
    const hasIdle = typeof window.requestIdleCallback === "function"; // Safari lacks it
    const id = hasIdle ? window.requestIdleCallback(start) : window.setTimeout(start, 200);
    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(id); else window.clearTimeout(id);
      stop();
    };
  }, []);
  return null;
}
