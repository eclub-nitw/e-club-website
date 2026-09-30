import type { Metadata } from "next";
import { archive } from "@/data/archive";
import { photos } from "@/data/media";
import { caption } from "@/lib/photos";
import { Container } from "@/components/ui/Container";
import { Gallery } from "@/components/ui/Gallery";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs from Entrepreneurship Club sessions at NIT Warangal, grouped by event.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader number="01" label="Gallery" title="Moments from our events" photoId="02-22" lede={`${photos.length} photographs from three club sessions.`} />
      <div className="bg-bg pb-28 text-fg">
        <Container className="space-y-24">
          {archive.map((s) => (
            <section key={s.slug} id={s.slug} aria-labelledby={`g-${s.slug}`} className="scroll-mt-24">
              <h2 id={`g-${s.slug}`} className="mb-2 border-t border-line pt-4 font-display text-[clamp(2rem,5vw,4rem)] font-extrabold uppercase leading-none tracking-[0.01em]">{s.title}</h2>
              <p className="label mb-8 text-muted">{s.when}</p>
              <Gallery items={photos.filter((p) => p.event === s.slug).map((p) => ({ id: p.id, event: p.event, w: p.w, h: p.h, alt: p.alt, caption: caption(p), blur: p.blur }))} />
            </section>
          ))}
        </Container>
      </div>
    </>
  );
}
