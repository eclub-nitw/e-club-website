"use client";
import { useRef, useState } from "react";

const HOLD_MS = 900;

/**
 * "Hold to dive": press and hold until the ring fills, then it scrolls to the target section. Optional by design:
 * scrolling works at all times, and Enter/Space (keyboard) or a plain click on the link fallback goes straight there.
 * The fill is a scaled disc (transform only).
 */
export function HoldButton({ targetId, children }: { targetId: string; children: React.ReactNode }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef(0);

  const go = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(targetId)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };
  const start = () => { setHolding(true); timer.current = window.setTimeout(() => { setHolding(false); go(); }, HOLD_MS); };
  const stop = () => { clearTimeout(timer.current); setHolding(false); };

  return (
    <button
      type="button"
      onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }}
      aria-label="Dive into the photographs. Hold, or press Enter, to scroll to the next section."
      className="group inline-flex min-h-11 items-center gap-4 text-left select-none touch-manipulation"
    >
      <span className="relative grid size-16 shrink-0 place-items-center rounded-full border border-club-paper/40">
        <span aria-hidden="true" className="absolute inset-1 rounded-full bg-accent" style={{ transform: holding ? "scale(1)" : "scale(0)", transition: holding ? `transform ${HOLD_MS}ms linear` : "transform 250ms var(--ease-out-expo)" }} />
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" className="relative text-fg mix-blend-difference"><path d="M8 2v11M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" /></svg>
      </span>
      <span className="label">{children}</span>
    </button>
  );
}
