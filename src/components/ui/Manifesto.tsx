"use client";
import { useEffect, useRef } from "react";
import { armWhenReady } from "@/lib/arm";
import type { Seg } from "@/data/copy";

/**
 * Manifesto on ink: one declarative line at a time lights up as you scroll (pinned on desktop, scrubbed on touch).
 * Contrast holds in every state: unlit lines are the muted token (7.9:1 on ink), lit lines near-white (14:1), key words ember (7.4:1).
 * The lit layer of each line is aria-hidden, opacity only, and hidden in CSS (`.manifesto-lit`) until the lazy GSAP scene arms;
 * under reduced motion it is simply shown. Text is in the DOM once for assistive tech.
 */
export function Manifesto({ lines }: { lines: Seg[][] }) {
  const section = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = section.current, p = copy.current;
    if (!root || !p || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let teardown = () => {};
    const arm = async () => {
      const { gsap, ScrollTrigger } = await import("@/lib/gsap");
      if (cancelled) return;
      const lit = p.querySelectorAll("[data-lit]");
      const mm = gsap.matchMedia();
      const light = (pin: boolean) => {
        gsap.fromTo(lit, { opacity: 0 }, {
          opacity: 1, ease: "none", stagger: 1,
          scrollTrigger: pin
            ? { trigger: root, start: "top top", end: "+=130%", scrub: true, pin: true, anticipatePin: 1 }
            : { trigger: p, start: "top 80%", end: "bottom 55%", scrub: true },
        });
      };
      mm.add("(min-width: 1024px)", () => light(true));
      mm.add("(max-width: 1023px)", () => light(false));
      void document.fonts.ready.then(() => ScrollTrigger.refresh());
      teardown = () => mm.revert();
    };
    const stop = armWhenReady(root, () => { void arm(); });
    return () => { cancelled = true; stop(); teardown(); };
  }, []);

  const render = (segs: Seg[]) => segs.map((s, i) => typeof s === "string" ? s : <span key={i} className="text-club-ember">{s.em}</span>);
  return (
    <div ref={section} className="flex min-h-[40svh] items-center lg:min-h-[calc(100svh-14rem)]">
      <p ref={copy} className="m-0 font-display text-[clamp(2rem,5.6vw,5.5rem)] font-extrabold uppercase leading-[0.96] tracking-[0.005em]">
        {lines.map((segs, i) => (
          <span key={i} className="relative mb-[0.2em] block text-muted">
            {render(segs)}
            <span data-lit aria-hidden="true" className="manifesto-lit absolute inset-0 text-fg">{render(segs)}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
