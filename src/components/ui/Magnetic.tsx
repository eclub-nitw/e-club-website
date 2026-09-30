"use client";
import { useEffect, useRef } from "react";

const MAX = 6; // px, per V2 spec

/** Nudges its child toward the pointer by at most 6px. Fine pointers only; off under reduced motion. */
export function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      el.style.transform = `translate3d(${(x * MAX).toFixed(2)}px, ${(y * MAX).toFixed(2)}px, 0)`;
    };
    const reset = () => { el.style.transform = ""; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", reset); };
  }, []);

  return <span ref={ref} className="inline-flex transition-transform duration-200 ease-[var(--ease-out-expo)]">{children}</span>;
}
