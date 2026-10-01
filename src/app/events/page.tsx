import type { Metadata } from "next";
import { events } from "@/data/events";
import { ArchiveRows } from "@/components/ui/ArchiveRows";
import { Container } from "@/components/ui/Container";
import { EventLedger } from "@/components/ui/EventLedger";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { Body, H2, Label } from "@/components/ui/Type";
import { breadcrumbLd } from "@/lib/jsonld";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events",
  description: "Flagship competitions, workshops and speaker sessions run by the Entrepreneurship Club of NIT Warangal, with the full archive.",
  alternates: { canonical: "/events" },
  openGraph: { title: "Events | E-Club NIT Warangal", url: "/events" },
};

export default function EventsPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Events", path: "/events" }])} />
      <PageHeader number="01" label="Events" title="Events and archive" art="pitch-stage" lede="Upcoming first, then everything we have run." />
      <div className="bg-bg pb-28 text-fg">
        <Container>
          <Label className="border-t border-line pt-4">02 — Calendar</Label>
          <div className="mt-8">
            {events.length ? <EventLedger events={events} nowIso={new Date().toISOString()} /> : <Body>No events are published yet.</Body>}
          </div>
          <Label className="mt-24 border-t border-line pt-4">03 — Photo archive</Label>
          <H2 className="mb-8 mt-6">Sessions we have photographed</H2>
          <ArchiveRows />
        </Container>
      </div>
    </>
  );
}
