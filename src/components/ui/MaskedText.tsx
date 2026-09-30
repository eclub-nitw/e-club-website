"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Masked word-by-word reveal. `immediate` plays on load (above the fold, pure CSS keyframes);
 * otherwise plays once when scrolled into view. Text is always in the DOM for SEO/screen readers.
 * Uses IntersectionObserver rather than motion, which would add ~60 KB gz to every route.
 */
export function MaskedText({ text, immediate = false }: { text: string; immediate?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (immediate || !el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  return (
    <span ref={ref} className={immediate ? "mask-now" : seen ? "mask-in" : undefined}>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className="mask-word" style={{ "--i": i } as React.CSSProperties}><span>{w}</span></span>{" "}
        </span>
      ))}
    </span>
  );
}
