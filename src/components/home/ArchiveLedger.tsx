import Link from "next/link";
import type { ClubEvent } from "@/data/events";
import { archive } from "@/data/archive";
import { fmtRange } from "@/lib/format";
import { fileOf, photoById } from "@/lib/photos";

type Row = { href: string; title: string; meta: string; kind: string; a: { avif?: string; webp: string; alt: string }; b: { avif?: string; webp: string; alt: string } };

const fromPhoto = (id: string) => { const p = photoById(id); return { avif: fileOf(p, 640, "avif"), webp: fileOf(p, 640, "webp"), alt: "" }; };

/**
 * Home scene 6: events as a ledger. Each row carries two images (base and alternate) that cross-fade and lift 4px on hover/focus,
 * with a VIEW cursor label. The flagship row uses the generated vortex artwork (abstract, never presented as a photograph).
 */
export function ArchiveLedger({ flagship }: { flagship?: ClubEvent }) {
  const rows: Row[] = [
    ...(flagship ? [{
      href: `/events/${flagship.slug}`, title: flagship.title, meta: fmtRange(flagship.dateStart, flagship.dateEnd), kind: "Flagship",
      a: { webp: "/images/generated/vortex.webp", alt: "" }, b: { webp: "/images/generated/hero-scene.webp", alt: "" },
    }] : []),
    ...archive.map((s) => ({ href: `/gallery#${s.slug}`, title: s.title, meta: s.when, kind: "Photo set", a: fromPhoto(s.cover), b: fromPhoto(s.hover) })),
  ];
  const pic = (i: { avif?: string; webp: string }, cls: string) => (
    <picture className={cls}>
      {i.avif && <source type="image/avif" srcSet={i.avif} />}
      <img src={i.webp} alt="" width={640} height={427} loading="lazy" decoding="async" className="size-full object-cover" />
    </picture>
  );
  return (
    <ul className="border-b border-line">
      {rows.map((r, n) => (
        <li key={r.href}>
          <Link href={r.href} data-cursor="VIEW" className="ledger-row swap-host group grid min-h-32 grid-cols-[2rem_1fr_6.5rem] items-center gap-x-4 gap-y-1 border-t border-line py-5 sm:grid-cols-[3rem_1fr_11rem] md:grid-cols-[4rem_1fr_9rem_15rem] md:gap-x-6">
            <span className="label text-muted">{String(n + 1).padStart(2, "0")}</span>
            <span>
              <span className="block font-display text-[clamp(1.6rem,4.6vw,4rem)] font-extrabold uppercase leading-[0.95] tracking-tight">{r.title}</span>
              <span className="label mt-2 block text-muted md:hidden">{r.kind} · {r.meta}</span>
            </span>
            <span className="label hidden text-muted md:block">{r.kind}<br />{r.meta}</span>
            <span className="swap relative block aspect-[3/2] overflow-hidden rounded-[2px] bg-surface">
              {pic(r.a, "absolute inset-0")}
              {pic(r.b, "absolute inset-0")}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
