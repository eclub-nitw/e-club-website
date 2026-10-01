import type { Metadata } from "next";
import { archive } from "@/data/archive";
import { photos } from "@/data/media";
import { caption } from "@/lib/photos";
import { Container } from "@/components/ui/Container";
import { Gallery } from "@/components/ui/Gallery";
import { PageHeader } from "@/components/ui/PageHeader";
import { H2, Label } from "@/components/ui/Type";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs from Entrepreneurship Club sessions at NIT Warangal, grouped by event.",
  alternates: { canonical: "/gallery" },
};

/** The documentary archive: the one page (with event pages) where event photographs are shown in full, grouped by session, each with a caption. */
export default function GalleryPage() {
  return (
    <>
      <PageHeader number="01" label="Gallery" title="Moments from our events" lede={`${photos.length} photographs from ${archive.length} club sessions.`} />
      <div className="bg-bg pb-28 text-fg">
        <Container>
          <nav aria-label="Jump to a session" className="mb-16 flex flex-wrap items-center gap-2">
            <Label className="mr-2">Session</Label>
            {archive.map((s) => <a key={s.slug} href={`#${s.slug}`} className="t-label inline-flex min-h-11 items-center rounded-[2px] border border-line px-4 text-muted transition-colors hover:border-accent hover:text-fg">{s.label}</a>)}
          </nav>
          <div className="space-y-24">
            {archive.map((s, si) => (
              <section key={s.slug} id={s.slug} aria-labelledby={`g-${s.slug}`}>
                <Label className="border-t border-line pt-4">{s.when}</Label>
                <H2 id={`g-${s.slug}`} className="mb-8 mt-4">{s.title}</H2>
                <Gallery items={photos.filter((p) => p.event === s.slug).map((p) => ({ id: p.id, event: p.event, w: p.w, h: p.h, alt: p.alt, caption: caption(p), blur: p.blur }))} eagerCount={si === 0 ? 3 : 0} />
              </section>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
