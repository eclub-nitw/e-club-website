"use client";
import { useState } from "react";

/**
 * Decorative marquee with a visible pause/play button (WCAG 2.2.2). CSS-only motion (transform),
 * pauses on hover, and is static, wrapped and button-less under reduced motion.
 * Each half repeats the items twice so a half is wider than a desktop viewport.
 */
export function Ticker({ items }: { items: readonly string[] }) {
  const [paused, setPaused] = useState(false);
  const row = (dup: boolean) => [...items, ...items].map((t, i) => (
    <li key={i} className={`${dup || i >= items.length ? "ticker-dup " : ""}flex shrink-0 items-center gap-8 pr-8`}>
      <span className="font-display text-2xl font-medium tracking-tight md:text-4xl">{t}</span>
      <span aria-hidden="true" className="size-2 rotate-45 bg-accent" />
    </li>
  ));
  return (
    <div className="ticker relative overflow-hidden border-y border-line bg-bg py-5 text-fg" data-paused={paused}>
      <ul aria-hidden="true" className="ticker-track flex w-max">{row(false)}{row(true)}</ul>
      <button
        type="button" aria-pressed={paused} onClick={() => setPaused((p) => !p)}
        className="ticker-toggle absolute right-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center border border-line bg-bg text-fg hover:border-accent"
      >
        <span className="sr-only">{paused ? "Play" : "Pause"} scrolling text</span>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="currentColor">
          {paused ? <path d="M3 1.5v11l9-5.5z" /> : <path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" />}
        </svg>
      </button>
    </div>
  );
}
