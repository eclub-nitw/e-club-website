import type { Metadata } from "next";
import Link from "next/link";
import { sponsors } from "@/data/sponsors";
import { team } from "@/data/team";
import { site } from "@/data/site";
import { fmtRange } from "@/lib/format";
import { isUpcoming, sortedEvents } from "@/lib/events";
import { organizationLd } from "@/lib/jsonld";
import {
  Button, Container, Countdown, EventRow, GrowthLine, HeroBars, JsonLd, LedgerRow, MaskedText, Section, SponsorLogo, TeamMember, Tilt,
} from "@/components/ui";

export const revalidate = 3600; // "upcoming" is decided at render time; refresh hourly

export const metadata: Metadata = {
  title: { absolute: `${site.name} — Entrepreneurship Club, NIT Warangal` },
  alternates: { canonical: "/" },
};

export default function Home() {
  const ordered = sortedEvents();
  const flagship = ordered.find((e) => e.type === "flagship" && isUpcoming(e));
  const listed = sponsors.filter((s) => s.consent);
  const shownTeam = team.filter((m) => m.group === "Core").slice(0, 4);

  // Sections after the hero alternate paper / ink; optional ones are skipped without breaking the rhythm.
  let n = 0;
  const next = () => ({ number: String(++n).padStart(2, "0"), tone: (n % 2 === 1 ? "paper" : "ink") as "paper" | "ink" });

  return (
    <>
      <JsonLd data={organizationLd()} />

      <section className="relative overflow-hidden bg-bg pb-16 pt-32 text-fg md:pb-24 md:pt-40">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">Entrepreneurship Club · NIT Warangal</p>
            <h1 className="mt-6 font-display text-[clamp(2rem,9vw,6.5rem)] md:text-[clamp(3rem,7.2vw,6.5rem)] font-semibold leading-[0.96] tracking-tight">
              <MaskedText text="The Entrepreneurship Club of NIT Warangal." immediate />
            </h1>
            {site.tagline && <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-muted md:text-xl">{site.tagline}</p>}
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/events">See our events</Button>
              <Button href="/join" variant="secondary">Join the club</Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end"><HeroBars /></div>
        </Container>

        {flagship && (
          <Container className="mt-14 md:mt-20">
            <div className="grid gap-6 border-t border-line pt-6 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-link">Now on · Flagship</p>
                <p className="mt-3 font-display text-3xl font-medium md:text-4xl">
                  <Link href={`/events/${flagship.slug}`} className="underline decoration-line decoration-2 underline-offset-8 hover:decoration-accent">{flagship.title}</Link>
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.08em] text-muted">{fmtRange(flagship.dateStart, flagship.dateEnd)}</p>
              </div>
              <Countdown start={flagship.dateStart} end={flagship.dateEnd} />
            </div>
          </Container>
        )}
      </section>

      <GrowthLine>
        {(() => {
          const s = next();
          return (
            <Section id="events" number={s.number} title="Events" tone={s.tone}>
              {ordered.length ? (
                <>
                  <ul className="border-b border-line">
                    {ordered.slice(0, 6).map((e) => <li key={e.slug}><EventRow event={e} upcoming={isUpcoming(e)} /></li>)}
                  </ul>
                  <div className="mt-8"><Button href="/events" variant="link">All events and the archive →</Button></div>
                </>
              ) : (
                <p className="max-w-[52ch] text-lg text-muted">Events will be listed here as soon as the club publishes them.</p>
              )}
            </Section>
          );
        })()}

        {flagship && (() => {
          const s = next();
          return (
            <Section id="flagship" number={s.number} title="The flagship" tone={s.tone}>
              <Tilt className="border border-line bg-surface p-6 md:p-10">
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{fmtRange(flagship.dateStart, flagship.dateEnd)}</p>
                <h3 className="mt-4 font-display text-4xl font-semibold leading-none tracking-tight md:text-7xl">{flagship.title}</h3>
                <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted">{flagship.summary}</p>
                <dl className="mt-8 max-w-2xl"><LedgerRow label="Venue">{flagship.venue}</LedgerRow></dl>
                <div className="mt-8 flex flex-wrap gap-3">
                  {flagship.registerUrl && <Button href={flagship.registerUrl}>Register on Unstop</Button>}
                  <Button href={`/events/${flagship.slug}`} variant="secondary">Event details</Button>
                </div>
              </Tilt>
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
