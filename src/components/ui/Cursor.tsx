"use client";
import { useEffect, useRef } from "react";

const INTERACTIVE = "a[href], button, summary, input, textarea, select, label, [role='button']";

/**
 * Pointer follower: a small ring that grows over interactive elements and becomes a label (VIEW / DRAG / PLAY / OPEN)
 * over anything carrying `data-cursor="LABEL"`. Motion is a critically damped spring (no overshoot, no bounce).
 * Additive: the system cursor is never hidden. Fine pointers only, off under reduced motion, hidden on keyboard use.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ring.current, tx = text.current;
    if (!el || !tx || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const K = 260, C = 2 * Math.sqrt(K); // critical damping
    let px = 0, py = 0, x = 0, y = 0, vx = 0, vy = 0, size = 28, label = "", raf = 0, last = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
      last = now;
      vx += (K * (px - x) - C * vx) * dt; x += vx * dt;
      vy += (K * (py - y) - C * vy) * dt; y += vy * dt;
      el.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
      raf = Math.abs(px - x) + Math.abs(py - y) + Math.abs(vx) + Math.abs(vy) > 0.2 ? requestAnimationFrame(frame) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const target = e.target as Element | null;
      const lab = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      const next = lab ? 72 : target?.closest(INTERACTIVE) ? 44 : 28;
      if (lab !== label) { label = lab; tx.textContent = lab; }
      if (next !== size) { size = next; el.style.width = el.style.height = `${size}px`; }
      el.style.backgroundColor = lab ? "var(--accent)" : "transparent";
      tx.style.opacity = lab ? "1" : "0";
      if (el.style.opacity !== "1") { x = px = e.clientX; y = py = e.clientY; vx = vy = 0; el.style.opacity = "1"; }
      px = e.clientX; py = e.clientY;
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
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

  return (
    <div ref={ring} aria-hidden="true" className="cursor-label pointer-events-none fixed left-0 top-0 z-[70] flex size-7 items-center justify-center rounded-full border border-accent opacity-0 transition-opacity duration-200">
      <span ref={text} className="t-label text-accent-fg opacity-0 transition-opacity duration-150" />
    </div>
  );
}
