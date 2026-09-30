"use client";
import { useEffect, useRef } from "react";
import { armWhenReady } from "@/lib/arm";

/**
 * Manifesto: words light up as you scroll. On desktop the section pins while it happens; on touch it just scrubs.
 * Contrast holds in every state: the base text is always the muted token (passes AA), and a lit copy of each word
 * (aria-hidden, opacity only) fades in over it. The lit copy starts hidden in CSS (`.manifesto-lit`), so nothing flashes when the
 * lazy GSAP scene arms; under reduced motion it is simply shown.
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
      const words = p.querySelectorAll("[data-lit]");
      const mm = gsap.matchMedia();
      const light = (pin: boolean) => {
        gsap.fromTo(words, { opacity: 0 }, {
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
    const stop = armWhenReady(root, () => { void arm(); });
    return () => {
      cancelled = true;
      stop();
      teardown();
    };
  }, []);

  return (
    <div ref={section} className="flex min-h-[70svh] items-center lg:min-h-svh">
      <p ref={copy} className="max-w-[24ch] font-display text-[clamp(1.9rem,5vw,4.5rem)] font-semibold leading-[1.08] tracking-tight md:max-w-[30ch]">
        {text.split(" ").map((w, i) => (
          <span key={i} className="relative inline-block whitespace-pre text-muted">
            {w}{" "}
            <span data-lit aria-hidden="true" className="manifesto-lit absolute inset-0 text-fg">{w}{" "}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
