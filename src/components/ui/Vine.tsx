"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const STEM = "M21.6 -5.6L25.6 18.1L27.8 40.9L28.4 63.3L27.8 85.2L26.5 106.7L24.8 127.8L23.0 148.7L21.6 169.3L20.8 189.7L21.1 209.9L22.9 230.1L26.5 250.3L29.6 270.3L31.3 290.3L31.7 310.5L31.1 331.1L29.8 352.1L28.1 373.7L26.3 395.9L24.6 418.8L23.4 442.6L22.9 467.3L23.5 493.1L25.3 520.0L26.7 520.0L25.0 493.1L24.7 467.4L25.3 442.7L26.7 419.0L28.5 396.0L30.4 373.8L32.3 352.2L33.7 331.2L34.4 310.4L34.2 290.0L32.6 269.8L29.5 249.7L26.2 229.9L24.5 209.9L24.4 189.8L25.2 169.5L26.8 149.0L28.7 128.2L30.6 107.0L32.0 85.3L32.7 63.2L32.2 40.5L30.2 17.3L26.4 -6.4Z";
const LEAF = "M0 0C5-7 14-9 22-2C14 5 6 5 0 0Z";
// Five mirrored leaf pairs at a constant interval along the stem: [x, y, stem angle in degrees, scale]. Geometry from docs/handoff/v7/vine-geometry.mjs.
const PAIRS = [[30.4, 67.5, 91.6, 0.85], [24.7, 151.7, 94.2, 0.79], [25.5, 235.9, 80.1, 0.73], [32.7, 319.8, 91.8, 0.67], [26.8, 404, 94.3, 0.61]] as const;
const SPREAD = 54.4; // each leaf leaves the stem this many degrees to either side of its direction, so the pair is a mirror image about the stem

/**
 * The vine: hangs from the top-left corner of the viewport on wide screens, grows downward as the page is read (CSS scroll-driven animation
 * where supported, so no script runs while scrolling), opens once on load, and sways +-2 degrees at rest. Where scroll timelines are missing, an
 * IntersectionObserver steps it forward one chapter at a time (no per-frame work). The orange bud at the tip swells into a coin at the flagship
 * chapter. Decorative: aria-hidden, no pointer events, one SVG of 34 nodes. Our own drawing; the choice between three candidates is in docs/handoff/BUILD-LOG-V7.
 */
export function Vine() {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const sections = [...document.querySelectorAll<HTMLElement>("main [data-section]")];
    const flagship = document.getElementById("flagship");
    const ios: IntersectionObserver[] = [];
    if (flagship) {
      const bud = new IntersectionObserver(([e]) => { el.dataset.bud = String(e.isIntersecting); }, { rootMargin: "-30% 0px -30% 0px" });
      bud.observe(flagship); ios.push(bud);
    }
    if (!CSS.supports("animation-timeline: scroll()") && sections.length) {
      el.dataset.step = "";
      const step = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) {
          const k = (sections.indexOf(e.target as HTMLElement) + 1) / sections.length;
          el.style.setProperty("--g", k.toFixed(3));
          el.style.setProperty("--stage", (k * 5).toFixed(2));
        }
      }, { rootMargin: "-30% 0px -60% 0px" });
      sections.forEach((s) => step.observe(s)); ios.push(step);
    }
    return () => ios.forEach((io) => io.disconnect());
  }, [pathname]);

  return (
    <div ref={root} aria-hidden="true" className="vine pointer-events-none fixed left-0 top-0 z-[1] hidden min-[1100px]:block">
      <svg viewBox="0 0 64 560" fill="none" className="block h-[min(80svh,560px)] w-auto">
        <g className="vstem"><path d={STEM} fill="var(--color-club-teal)" /></g>
        {PAIRS.map(([x, y, a, s], j) => (
          <g key={j} transform={`translate(${x} ${y}) scale(${s})`}>
            <g className="vgrow" data-j={j} style={{ "--j": j } as React.CSSProperties}>
              <g className="vunfurl" style={{ animationDelay: `${400 + j * 140}ms` }}>
                <g className="vsway" style={{ animationDelay: `${-j * 0.7}s` }}>
                  <path d={LEAF} transform={`rotate(${(a - SPREAD).toFixed(1)})`} fill="var(--color-club-cyan)" />
                  <path d={LEAF} transform={`rotate(${(a + SPREAD).toFixed(1)}) scale(1 -1)`} fill="var(--color-club-cyan)" />
                </g>
              </g>
            </g>
          </g>
        ))}
        <g className="vtip"><g className="vbud"><circle cx={26} cy={526} r={5} fill="var(--accent)" /><circle cx={26} cy={526} r={9} fill="none" stroke="var(--accent)" strokeWidth={1.2} className="vring" /></g></g>
      </svg>
    </div>
  );
}
