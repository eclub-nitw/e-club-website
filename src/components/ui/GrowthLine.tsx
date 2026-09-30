"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Signature element: a 2px accent line that draws itself down the left rail as the page scrolls.
 * Wrap the content in <GrowthLine>; it is `relative`, the line is absolutely placed, transform-only.
 */
export function GrowthLine({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <div ref={ref} className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-3 hidden w-[2px] bg-line lg:left-6 lg:block xl:left-10">
        <motion.span className="absolute inset-0 origin-top bg-accent" style={{ scaleY: reduce ? 1 : scaleY }} />
      </div>
      {children}
    </div>
  );
}
