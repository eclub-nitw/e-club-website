"use client";
import { useEffect, useRef } from "react";

/** Clip-path reveal (inset 100% to 0) once, when scrolled into view. Content is fully visible without JS (see `.reveal-img`). */
export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } }, { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal-img ${className}`}>{children}</div>;
}
