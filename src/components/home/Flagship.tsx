import type { ClubEvent } from "@/data/events";
import { fmtRange } from "@/lib/format";
import { Art } from "@/components/ui/Art";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Countdown } from "@/components/ui/Countdown";
import { LedgerRow } from "@/components/ui/LedgerRow";
import { Section } from "@/components/ui/Section";
import { Body, Display, H2, Label } from "@/components/ui/Type";
import { VortexPortal } from "@/components/three/VortexPortal";

/**
 * Chapter 06, the flagship. A full-bleed dark stage (the generated pitch-stage art under an ink veil) with the brass coin on a lit
 * pedestal inside the vortex portal. The prize figure is this viewport's one Impact moment.
 */
export function Flagship({ event }: { event: ClubEvent }) {
  return (
    <Section id="flagship" number="06" title="Flagship" heading={event.title} bare className="isolate overflow-hidden py-24 md:py-36">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Art name="pitch-stage" sizes="100vw" className="size-full object-cover" />
        <div className="art-veil absolute inset-0" style={{ "--veil": "74%" } as React.CSSProperties} />
      </div>
      <Container>
        <Label className="border-t border-line pt-4">06 — Flagship · {fmtRange(event.dateStart, event.dateEnd)}</Label>
        <div className="mt-12 grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <H2 id="flagship-h">{event.title}</H2>
            <Display className="t-impact-s tabular mt-8 text-accent-text">₹50,000</Display>
            <Label className="mt-3">Prize pool</Label>
            <Body className="mt-8">{event.summary}</Body>
            <div className="mt-8"><Countdown start={event.dateStart} end={event.dateEnd} /></div>
            <dl className="mt-8 max-w-xl"><LedgerRow label="Venue">{event.venue}</LedgerRow></dl>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {event.registerUrl && <Button href={event.registerUrl}>Register on Unstop</Button>}
              <Button href={`/events/${event.slug}`} variant="secondary">Event details</Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <VortexPortal href={`/events/${event.slug}`} label={`Enter the vortex: ${event.title}`} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
