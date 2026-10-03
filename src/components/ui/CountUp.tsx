"use client";
import { useEffect, useRef, useState } from "react";

const PARTS = /^(\D*)(\d[\d,]*)(\D*)$/; // digits only in the middle: ranges and years stay as written

/** Counts a verified number up once when it enters the viewport (900ms). Server HTML and reduced motion show the final value. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const m = /^\d{4}$/.test(value) ? null : PARTS.exec(value);
  const target = m ? Number(m[2].replace(/,/g, "")) : NaN;
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || Number.isNaN(target) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / 900);
        setShown(Math.round(target * (1 - Math.pow(1 - p, 4)))); // power4.out
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target]);

  if (!m || shown === null) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{m[1]}{shown.toLocaleString("en-IN")}{m[3]}</span>;
}
