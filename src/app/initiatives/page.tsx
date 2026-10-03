import type { Metadata } from "next";
import Link from "next/link";
import { event } from "@/data/event";
import { events } from "@/data/events";
import { fmtDate, fmtRange } from "@/lib/format";
import { dayTime } from "@/lib/phase";
import { isUpcoming, sortedEvents } from "@/lib/events";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EventLedger } from "@/components/ui/EventLedger";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Body, H3, Label } from "@/components/ui/Type";
import { breadcrumbLd } from "@/lib/jsonld";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Initiatives",
  description: "Venture Vortex 2026, our flagship, and the events E-Club NIT Warangal has run: Valuation Wars, Pitch’er Perfect and The Pitch League.",
  alternates: { canonical: "/initiatives" },
  openGraph: { title: "Initiatives | E-Club NIT Warangal", url: "/initiatives" },
};

const [r1, r2, r3] = event.rounds;
const range = (r: { start: string; end: string }) => fmtRange(r.start, r.end);

// How to take part in the flagship, in four steps. Every line is a fact in data/event.ts (the Unstop timeline and the official Round 1 brief).
const STEPS = [
  { title: "Register on Unstop", text: `Registration ${range(event.registration)}. ${event.fee} to enter. Teams of ${event.team.min} to ${event.team.max}; a team is locked when registration closes.` },
  { title: `Round 1: ${r1.name}`, text: `Choose one of 50 startups and submit a teardown deck of 10–18 slides with a LinkedIn post. Submissions close ${dayTime(r1.end)}; the result is on ${fmtDate(event.round1Result)}.` },
  { title: `Round 2: ${r2.name}`, text: `Shortlisted teams pick a Marketing or a Product vertical and build a strategy, ${range(r2)}.` },
  { title: `Round 3: ${r3.name}`, text: `Finalists defend their strategy live on the NIT Warangal campus, ${range(r3)}.` },
] as const;

const FAQ = [
  { q: "What do we hand in for Round 1?", a: `${event.round1Deliverable.deck} ${event.round1Deliverable.titleSlide} A LinkedIn post tagging the club and the company is mandatory.` },
  { q: "What are the Round 2 verticals?", a: event.round2Verticals.map((v) => `${v.id}. ${v.name}`).join(" · ") },
  { q: "Who can take part?", a: event.eligibility },
] as const;

/** The flagship and the events the club has run, as one ledger with an All / Flagship / Events filter, then how to take part and a short FAQ. Full rules live on the Venture Vortex page. */
export default function InitiativesPage() {
  const ordered = sortedEvents(events);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Initiatives", path: "/initiatives" }])} />
      <PageHeader number="01" label="Initiatives" title="What we run" art="pitch-stage" lede="One flagship, and the events we have run." />

      <div className="bg-bg pb-[var(--section-y)] text-fg">
        <Container>
          <Label className="border-t border-line pt-4">02 — Ledger</Label>
          <div className="mt-8"><EventLedger events={ordered} upcomingSlugs={ordered.filter(isUpcoming).map((e) => e.slug)} /></div>
        </Container>
      </div>

      <Section id="take-part" number="03" title="How to take part" heading="Four steps through Venture Vortex" tone="paper">
        <ol className="border-b border-line">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rule-draw grid gap-x-8 gap-y-2 py-6 md:grid-cols-[3rem_1fr_2fr]">
              <Label className="pt-2">{String(i + 1).padStart(2, "0")}</Label>
              <H3>{s.title}</H3>
              <Body>{s.text}</Body>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3"><Button href="/venture-vortex">Full rules and judging</Button></div>
      </Section>

      <Section id="faq" number="04" title="FAQ" heading="Short answers">
        <div className="max-w-3xl border-b border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="border-t border-line">
              <summary className="t-h3 flex min-h-14 cursor-pointer list-none items-center py-3">{f.q}</summary>
              <p className="t-body pb-5">{f.a}</p>
            </details>
          ))}
        </div>
        <Body className="mt-8">More questions? <Link className="text-link underline underline-offset-4" href="/contact#query">Ask us</Link>.</Body>
      </Section>
    </>
  );
}
