import type { Metadata } from "next";
import Link from "next/link";
import { events } from "@/data/events";
import { Container } from "@/components/ui/Container";
import { EventLedger } from "@/components/ui/EventLedger";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { PosterWall } from "@/components/home/Sections";
import { Body, Label } from "@/components/ui/Type";
import { breadcrumbLd } from "@/lib/jsonld";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Initiatives",
  description: "Competitions, workshops and speaker sessions run by E-Club NIT Warangal. Flagship: Venture Vortex 2026.",
  alternates: { canonical: "/initiatives" },
  openGraph: { title: "Initiatives | E-Club NIT Warangal", url: "/initiatives" },
};

export default function InitiativesPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Initiatives", path: "/initiatives" }])} />
      <PageHeader number="01" label="Initiatives" title="What we run" art="pitch-stage" lede="Upcoming first, then everything we have run." />
      <div className="bg-bg pb-24 text-fg">
        <Container>
          <Label className="border-t border-line pt-4">02 — Calendar</Label>
          <div className="mt-8">
            {events.length ? <EventLedger events={events} nowIso={new Date().toISOString()} /> : <Body>No initiatives are published yet.</Body>}
          </div>
          <Body className="mt-8">Past events will be listed here when the club supplies them. Event photographs are in the <Link className="underline underline-offset-4" href="/gallery">Gallery</Link>.</Body>
        </Container>
      </div>
      <PosterWall number="03" />
    </>
  );
}
