import Link from "next/link";
import type { ClubEvent } from "@/data/events";
import { archive } from "@/data/archive";
import type { ArtKey } from "@/data/art";
import { fmtRange } from "@/lib/format";
import { Art } from "./Art";
import { H3, Label } from "./Type";

type Row = { href: string; title: string; meta: string; kind: string; a: ArtKey; b: ArtKey };

// Generated art stands in as the cover until the club has real cover art. Event photographs are not used on these rows.
const COVERS: [ArtKey, ArtKey][] = [["pitch-stage", "rocket-launch-abstract"], ["workshop", "hero-coin-macro"], ["sponsors-band", "boardroom-table"]];

/**
 * The events ledger with hover-swap covers: each row carries two generated covers that cross-fade and lift 4px on hover or focus,
 * with a VIEW cursor label. Rows are real links, so it works without JS and by keyboard. Used on Home (chapter 05) and /events.
 */
export function ArchiveRows({ flagship }: { flagship?: ClubEvent }) {
  const rows: Row[] = [
    ...(flagship ? [{ href: `/events/${flagship.slug}`, title: flagship.title, meta: fmtRange(flagship.dateStart, flagship.dateEnd), kind: "Flagship", a: "vortex" as ArtKey, b: "trophy-plinth" as ArtKey }] : []),
    ...archive.map((s, i) => ({ href: `/gallery#${s.slug}`, title: s.title, meta: s.when, kind: "Photo set", a: COVERS[i % COVERS.length][0], b: COVERS[i % COVERS.length][1] })),
  ];
  return (
    <ul className="border-b border-line">
      {rows.map((r, n) => (
        <li key={r.href}>
          <Link href={r.href} data-cursor="VIEW" className="ledger-row swap-host group rule-draw grid min-h-32 grid-cols-[2rem_1fr_6.5rem] items-center gap-x-4 gap-y-1 py-5 sm:grid-cols-[3rem_1fr_11rem] md:grid-cols-[4rem_1fr_9rem_15rem] md:gap-x-6">
            <Label>{String(n + 1).padStart(2, "0")}</Label>
            <span>
              <H3 as="span" className="block">{r.title}</H3>
              <Label as="span" className="mt-2 block md:hidden">{r.kind} · {r.meta}</Label>
            </span>
            <Label as="span" className="hidden md:block">{r.kind}<br />{r.meta}</Label>
            <span className="swap relative block aspect-[3/2] overflow-hidden rounded-[2px] bg-surface">
              <Art name={r.a} sizes="(min-width: 768px) 15rem, 11rem" className="absolute inset-0 size-full object-cover" />
              <Art name={r.b} sizes="(min-width: 768px) 15rem, 11rem" className="absolute inset-0 size-full object-cover" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
