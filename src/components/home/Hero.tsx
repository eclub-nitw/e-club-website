import Link from "next/link";
import type { ClubEvent } from "@/data/events";
import { site } from "@/data/site";
import { fmtRange } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Countdown } from "@/components/ui/Countdown";
import { HoldButton } from "@/components/ui/HoldButton";
import { HeroWordmark } from "./HeroWordmark";

const HERO = "/images/events";
const LIT = "/images/events/club-event-02/02-22-1024.webp"; // the same photograph, ungraded, shown inside the letters

/**
 * Home scene 1. The pre-graded photograph is the LCP element (priority, fixed 92svh box: Chrome ignores an image that covers
 * the whole viewport as an LCP candidate). Mono micro-labels run as thin rules above and below the wordmark.
 */
export function Hero({ flagship }: { flagship?: ClubEvent }) {
  const est = site.foundedYear ? `Est. ${site.foundedYear}` : null;
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bg text-fg">
      <div className="absolute inset-x-0 top-0 -z-20 h-[92svh]">
        <picture>
          <source media="(max-width: 767px)" type="image/avif" srcSet={`${HERO}/hero-portrait.avif`} />
          <source media="(max-width: 767px)" type="image/webp" srcSet={`${HERO}/hero-portrait.webp`} />
          <source type="image/avif" srcSet={`${HERO}/hero-1024.avif 1024w, ${HERO}/hero-1600.avif 1600w`} sizes="100vw" />
          <source type="image/webp" srcSet={`${HERO}/hero-1024.webp 1024w, ${HERO}/hero-1600.webp 1600w`} sizes="100vw" />
          <img
            src={`${HERO}/hero-1600.webp`} width={1600} height={1000} fetchPriority="high" decoding="async"
            alt="Students sit at wooden desks in a classroom at a club event, looking toward a speaker at the front."
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
        <div className="hero-scrim absolute inset-0" />
      </div>

      <Container className="flex flex-1 flex-col justify-between pb-10 pt-24 md:pb-14 md:pt-28">
        <ul className="label flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-line py-3 text-muted">
          <li>NIT Warangal</li><li aria-hidden="true" className="h-px w-8 bg-line md:w-16" />
          <li>Entrepreneurship Club</li>
          {est && <><li aria-hidden="true" className="h-px w-8 bg-line md:w-16" /><li>{est}</li></>}
        </ul>

        <div className="pt-24 md:pt-32">
          <h1 className="m-0">
            <HeroWordmark litSrc={LIT} />
            <span className="sr-only">The Entrepreneurship Club of NIT Warangal</span>
          </h1>
          <p aria-hidden="true" className="mt-6 max-w-[32ch] font-display text-2xl font-semibold leading-tight md:text-4xl">The Entrepreneurship Club of NIT Warangal.</p>
          {site.tagline && <p className="mt-4 max-w-[52ch] text-lg text-muted md:text-xl">{site.tagline}</p>}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Button href="/events">See our events</Button>
            <Button href="/join" variant="secondary">Join the club</Button>
            <div className="ml-auto hidden sm:block"><HoldButton targetId="dive">Hold to dive</HoldButton></div>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <ul className="label flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-muted">
            <li>Scroll, or hold to dive</li>
            {flagship && <><li aria-hidden="true" className="h-px w-8 bg-line md:w-16" /><li>Now on</li><li aria-hidden="true" className="h-px w-8 bg-line md:w-16" /><li>{fmtRange(flagship.dateStart, flagship.dateEnd)}</li></>}
          </ul>
          {flagship && (
            <div className="mt-5 grid items-end gap-5 md:grid-cols-[1fr_auto]">
              <p className="font-display text-2xl font-semibold leading-tight md:text-4xl">
                <Link href={`/events/${flagship.slug}`} className="underline decoration-line decoration-2 underline-offset-8 hover:decoration-accent">{flagship.title}</Link>
              </p>
              <Countdown start={flagship.dateStart} end={flagship.dateEnd} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
