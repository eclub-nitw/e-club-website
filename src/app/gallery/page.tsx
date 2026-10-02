import type { Metadata } from "next";
import { archive } from "@/data/archive";
import { photos } from "@/data/media";
import { caption } from "@/lib/photos";
import { Container } from "@/components/ui/Container";
import { GalleryBrowser } from "@/components/ui/GalleryBrowser";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs from E-Club NIT Warangal sessions, by event. Event photographs appear only on this page.",
  alternates: { canonical: "/gallery" },
};

/** The only page that shows photographs of club events: filter by session, 12 at a time, lightbox with keyboard and swipe. */
export default function GalleryPage() {
  const items = photos.map((p) => ({ id: p.id, event: p.event, w: p.w, h: p.h, alt: p.alt, caption: caption(p), blur: p.blur }));
  return (
    <>
      <PageHeader number="01" label="Gallery" title="Moments from our events" lede={`${photos.length} photographs from ${archive.length} club sessions.`} />
      <div className="bg-bg pb-28 text-fg">
        <Container><GalleryBrowser items={items} sessions={archive.map((s) => ({ slug: s.slug, label: s.label }))} /></Container>
      </div>
    </>
  );
}
