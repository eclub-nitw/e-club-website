"use client";
import { useEffect, useRef } from "react";

const INTERACTIVE = "a[href], button, summary, input, textarea, select, label, [role='button']";

/**
 * Small ring that trails the pointer and grows over interactive elements.
 * Additive: the system cursor is never hidden. Fine pointers only, off under reduced motion,
 * and it disappears as soon as the keyboard is used.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, scale = 1, raf = 0;
    const draw = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x - 14}px, ${y - 14}px, 0) scale(${scale})`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(draw) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (el.style.opacity !== "1") { x = tx = e.clientX; y = ty = e.clientY; el.style.opacity = "1"; }
      tx = e.clientX; ty = e.clientY;
      scale = (e.target as Element | null)?.closest(INTERACTIVE) ? 1.8 : 1;
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const hide = () => { el.style.opacity = "0"; };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("keydown", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("keydown", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
  }, []);

  return <div ref={ring} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[70] size-7 rounded-full border border-accent opacity-0 transition-opacity duration-200" />;
}
