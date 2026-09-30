"use client";
import { useRef } from "react";
import { useInView } from "motion/react";

/**
 * Masked word-by-word reveal. `immediate` plays on load (above the fold, pure CSS keyframes);
 * otherwise plays once when scrolled into view. Text is always in the DOM for SEO/screen readers.
 */
export function MaskedText({ text, immediate = false }: { text: string; immediate?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <span ref={ref} className={immediate ? "mask-now" : seen ? "mask-in" : undefined}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="mask-word" style={{ "--i": i } as React.CSSProperties}>
          <span>{w}</span>{" "}
        </span>
      ))}
    </span>
  );
}
