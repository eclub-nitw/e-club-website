import Link from "next/link";
import { copy } from "@/data/copy";
import { eventPath, events, shownPhotos } from "@/data/events";
import { EventPhoto } from "@/components/ui/EventPhoto";
import { Section } from "@/components/ui/Section";
import { Label } from "@/components/ui/Type";

/** One consented photograph per event, each linking to its event page. Empty until at least one event has recorded consent. */
export const floorPicks = () => events.flatMap((e) => { const p = shownPhotos(e)[0]; return p ? [{ e, p }] : []; });

export function FromTheFloor({ number }: { number: string }) {
  const picks = floorPicks();
  if (picks.length === 0) return null;
  return (
    <Section id="floor" number={number} title="From the floor" heading={copy.fromTheFloor.title} line={copy.fromTheFloor.line} tone="paper">
      <ul className="grid gap-6 md:grid-cols-3">
        {picks.map(({ e, p }) => (
          <li key={e.slug}>
            <Link href={eventPath(e)} className="group block">
              <span className="block transition-transform duration-[250ms] ease-[var(--ease-out-expo)] group-hover:-translate-y-1 motion-reduce:transition-none"><EventPhoto slug={e.slug} photo={{ ...p, ratio: "3:2" }} sizes="(min-width: 768px) 30vw, 90vw" /></span>
              <Label className="mt-3 block">{e.title}</Label>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
