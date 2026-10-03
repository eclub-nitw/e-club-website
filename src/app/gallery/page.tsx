import type { Metadata } from "next";
import { events, shownPhotos } from "@/data/events";
import { Body } from "@/components/ui/Type";
import { Container } from "@/components/ui/Container";
import { Gallery } from "@/components/ui/Gallery";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs from events run by E-Club NIT Warangal, grouped by event.",
  alternates: { canonical: "/gallery" },
};

/** Photographs of club events, grouped by event, only for events whose consent is recorded in data/events.ts. */
export default function GalleryPage() {
  const groups = events.map((e) => ({ slug: e.slug, title: e.title, photos: shownPhotos(e) })).filter((g) => g.photos.length > 0);
  const total = groups.reduce((n, g) => n + g.photos.length, 0);
  return (
    <>
      <PageHeader number="01" label="Gallery" title="Moments from our events" art="network-city" lede={total ? `${total} photographs from ${groups.length} events.` : undefined} />
      <div className="bg-bg pb-[var(--section-y)] text-fg">
        <Container>
          {groups.length ? <Gallery groups={groups} /> : <Body>No event photographs are published yet.</Body>}
        </Container>
      </div>
    </>
  );
}
