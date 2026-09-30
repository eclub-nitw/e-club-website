import type { Metadata } from "next";
import Link from "next/link";
import { copy } from "@/data/copy";
import { events } from "@/data/events";
import { sponsors } from "@/data/sponsors";
import { team } from "@/data/team";
import { site } from "@/data/site";
import { fmtRange } from "@/lib/format";
import { isUpcoming, sortedEvents } from "@/lib/events";
import { diveFile, caption, withRole } from "@/lib/photos";
import { organizationLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { Ticker } from "@/components/ui/Ticker";
import { GrowthLine } from "@/components/ui/GrowthLine";
import { JsonLd } from "@/components/ui/JsonLd";
import { LedgerRow } from "@/components/ui/LedgerRow";
import { Manifesto } from "@/components/ui/Manifesto";
import { StatNumber } from "@/components/ui/StatNumber";
import { Section } from "@/components/ui/Section";
import { SponsorLogo } from "@/components/ui/SponsorLogo";
import { TeamMember } from "@/components/ui/TeamMember";
import { Hero } from "@/components/home/Hero";
import { Dive } from "@/components/home/Dive";
import { MomentsRail } from "@/components/home/MomentsRail";
import { PartnerMarquee } from "@/components/home/PartnerMarquee";
import { ArchiveLedger } from "@/components/home/ArchiveLedger";
import { VortexPortal } from "@/components/three/VortexPortal";

export const revalidate = 3600; // "upcoming" is decided at render time; refresh hourly

export const metadata: Metadata = {
  title: { absolute: `${site.name} — Entrepreneurship Club, NIT Warangal` },
  alternates: { canonical: "/" },
};

export default function Home() {
  const ordered = sortedEvents();
  const flagship = ordered.find((e) => e.type === "flagship" && isUpcoming(e));
  const listed = sponsors.filter((s) => s.consent);
  const stats = [...copy.facts, ...events.flatMap((e) => e.stats ?? [])];
  const shownTeam = team.filter((m) => m.group === "Core").slice(0, 4);
  const frames = withRole("dive").map((p) => ({ id: p.id, src: diveFile(p.id), alt: p.alt, caption: caption(p) }));

  // Sections after the Dive alternate ink / paper; optional ones are skipped without breaking the rhythm.
  let n = 3;
  const next = () => ({ number: String(++n).padStart(2, "0"), tone: (n % 2 === 1 ? "ink" : "paper") as "ink" | "paper" });

  return (
    <>
      <JsonLd data={organizationLd()} />
      <Hero flagship={flagship} />
      <Ticker items={["Entrepreneurship Club", "NIT Warangal", ...(flagship ? [flagship.title] : [])]} />
      <Dive frames={frames} />

      <GrowthLine>
        <Section id="manifesto" number="03" title="Who we are" tone="ink" className="!py-0">
          <Manifesto lines={copy.manifestoLines} />
        </Section>

        {(() => { const s = next(); return (
          <Section id="numbers" number={s.number} title="In numbers" tone={s.tone}>
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
              {stats.map((st) => <StatNumber key={st.label} value={st.value} label={st.label} source={st.source} />)}
            </div>
          </Section>
        ); })()}

        {(() => { const s = next(); return (
          <Section id="moments" number={s.number} title="Moments" tone={s.tone}>
            <MomentsRail />
          </Section>
        ); })()}

        {(() => { const s = next(); return (
          <Section id="events" number={s.number} title="Events" tone={s.tone}>
            <ArchiveLedger flagship={flagship} />
            <div className="mt-8"><Button href="/events" variant="link">All events and the archive →</Button></div>
          </Section>
        ); })()}

        {flagship && (() => { const s = next(); return (
          <Section id="flagship" number={s.number} title="The flagship" tone={s.tone}>
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <p className="label text-muted">{fmtRange(flagship.dateStart, flagship.dateEnd)}</p>
                <h3 className="h1-xl up mt-4 text-[clamp(3rem,8vw,8rem)]">{flagship.title}</h3>
                <p className="tabular mt-8 font-display text-[clamp(3.5rem,9vw,9rem)] font-extrabold leading-none tracking-[0.01em] text-accent">₹50,000</p>
                <p className="label mt-2 text-muted">Prize pool</p>
                <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-muted">{flagship.summary}</p>
                <div className="mt-8"><Countdown start={flagship.dateStart} end={flagship.dateEnd} /></div>
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
        ); })()}

        {listed.length > 0 && (() => { const s = next(); return (
          <Section id="partners" number={s.number} title="Partners" tone={s.tone}>
            <PartnerMarquee>{listed.map((p) => <li key={p.name}><SponsorLogo sponsor={p} /></li>)}</PartnerMarquee>
            <p className="mt-8 max-w-[60ch] text-sm text-muted">Names and logos belong to their owners; see our <Link href="/disclaimer" className="text-link underline underline-offset-4">disclaimer</Link>.</p>
          </Section>
        ); })()}

        {shownTeam.length > 0 && (() => { const s = next(); return (
          <Section id="team" number={s.number} title="The team" tone={s.tone}>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{shownTeam.map((m) => <TeamMember key={m.name} member={m} />)}</ul>
            <div className="mt-10"><Button href="/team" variant="link">Meet everyone →</Button></div>
          </Section>
        ); })()}

        {(() => { const s = next(); return (
          <Section id="get-involved" number={s.number} title="Get involved" tone={s.tone}>
            <ul className="border-b border-line">
              {[
                { href: "/join", title: "Join the club", text: "Recruitment details and how to apply." },
                { href: "/sponsors", title: "Partner with us", text: "Sponsor or collaborate on an event." },
                { href: "/contact", title: "Say hello", text: site.email },
              ].map((r) => (
                <li key={r.href}>
                  <Link href={r.href} data-cursor="OPEN" className="ledger-row group grid min-h-28 items-baseline gap-2 border-t border-line py-6 md:grid-cols-[1.4fr_1fr_2rem] md:gap-8">
                    <span className="font-display text-[clamp(2.25rem,7vw,7rem)] font-extrabold uppercase leading-[0.95] tracking-[0.01em]">{r.title}</span>
                    <span className="text-muted">{r.text}</span>
                    <span aria-hidden className="hidden transition-transform duration-200 group-hover:translate-x-1 md:block">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        ); })()}
      </GrowthLine>
    </>
  );
}
