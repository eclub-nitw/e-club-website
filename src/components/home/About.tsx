import { copy } from "@/data/copy";
import { Art } from "@/components/ui/Art";
import { Button } from "@/components/ui/Button";
import { MaskedText } from "@/components/ui/MaskedText";
import { QuoteBand } from "@/components/ui/QuoteBand";
import { Section } from "@/components/ui/Section";
import { Lede } from "@/components/ui/Type";

/**
 * Chapter "Who we are": paper. One paragraph (its words rise through masks once, on entering the viewport), a link to the full story on /about,
 * a generated-art plate, and the club's four-word line set large underneath. Everything deeper lives on /about.
 */
export function About({ number }: { number: string }) {
  return (
    <Section id="about" number={number} title="About" heading={copy.about.title} line={copy.about.line} tone="paper" className="isolate overflow-hidden">
      <p aria-hidden="true" data-word="WHO" className="t-ghost absolute -right-[0.04em] top-4 -z-10 text-club-ink" />
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20">
        <div>
          <Lede className="max-w-[30ch]"><MaskedText text={copy.about.lede} /></Lede>
          <div className="mt-8"><Button href="/about" variant="link">More about the club →</Button></div>
        </div>
        <div className="crop relative aspect-[4/3] overflow-hidden rounded-[2px] bg-club-ink lg:max-w-md lg:justify-self-end">
          <div className="parallax-photo absolute inset-0"><Art name="network-city" sizes="(min-width: 1024px) 28rem, 90vw" className="size-full object-cover" /></div>
        </div>
      </div>
      <QuoteBand className="mt-[var(--section-y)]" />
    </Section>
  );
}
