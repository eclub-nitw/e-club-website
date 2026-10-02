"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useChapter } from "@/lib/hooks";

const MAX_LEAVES = 12;
const STEM = "M30 392 C 24 340, 38 300, 30 250 S 22 150, 30 24";
const leafPath = (side: 1 | -1) => `M0 0 C ${side * 10} -15, ${side * 26} -15, ${side * 30} -3 C ${side * 20} 7, ${side * 8} 7, 0 0Z`;

/**
 * The venture tree: a sapling drawn in SVG that doubles as the chapter counter. The stem draws with page scroll (stroke-dashoffset),
 * a leaf unfurls for each chapter you reach, a small orange coin-bud opens at the flagship chapter, and at the last chapter the
 * sapling grows branches and becomes a small tree. Desktop: left rail. Smaller screens: a slim top bar with the sapling riding it.
 * Decorative (aria-hidden); transform, opacity and stroke-dashoffset only; fixed, so no layout shift. Our own drawing.
 */
export function VentureTree() {
  const pathname = usePathname();
  const chapter = useChapter(pathname);
  const root = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false); // the footer is not a chapter, so the tree also grows once the page is read to its end

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      root.current?.style.setProperty("--pp", p.toFixed(4));
      setAtEnd(p > 0.97);
    };
    const tick = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", tick); window.removeEventListener("resize", tick); };
  }, [pathname]);

  const total = Math.min(MAX_LEAVES, chapter?.total ?? 0);
  const at = chapter?.index ?? -1;
  const last = atEnd || (!!chapter && chapter.total > 1 && chapter.index === chapter.total - 1);
  const bud = !!chapter && chapter.id === "flagship";
  // chapters beyond the leaf budget share the last leaves
  const reached = total === 0 ? -1 : Math.min(total - 1, Math.round((at / Math.max(1, (chapter?.total ?? 1) - 1)) * (total - 1)));

  return (
    <div ref={root} aria-hidden="true" data-bud={bud} data-tree={last} className="vtree pointer-events-none fixed z-[40]">
      {/* wide screens: left rail */}
      <svg viewBox="0 0 60 400" className="fixed left-2 top-1/2 hidden h-[min(58vh,30rem)] w-auto -translate-y-1/2 overflow-visible xl:block" fill="none">
        <path d={STEM} pathLength={1} className="stem" stroke="var(--color-club-cyan)" strokeWidth={2} strokeLinecap="round" />
        {Array.from({ length: total }, (_, i) => {
          const y = 372 - ((i + 1) / (total + 1)) * 340, side = i % 2 ? -1 : 1;
          return (
            <g key={i} transform={`translate(30 ${y.toFixed(1)})`}>
              <path d={leafPath(side as 1 | -1)} className="leaf" data-on={i <= reached} fill="var(--color-club-cyan)" opacity={0.9} />
            </g>
          );
        })}
        <g className="branch"><path d="M30 120 C 14 104, 6 96, 4 80 M30 150 C 46 132, 54 122, 56 104 M30 90 C 22 70, 24 56, 34 44" stroke="var(--color-club-cyan)" strokeWidth={2} strokeLinecap="round" /></g>
        <g className="bud" transform="translate(30 20)"><circle r={7} fill="var(--accent)" /><circle r={3.5} fill="none" stroke="var(--accent-fg)" strokeWidth={1} /></g>
      </svg>
      {/* narrower screens: top bar, the sapling rides the end of the line */}
      <div className="fixed inset-x-0 top-0 h-[3px] xl:hidden">
        <span className="block size-full origin-left bg-accent" style={{ transform: "scaleX(var(--pp))" }} />
        <svg viewBox="0 0 16 16" width="12" height="12" className="absolute left-0 top-[3px]" style={{ transform: "translateX(calc(var(--pp) * (100vw - 14px)))" }} fill="none">
          <path d="M8 15V7" stroke="var(--color-club-cyan)" strokeWidth={1.6} strokeLinecap="round" />
          <path d="M8 8C8 3 12 2 15 3C15 7 12 9 8 8Z" fill="var(--color-club-cyan)" />
          <path d="M8 10C8 6 5 5 1 6C1 9 4 11 8 10Z" fill="var(--color-club-cyan)" />
        </svg>
      </div>
    </div>
  );
}
