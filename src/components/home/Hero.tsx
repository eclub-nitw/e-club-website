import { copy } from "@/data/copy";
import { site } from "@/data/site";
import { currentPhase } from "@/lib/phase";
import { spotlightIsVisible } from "@/lib/spotlight";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { H1 } from "@/components/ui/Type";
import { LedgerStage } from "./LedgerStage";
import { SpotlightChip } from "./SpotlightChip";

/**
 * Chapter 01. The poster (a Blender render of the same scene, its background exactly the page ink) is the LCP image and the fallback for
 * every device that does not run the live scene; when the Rising Ledger loads it fades the poster out. The wordmark behind is a ghost
 * (generated content, 7% opacity). One focal point: the h1. The club leads; the season's spotlight is one small chip under the buttons.
 */
export function Hero({ number }: { number: string }) {
  const phase = currentPhase();
  return (
    <Section id="hero" number={number} title="E-Club NIT Warangal" bare gapOk className="isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-30 h-full">
        <picture>
          <source media="(max-width: 1023px)" type="image/avif" srcSet="/images/art/poster-portrait.avif" />
          <source media="(max-width: 1023px)" type="image/webp" srcSet="/images/art/poster-portrait.webp" />
          <source type="image/avif" srcSet="/images/art/poster-1024.avif 1024w, /images/art/poster-1600.avif 1600w" sizes="100vw" />
          <source type="image/webp" srcSet="/images/art/poster-1024.webp 1024w, /images/art/poster-1600.webp 1600w" sizes="100vw" />
          <img src="/images/art/poster-1600.webp" width={1600} height={900} alt="" fetchPriority="high" decoding="async" className="cover-poster size-full object-cover object-right max-lg:object-bottom" />
        </picture>
      </div>
      <p aria-hidden="true" data-word="E-CLUB" className="t-ghost absolute -bottom-[0.06em] left-[-0.02em] -z-20 text-club-paper" />
      <LedgerStage />

      <Container className="flex flex-1 flex-col justify-between pb-24 pt-28 md:pb-16 md:pt-36">
        <ul className="t-label flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-line py-3 text-muted">
          <li>{copy.hero.label}</li><li aria-hidden="true" className="h-px w-8 bg-line md:w-16" /><li>{site.address.locality}, {site.address.region}</li>
        </ul>

        <div className="mt-16 lg:mt-20 lg:max-w-[52%]">
          <H1><span className="w-heavy">E-Club</span> <span className="w-light">NIT Warangal</span></H1>
          <p className="t-lede-xl mt-6 max-w-[16ch] text-body">{site.quote.line}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href="/initiatives">Explore initiatives</Button>
            <Button href="/contact" variant="secondary">Get in touch</Button>
          </div>
          <SpotlightChip initial={phase} visible={spotlightIsVisible()} />
        </div>

        <div aria-hidden="true" className="min-h-[24svh] lg:min-h-[10svh]" />
      </Container>
    </Section>
  );
}
