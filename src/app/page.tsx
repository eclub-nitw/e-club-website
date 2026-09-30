import type { Metadata } from "next";
import { getImageProps } from "next/image";
import Image from "next/image";
import Link from "next/link";
import { about } from "@/data/about";
import { events } from "@/data/events";
import { sponsors } from "@/data/sponsors";
import { team } from "@/data/team";
import { site } from "@/data/site";
import { fmtRange } from "@/lib/format";
import { isUpcoming, sortedEvents } from "@/lib/events";
import { organizationLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Countdown } from "@/components/ui/Countdown";
import { Ticker } from "@/components/ui/Ticker";
import { EventRow } from "@/components/ui/EventRow";
import { GrowthLine } from "@/components/ui/GrowthLine";
import { JsonLd } from "@/components/ui/JsonLd";
import { LedgerRow } from "@/components/ui/LedgerRow";
import { MaskedText } from "@/components/ui/MaskedText";
import { Manifesto } from "@/components/ui/Manifesto";
import { EventCard } from "@/components/ui/EventCard";
import { EventsRail } from "@/components/ui/EventsRail";
import { StatNumber } from "@/components/ui/StatNumber";
import { Section } from "@/components/ui/Section";
import { SponsorLogo } from "@/components/ui/SponsorLogo";
import { TeamMember } from "@/components/ui/TeamMember";

import { SceneLoader } from "@/components/three/SceneLoader";
import { VortexPortal } from "@/components/three/VortexPortal";
import pitchStage from "../../public/images/generated/pitch-stage.webp";
import heroPoster from "../../public/images/generated/hero-scene.webp";
import heroPosterPortrait from "../../public/images/generated/hero-scene-portrait.webp";

export const revalidate = 3600; // "upcoming" is decided at render time; refresh hourly

export const metadata: Metadata = {
  title: { absolute: `${site.name} — Entrepreneurship Club, NIT Warangal` },
  alternates: { canonical: "/" },
};

// Art direction: the wide render for landscape, a portrait render (bars lifted above the title) for phones.
const posterArgs = { alt: "", fill: true, priority: true, sizes: "100vw", placeholder: "blur" } as const;
const posterWide = getImageProps({ ...posterArgs, src: heroPoster }).props.srcSet;
const { srcSet: posterNarrowSet, ...posterNarrowRest } = getImageProps({ ...posterArgs, src: heroPosterPortrait }).props;
const posterNarrow = { ...posterNarrowRest, srcSet: posterNarrowSet, fetchPriority: "high" as const };

export default function Home() {
  const ordered = sortedEvents();
  const flagship = ordered.find((e) => e.type === "flagship" && isUpcoming(e));
  const listed = sponsors.filter((s) => s.consent);
  const stats = events.flatMap((e) => (e.stats ?? []).map((st) => ({ ...st, event: e.title }))); // verified only: each carries its source
  const shownTeam = team.filter((m) => m.group === "Core").slice(0, 4);

  // Sections after the hero alternate paper / ink; optional ones are skipped without breaking the rhythm.
  let n = 0;
  const next = () => ({ number: String(++n).padStart(2, "0"), tone: (n % 2 === 1 ? "paper" : "ink") as "paper" | "ink" });

  return (
    <>
      <JsonLd data={organizationLd()} />

      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-bg text-fg">
        {/* The poster is the LCP element: priority, fixed-height box, blur placeholder, decorative (alt empty).
            The box is 92svh, never 100%: Chrome ignores an image covering the whole viewport as an LCP candidate. */}
        <div aria-hidden className="absolute inset-x-0 top-0 -z-20 h-[92svh]">
          <picture>
            <source media="(min-width: 768px)" srcSet={posterWide} />
            <img {...posterNarrow} alt="" className="absolute inset-0 size-full object-cover" />
          </picture>
          <SceneLoader />
          <div className="hero-scrim absolute inset-0" />
        </div>
        <Container className="pb-10 pt-32 md:pb-14 md:pt-40">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">Entrepreneurship Club · NIT Warangal</p>
          <h1 className="mt-6 max-w-[13ch] font-display text-[clamp(2.75rem,7.4vw,7.5rem)] font-semibold leading-[0.94] tracking-tight lg:max-w-[12ch]">
            <MaskedText text="The Entrepreneurship Club of NIT Warangal." immediate />
          </h1>
          {site.tagline && <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-muted md:text-xl">{site.tagline}</p>}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href="/events">See our events</Button>
            <Button href="/join" variant="secondary">Join the club</Button>
          </div>
          {flagship && (
            <div className="mt-14 grid gap-6 border-t border-line pt-6 md:mt-20 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-link">Now on · Flagship</p>
                <p className="mt-3 font-display text-3xl font-medium md:text-4xl">
                  <Link href={`/events/${flagship.slug}`} className="underline decoration-line decoration-2 underline-offset-8 hover:decoration-accent">{flagship.title}</Link>
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.08em] text-muted">{fmtRange(flagship.dateStart, flagship.dateEnd)}</p>
              </div>
              <Countdown start={flagship.dateStart} end={flagship.dateEnd} />
            </div>
          )}
        </Container>
      </section>

      <Ticker items={["Entrepreneurship Club", "NIT Warangal", ...(flagship ? [flagship.title] : [])]} />

      <GrowthLine>
        {about.manifesto && (() => {
          const s = next();
          return (
            <Section id="manifesto" number={s.number} title="Who we are" tone={s.tone}>
              <Manifesto text={about.manifesto} />
            </Section>
          );
        })()}

        {flagship && (() => {
          const s = next();
          return (
            <Section id="flagship" number={s.number} title="The flagship" tone={s.tone}>
              <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{fmtRange(flagship.dateStart, flagship.dateEnd)}</p>
                  <h3 className="mt-4 font-display text-[clamp(2.5rem,6.5vw,6rem)] font-semibold leading-[0.95] tracking-tight">{flagship.title}</h3>
                  <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">{flagship.summary}</p>
                  <dl className="mt-8 max-w-xl"><LedgerRow label="Venue">{flagship.venue}</LedgerRow></dl>
                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {flagship.registerUrl && <Button href={flagship.registerUrl}>Register on Unstop</Button>}
                    <Button href={`/events/${flagship.slug}`} variant="secondary">Event details</Button>
                  </div>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <VortexPortal href={`/events/${flagship.slug}`} label={`Enter ${flagship.title}`} />
                </div>
              </div>
            </Section>
          );
        })()}

        {(() => {
          const s = next();
          return (
            <Section id="events" number={s.number} title="Events" tone={s.tone}>
              {ordered.length >= 3 ? (
                <>
                  <EventsRail>{ordered.slice(0, 8).map((e) => <EventCard key={e.slug} event={e} />)}</EventsRail>
                  <div className="mt-8"><Button href="/events" variant="link">All events and the archive →</Button></div>
                </>
              ) : ordered.length ? (
                <>
                  <ul className="border-b border-line">
                    {ordered.map((e) => <li key={e.slug}><EventRow event={e} upcoming={isUpcoming(e)} /></li>)}
                  </ul>
                  <div className="mt-8"><Button href="/events" variant="link">All events and the archive →</Button></div>
                </>
              ) : (
                <div className="grid items-center gap-8 md:grid-cols-[1fr_1fr]">
                  <p className="max-w-[40ch] text-lg text-muted">Events will be listed here as soon as the club publishes them.</p>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[2px] border border-line">
                    <Image src={pitchStage} alt="" fill sizes="(min-width: 768px) 40vw, 92vw" placeholder="blur" className="object-cover" />
                  </div>
                </div>
              )}
            </Section>
          );
        })()}

        {stats.length > 0 && (() => {
          const s = next();
          return (
            <Section id="numbers" number={s.number} title="In numbers" tone={s.tone}>
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((st) => <StatNumber key={`${st.event}-${st.label}`} value={st.value} label={st.label} source={st.source} />)}
              </div>
            </Section>
          );
        })()}

        {listed.length > 0 && (() => {
          const s = next();
          return (
            <Section id="partners" number={s.number} title="Partners" tone={s.tone}>
              <ul className="flex flex-wrap items-center gap-x-10 gap-y-6">{listed.map((p) => <li key={p.name}><SponsorLogo sponsor={p} /></li>)}</ul>
              <p className="mt-8 max-w-[60ch] text-sm text-muted">Names and logos belong to their owners; see our <Link href="/disclaimer" className="text-link underline underline-offset-4">disclaimer</Link>.</p>
            </Section>
          );
        })()}

        {shownTeam.length > 0 && (() => {
          const s = next();
          return (
            <Section id="team" number={s.number} title="The team" tone={s.tone}>
              <ul className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{shownTeam.map((m) => <TeamMember key={m.name} member={m} />)}</ul>
              <div className="mt-10"><Button href="/team" variant="link">Meet everyone →</Button></div>
            </Section>
          );
        })()}

        {(() => {
          const s = next();
          return (
            <Section id="get-involved" number={s.number} title="Get involved" tone={s.tone}>
              <ul className="border-b border-line">
                {[
                  { href: "/join", title: "Join the club", text: "Recruitment details and how to apply." },
                  { href: "/sponsors", title: "Partner with us", text: "Sponsor or collaborate on an event." },
                  { href: "/contact", title: "Say hello", text: site.email },
                ].map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="ledger-row group grid min-h-24 items-baseline gap-2 border-t border-line py-6 md:grid-cols-[1fr_1fr_2rem] md:gap-8">
                      <span className="font-display text-3xl font-medium md:text-5xl">{r.title}</span>
                      <span className="text-muted">{r.text}</span>
                      <span aria-hidden className="hidden transition-transform duration-200 group-hover:translate-x-1 md:block">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          );
        })()}
      </GrowthLine>
    </>
  );
}
