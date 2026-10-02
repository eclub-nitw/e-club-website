"use client";
import { useEffect, useRef } from "react";
import { copy } from "@/data/copy";
import { Art } from "@/components/ui/Art";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { H2, Label } from "@/components/ui/Type";

/** The lede lights word by word as it crosses the viewport (CSS does the opacity from --p; see .word-light). */
function WordLight({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, on = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(3));
    };
    const tick = () => { if (!raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting === on) return; on = e.isIntersecting;
      if (on) { window.addEventListener("scroll", tick, { passive: true }); update(); } else window.removeEventListener("scroll", tick);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("scroll", tick); };
  }, []);
  return (
    <p ref={ref} className="word-light t-lede max-w-[30ch]" style={{ "--n": words.length } as React.CSSProperties}>
      {words.map((w, i) => <span key={i} className="w" style={{ "--i": i } as React.CSSProperties}>{w}{" "}</span>)}
    </p>
  );
}

/** Chapter "Who we are": paper, short, the lede lights up with scroll, a ghost word behind and a generated-art plate that drifts (<= 12%). */
export function About({ number }: { number: string }) {
  return (
    <Section id="about" number={number} title="About" tone="paper" bare className="isolate overflow-hidden py-24 md:py-36">
      <p aria-hidden="true" data-word="WHO" className="t-ghost absolute -right-[0.04em] top-4 -z-10 text-club-ink" />
      <Container>
        <Label className="border-t border-line pt-4">{number} — About</Label>
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20">
          <div>
            <H2 id="about-h" className="max-w-[18ch]">{copy.about.title}</H2>
            <p className="t-body mt-4">{copy.about.line}</p>
            <div className="mt-10"><WordLight text={copy.about.lede} /></div>
            <div className="mt-10"><Button href="/about" variant="link">More about the club →</Button></div>
          </div>
          <div className="crop relative aspect-[4/5] overflow-hidden rounded-[2px] bg-club-ink lg:max-w-md lg:justify-self-end">
            <div className="parallax-photo absolute inset-0"><Art name="network-city" sizes="(min-width: 1024px) 28rem, 90vw" className="size-full object-cover" /></div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
