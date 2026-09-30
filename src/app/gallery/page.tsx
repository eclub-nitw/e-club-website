import type { Metadata } from "next";
import { events } from "@/data/events";
import { Container, Gallery, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Entrepreneurship Club events at NIT Warangal.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  const groups = events.filter((e) => e.gallery?.length);
  return (
    <>
      <PageHeader number="01" label="Gallery" title="Moments from our events" />
      <div className="bg-bg pb-28 text-fg">
        <Container className="space-y-20">
          {groups.length === 0 && <p className="text-lg text-muted">Photos will appear here once event albums are published.</p>}
          {groups.map((e) => (
            <section key={e.slug} aria-labelledby={`g-${e.slug}`}>
              <h2 id={`g-${e.slug}`} className="mb-6 border-t border-line pt-4 font-display text-3xl font-medium">{e.title}</h2>
              <Gallery items={e.gallery!.map((g) => ({ ...g, caption: g.alt }))} />
            </section>
          ))}
        </Container>
      </div>
    </>
  );
}
