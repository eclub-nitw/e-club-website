import Link from "next/link";
import type { ClubEvent } from "@/data/events";
import { copy } from "@/data/copy";
import { fmtRange } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Countdown } from "@/components/ui/Countdown";
import { Section } from "@/components/ui/Section";
import { H1, Label, Lede } from "@/components/ui/Type";
import { LedgerStage } from "./LedgerStage";

/**
 * Chapter 01, the cover slide. The poster (a Blender render of the same scene, its background exactly the page ink) is the LCP image and the fallback for every device that does not run the live scene;
 * when the Rising Ledger loads it fades the poster back to atmosphere. The giant wordmark is decoration (generated content, so no text
 * node to fail contrast): the h1 is the readable line. Bars render in front of the wordmark, so depth comes from the scene, not CSS.
 */
export function Cover({ flagship }: { flagship?: ClubEvent }) {
  return (
    <Section id="cover" number="01" title="Cover" bare className="isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-30 h-full">
        <picture>
          <source media="(max-width: 767px)" type="image/avif" srcSet="/images/art/poster-portrait.avif" />
          <source media="(max-width: 767px)" type="image/webp" srcSet="/images/art/poster-portrait.webp" />
          <source type="image/avif" srcSet="/images/art/poster-1024.avif 1024w, /images/art/poster-1600.avif 1600w" sizes="100vw" />
          <source type="image/webp" srcSet="/images/art/poster-1024.webp 1024w, /images/art/poster-1600.webp 1600w" sizes="100vw" />
          <img src="/images/art/poster-1600.webp" width={1600} height={900} alt="" fetchPriority="high" decoding="async" className="cover-poster size-full object-cover object-right max-md:object-bottom" />
        </picture>
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(0deg,color-mix(in_oklab,var(--bg)_88%,transparent),transparent)] md:hidden" />
      </div>
      <p aria-hidden="true" data-word="E-CLUB" className="t-impact ghost-word pointer-events-none absolute -bottom-[0.06em] left-[-0.02em] -z-20 select-none whitespace-nowrap text-club-paper/[0.14]" />
      <LedgerStage />

      <Container className="flex flex-1 flex-col justify-between pb-8 pt-28 md:pb-12 md:pt-36">
        <ul className="t-label flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-line py-3 text-muted">
          <li>{copy.cover.kicker[0]}</li><li aria-hidden="true" className="h-px w-8 bg-line md:w-16" /><li>{copy.cover.kicker[1]}</li>
        </ul>

        <div className="mt-16 md:mt-24 lg:max-w-[60%]">
          <H1><span className="w-light">The Entrepreneurship Club of</span> <span className="w-heavy">NIT Warangal</span></H1>
          <Lede className="mt-8 max-w-[24ch] text-body">{copy.cover.lede[0]}</Lede>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href="/events">See our events</Button>
            <Button href="/join" variant="secondary">Join the club</Button>
          </div>
        </div>

        {flagship && (
          <div className="mt-16 grid items-end gap-5 border-t border-line pt-4 md:mt-20 md:grid-cols-[1fr_auto]">
            <div>
              <Label>Now on · {fmtRange(flagship.dateStart, flagship.dateEnd)}</Label>
              <p className="t-h3 mt-3"><Link href={`/events/${flagship.slug}`} className="underline decoration-line decoration-2 underline-offset-8 hover:decoration-accent">{flagship.title}</Link></p>
            </div>
            <Countdown start={flagship.dateStart} end={flagship.dateEnd} />
          </div>
        )}
      </Container>
    </Section>
  );
}
