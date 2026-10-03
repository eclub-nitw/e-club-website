import type { Metadata } from "next";
import { event } from "@/data/event";
import { spotlight } from "@/data/spotlight";
import { fmtRange } from "@/lib/format";
import { currentPhase } from "@/lib/phase";
import { listInitiatives } from "@/lib/initiatives";
import { clockNow, spotlightEnded, spotlightVisible } from "@/lib/spotlight";
import { breadcrumbLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EventLedger } from "@/components/ui/EventLedger";
import { listHasCovers } from "@/components/ui/EventRow";
import { ActionButton } from "@/components/ui/PhaseActions";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Body, H3, Label } from "@/components/ui/Type";

export const revalidate = 60; // the Upcoming/Past split and the spotlight row follow the clock

export const metadata: Metadata = {
  title: "Initiatives",
  description: "The competitions and pitch sessions run by E-Club NIT Warangal, with dates and venues once the club publishes them.",
  alternates: { canonical: "/initiatives" },
  openGraph: { title: "Initiatives | E-Club NIT Warangal", url: "/initiatives" },
};

/**
 * Every initiative as one ledger with All / Upcoming / Past tabs. "How to take part" lists only initiatives whose facts are verified: today the
 * one in the spotlight, and only while it is promoted; it carries its own link to Unstop. Full rules live on that initiative's page.
 */
export default function InitiativesPage() {
  const now = clockNow();
  const rows = listInitiatives(now);
  const takePart = spotlightVisible(now) && !spotlightEnded(now);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Initiatives", path: "/initiatives" }])} />
      <PageHeader number="01" label="Initiatives" title="What we run" art="pitch-stage" lede="Competitions and pitch sessions, run by students." />

      <div className="bg-bg pb-[var(--section-y)] text-fg">
        <Container>
          <Label className="border-t border-line pt-4">02 — Ledger</Label>
          <div className="mt-8"><EventLedger rows={rows} cover={listHasCovers(rows.map((r) => r.event))} /></div>
        </Container>
      </div>

      {takePart && (
        <Section id="take-part" number="03" title="How to take part" heading="Open now" tone="paper">
          <ol className="border-b border-line">
            <li className="rule-draw grid gap-x-8 gap-y-3 py-6 md:grid-cols-[3rem_1fr_2fr_auto]">
              <Label className="pt-2">01</Label>
              <H3>{spotlight.name}</H3>
              <Body>Registration {fmtRange(event.registration.start, event.registration.end)}. {event.fee} to enter, teams of {event.team.min} to {event.team.max}, on Unstop.</Body>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                <ActionButton initial={currentPhase()} />
                <Button href={spotlight.href} variant="link">Rules and rounds →</Button>
              </div>
            </li>
          </ol>
        </Section>
      )}
    </>
  );
}
