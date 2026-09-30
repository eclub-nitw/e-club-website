import type { Metadata } from "next";
import { events } from "@/data/events";
import { EventLedger } from "@/components/ui/EventLedger";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { ArchiveLedger } from "@/components/home/ArchiveLedger";

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
      <PageHeader number="01" label="Events" title="Events and archive" photoId="03-33" lede="Upcoming events come first, then everything we have run, newest to oldest." />
      <div className="bg-bg pb-28 text-fg">
        <Container>
          {events.length ? <EventLedger events={events} nowIso={new Date().toISOString()} /> : <p className="text-lg text-muted">No events are published yet.</p>}
          <h2 className="mb-6 mt-24 border-t border-line pt-4 font-display text-[clamp(2rem,5vw,4rem)] font-extrabold uppercase leading-none tracking-[0.01em]">Photo archive</h2>
          <ArchiveLedger />
        </Container>
      </div>
    </>
  );
}
