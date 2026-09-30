import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { events } from "@/data/events";
import { fmtRange } from "@/lib/format";
import { isUpcoming } from "@/lib/events";
import { breadcrumbLd, eventLd } from "@/lib/jsonld";
import { Breadcrumbs, Button, Container, Gallery, JsonLd, LedgerRow, PageHeader, StatNumber, VideoEmbed } from "@/components/ui";
import { TYPE_LABEL } from "@/components/ui/EventRow";

export const dynamicParams = false;
export const revalidate = 3600;

export const generateStaticParams = () => events.map((e) => ({ slug: e.slug }));

const find = (slug: string) => events.find((e) => e.slug === slug);
const clip = (s: string, n = 155) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = find((await params).slug);
  if (!e) return {};
  return {
    title: e.title,
    description: clip(e.summary),
    alternates: { canonical: `/events/${e.slug}` },
    openGraph: { title: `${e.title} | E-Club NIT Warangal`, description: clip(e.summary), url: `/events/${e.slug}`, type: "article" },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = find((await params).slug);
  if (!e) notFound();
  const upcoming = isUpcoming(e);
  const hasMedia = !!(e.coverImage || e.videoId || e.stats?.length || e.gallery?.length);
  const related = events.filter((o) => o.slug !== e.slug && o.type === e.type).slice(0, 3);

  return (
    <>
      <JsonLd data={eventLd(e)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Events", path: "/events" }, { name: e.title, path: `/events/${e.slug}` }])} />
      <PageHeader number={TYPE_LABEL[e.type]} label={fmtRange(e.dateStart, e.dateEnd)} title={e.title} lede={e.summary}>
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Events", path: "/events" }, { name: e.title }]} />
      </PageHeader>

      <div className="bg-bg pb-28 text-fg">
        <Container className={hasMedia ? "grid gap-14 lg:grid-cols-[1.2fr_1fr]" : ""}>
          {hasMedia && <div>
            {e.coverImage && (
              <div className="relative mb-10 aspect-[3/2] overflow-hidden rounded-[2px] bg-surface">
                <Image src={e.coverImage} alt={`${e.title}, cover photo`} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              </div>
            )}
            {e.videoId && <div className="mb-10"><VideoEmbed videoId={e.videoId} title={`${e.title}, video`} /></div>}
            {e.stats && e.stats.length > 0 && (
              <div className="mb-10 grid gap-8 sm:grid-cols-2">{e.stats.map((s) => <StatNumber key={s.label} {...s} />)}</div>
            )}
            {e.gallery && e.gallery.length > 0 && <Gallery items={e.gallery.map((g) => ({ ...g, caption: g.alt }))} />}
          </div>}

          <aside aria-label="Event facts" className="max-w-2xl">
            <dl>
              <LedgerRow label="Date">{fmtRange(e.dateStart, e.dateEnd)}</LedgerRow>
              <LedgerRow label="Venue">{e.venue}</LedgerRow>
              <LedgerRow label="Type">{TYPE_LABEL[e.type]}</LedgerRow>
              <LedgerRow label="Status">{upcoming ? "Upcoming" : "Concluded"}</LedgerRow>
            </dl>
            {upcoming && e.registerUrl && <div className="mt-8"><Button href={e.registerUrl}>Register on Unstop</Button></div>}
          </aside>
        </Container>

        {related.length > 0 && (
          <Container className="mt-24">
            <h2 className="border-t border-line pt-4 font-mono text-xs uppercase tracking-[0.08em] text-muted">Related events</h2>
            <ul className="mt-4">{related.map((r) => <li key={r.slug} className="border-t border-line"><Link href={`/events/${r.slug}`} className="ledger-row flex min-h-14 items-center py-3 font-display text-2xl">{r.title}</Link></li>)}</ul>
          </Container>
        )}
      </div>
    </>
  );
}
