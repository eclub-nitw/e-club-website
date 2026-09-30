"use client";
import { useEffect, useRef } from "react";
import { armWhenReady } from "@/lib/arm";

/**
 * Events rail. Children are server-rendered <li> cards. On desktop the rail pins and slides sideways as you scroll
 * (ScrollTrigger, lazy); everywhere else (and under reduced motion) it is a native, swipeable scroll-snap row.
 */
export function EventsRail({ children }: { children: React.ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const f = frame.current, t = track.current;
    if (!f || !t || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let teardown = () => {};
    const arm = async () => {
      const { gsap, ScrollTrigger } = await import("@/lib/gsap");
      if (cancelled) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const dist = () => Math.max(0, t.scrollWidth - f.clientWidth);
        if (dist() === 0) return;
        f.style.overflow = "hidden";
        t.style.overflow = "visible";
        gsap.to(t, {
          x: () => -dist(), ease: "none",
          scrollTrigger: { trigger: f, start: "center center", end: () => `+=${dist()}`, scrub: true, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        return () => { f.style.overflow = ""; t.style.overflow = ""; };
      });
      void document.fonts.ready.then(() => ScrollTrigger.refresh());
      teardown = () => mm.revert();
    };
    const stop = armWhenReady(f, () => { void arm(); });
    return () => {
      cancelled = true;
      stop();
      teardown();
    };
  }, []);

  return (
    <div ref={frame}>
      <ul ref={track} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:snap-none lg:overflow-visible lg:pb-0">
        {children}
      </ul>
    </div>
  );
}
