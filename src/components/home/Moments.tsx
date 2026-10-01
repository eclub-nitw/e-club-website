import { copy } from "@/data/copy";
import { MOMENT_IDS } from "@/data/moments";
import { archive } from "@/data/archive";
import { photoById } from "@/lib/photos";
import { EventsRail } from "@/components/ui/EventsRail";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Label } from "@/components/ui/Type";

const setOf = (event: string) => archive.find((a) => a.slug === event);

/**
 * Chapter 07, moments. The eight best frames by technical quality, one unified treatment (ink-teal to warm-paper duotone, baked
 * into the files, 3:2), shown large with an orange caption. Pinned and scrubbed on desktop, native swipe on touch and reduced motion.
 */
export function Moments() {
  return (
    <Section id="moments" number="07" title="Moments" heading={copy.moments.heading} tone="paper">
      <div data-cursor="SCROLL">
        <EventsRail>
          {MOMENT_IDS.map((id, i) => {
            const p = photoById(id);
            const s = setOf(p.event);
            return (
              <li key={id} className={`w-[84vw] shrink-0 snap-start sm:w-[34rem] lg:w-[40rem] ${i % 2 ? "lg:mt-14" : ""}`}>
                <Reveal>
                  <figure className="m-0">
                    <div className="crop relative aspect-[3/2] overflow-hidden rounded-[2px] bg-club-ink">
                      <picture>
                        <source type="image/avif" srcSet={`/images/moments/${id}-1024.avif 1024w, /images/moments/${id}-1600.avif 1600w`} sizes="(min-width: 1024px) 40rem, 84vw" />
                        <source type="image/webp" srcSet={`/images/moments/${id}-1024.webp 1024w, /images/moments/${id}-1600.webp 1600w`} sizes="(min-width: 1024px) 40rem, 84vw" />
                        <img src={`/images/moments/${id}-1024.webp`} alt={p.alt} width={1600} height={1067} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" style={{ backgroundImage: `url(${p.blur})`, backgroundSize: "cover" }} />
                      </picture>
                    </div>
                    <figcaption className="mt-3 flex justify-between gap-4">
                      <Label className="text-accent-text">{s ? `${s.label} · ${s.when}` : p.event}</Label>
                      <Label aria-hidden="true">{String(i + 1).padStart(2, "0")} / {String(MOMENT_IDS.length).padStart(2, "0")}</Label>
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            );
          })}
        </EventsRail>
      </div>
    </Section>
  );
}
