"use client";
import { useEffect, useRef } from "react";

/**
 * Manifesto: words light up as you scroll. On desktop the section pins while it happens; on touch it just scrubs.
 * All text is in the DOM at full opacity until the (lazy) GSAP scene arms, and under reduced motion it stays that way.
 */
export function Manifesto({ text }: { text: string }) {
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
      const words = p.querySelectorAll("[data-w]");
      const mm = gsap.matchMedia();
      const light = (pin: boolean) => {
        gsap.fromTo(words, { opacity: 0.16 }, {
          opacity: 1, ease: "none", stagger: 0.1,
          scrollTrigger: pin
            ? { trigger: root, start: "top top", end: "+=110%", scrub: true, pin: true, anticipatePin: 1 }
            : { trigger: p, start: "top 82%", end: "bottom 50%", scrub: true },
        });
      };
      mm.add("(min-width: 1024px)", () => light(true));
      mm.add("(max-width: 1023px)", () => light(false));
      void document.fonts.ready.then(() => ScrollTrigger.refresh());
      teardown = () => mm.revert();
    };
    const idle = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(arm) : window.setTimeout(arm, 200);
    return () => {
      cancelled = true;
      if (typeof window.requestIdleCallback === "function") window.cancelIdleCallback(idle); else window.clearTimeout(idle);
      teardown();
    };
  }, []);

  return (
    <div ref={section} className="flex min-h-[70svh] items-center lg:min-h-svh">
      <p ref={copy} className="max-w-[24ch] font-display text-[clamp(1.9rem,5vw,4.5rem)] font-semibold leading-[1.08] tracking-tight md:max-w-[30ch]">
        {text.split(" ").map((w, i) => <span key={i} data-w>{w} </span>)}
      </p>
    </div>
  );
}
