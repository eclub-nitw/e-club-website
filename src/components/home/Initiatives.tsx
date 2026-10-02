import Link from "next/link";
import { copy } from "@/data/copy";
import { event } from "@/data/event";
import { posterBlur } from "@/data/poster-blur";
import { fmtRange } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Body, H3, Label } from "@/components/ui/Type";

/** Chapter "What we run": only verified programmes are listed. Venture Vortex now; more rows when the club supplies them. */
export function Initiatives({ number }: { number: string }) {
  return (
    <Section id="initiatives" number={number} title="Initiatives" heading={copy.initiatives.title} className="isolate">
      <p className="t-body -mt-8 mb-12 md:-mt-10">{copy.initiatives.line}</p>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-20">
        <Link href="/venture-vortex" data-cursor="OPEN" className="poster-tile group relative block aspect-[1024/1451] overflow-hidden rounded-[2px] border border-line bg-surface">
          <picture>
            <source type="image/avif" srcSet="/images/posters/vv-announcement-640.avif 640w, /images/posters/vv-announcement-1024.avif 1024w" sizes="(min-width: 1024px) 19rem, 80vw" />
            <img
              src="/images/posters/vv-announcement-640.webp"
              srcSet="/images/posters/vv-announcement-640.webp 640w, /images/posters/vv-announcement-1024.webp 1024w"
              sizes="(min-width: 1024px) 19rem, 80vw"
              alt="Venture Vortex 2026 poster: Decode the business, craft what's next."
              width={640} height={907} loading="lazy" decoding="async" className="size-full object-cover"
              style={{ backgroundImage: `url(${posterBlur["vv-announcement"]})`, backgroundSize: "cover" }}
            />
          </picture>
        </Link>
        <div>
          <Label className="text-accent-text">Flagship · {fmtRange(event.rounds[0].start, event.rounds[2].end)}</Label>
          <H3 className="mt-3"><Link href="/venture-vortex" className="underline decoration-line decoration-2 underline-offset-8 hover:decoration-accent">{event.name} 2026</Link></H3>
          <Body className="mt-4">{event.tagline} Tear down a startup, build a strategy, defend it live.</Body>
          <ol className="mt-8 border-b border-line">
            {event.rounds.map((r) => (
              <li key={r.id} className="rule-draw grid gap-x-6 gap-y-1 py-4 md:grid-cols-[4.5rem_1fr_15rem]">
                <Label>Round {r.n}</Label>
                <span className="t-h3">{r.name}</span>
                <Label className="tabular">{fmtRange(r.start, r.end)} · {r.mode.split(" · ")[0]}</Label>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <Button href="/venture-vortex">Competition details</Button>
            <Button href="/initiatives" variant="secondary">All initiatives</Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
