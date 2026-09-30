"use client";
import { useEffect, useRef } from "react";

/**
 * The hero wordmark. Letters start paper-coloured (readable at once); after load they become windows onto the
 * colour photograph (`background-clip: text`), and a warm light follows the pointer across them (transform only).
 * Touch and idle desktops get one automatic sweep instead. Save-Data skips the extra image.
 */
export function HeroWordmark({ litSrc }: { litSrc: string }) {
  const word = useRef<HTMLSpanElement>(null);
  const spot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const w = word.current, s = spot.current;
    if (!w || !s) return;
    let raf = 0, cancelled = false;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const light = () => {
      if (saveData) return;
      const img = new Image();
      img.src = litSrc;
      void img.decode().then(() => { if (cancelled) return; w.style.setProperty("--lit", `url(${litSrc})`); w.classList.add("is-lit"); }).catch(() => {});
    };
    const idle = typeof window.requestIdleCallback === "function";
    const start = () => (idle ? window.requestIdleCallback(light, { timeout: 2500 }) : window.setTimeout(light, 800));
    if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });

    const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
    const host = w.closest("section");
    const move = (e: PointerEvent) => {
      s.classList.remove("spot-sweep");
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = w.getBoundingClientRect();
        s.style.transform = `translate3d(${e.clientX - r.left - 288}px, ${e.clientY - r.top - 288}px, 0)`;
      });
    };
    if (fine && host) host.addEventListener("pointermove", move, { passive: true });
    return () => { cancelled = true; cancelAnimationFrame(raf); host?.removeEventListener("pointermove", move); window.removeEventListener("load", start); };
  }, [litSrc]);

  return (
    <span className="relative block w-fit">
      <span ref={word} className="mega-lit mega block">E-Club</span>
      <span ref={spot} aria-hidden="true" className="spot spot-sweep pointer-events-none absolute left-0 top-0 size-[36rem] rounded-full opacity-60" />
    </span>
  );
}
