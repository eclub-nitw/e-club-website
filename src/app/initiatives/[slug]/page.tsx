import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shownPosters } from "@/data/posters";
import { posterBlur } from "@/data/poster-blur";
import { events } from "@/data/events";
import { fmtRange } from "@/lib/format";
import { isUpcoming } from "@/lib/events";
import { breadcrumbLd, eventLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { Body, H3, Label } from "@/components/ui/Type";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { TYPE_LABEL } from "@/components/ui/EventRow";

export const dynamicParams = false;
export const revalidate = 3600;

export const generateStaticParams = () => events.filter((e) => !e.href).map((e) => ({ slug: e.slug }));

const find = (slug: string) => events.find((e) => e.slug === slug);
const clip = (s: string, n = 155) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = find((await params).slug);
  if (!e) return {};
  return {
    title: e.title,
    description: clip(e.summary),
    alternates: { canonical: `/initiatives/${e.slug}` },
    openGraph: { title: `${e.title} | E-Club NIT Warangal`, description: clip(e.summary), url: `/initiatives/${e.slug}`, type: "article" },
  };
}

/** Event detail: header, a four-column facts strip, the summary, then media (cover, video facade, gallery) and related events. */
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = find((await params).slug);
  if (!e) notFound();
  const upcoming = isUpcoming(e);
  const posters = shownPosters(e.slug);
  const related = events.filter((o) => o.slug !== e.slug && o.type === e.type).slice(0, 3);
  const facts: [string, string][] = [["Date", fmtRange(e.dateStart, e.dateEnd)], ["Venue", e.venue], ["Type", TYPE_LABEL[e.type]], ["Status", upcoming ? "Upcoming" : "Concluded"]];

  return (
    <>
      <JsonLd data={eventLd(e)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Initiatives", path: "/initiatives" }, { name: e.title, path: `/initiatives/${e.slug}` }])} />
      <PageHeader number={TYPE_LABEL[e.type]} label={fmtRange(e.dateStart, e.dateEnd)} title={e.title} lede={e.summary} art={e.type === "flagship" ? "vortex" : "pitch-stage"}>
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Initiatives", path: "/initiatives" }, { name: e.title }]} />
      </PageHeader>

      <div className="bg-bg pb-28 text-fg">
        <Container>
          <dl className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k} className="border-b border-line py-5 pr-6 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0">
                <dt><Label>{k}</Label></dt>
                <dd className="t-body mt-2">{v}</dd>
              </div>
            ))}
          </dl>
          {upcoming && e.registerUrl && <div className="mt-8"><Button href={e.registerUrl}>Register on Unstop</Button></div>}

          {e.stats && e.stats.length > 0 && (
            <dl className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {e.stats.map((s) => (
                <div key={s.label} className="rule-draw pt-5">
                  <dt className="t-h2 tabular">{s.value}</dt>
                  <dd className="m-0"><p className="t-body mt-2">{s.label}</p><Label className="mt-2">Source: {s.source}</Label></dd>
                </div>
              ))}
            </dl>
          )}
          {posters.length > 0 && (
            <ul className="mt-16 grid max-w-3xl gap-8 sm:grid-cols-2">
              {posters.map((p) => (
                <li key={p.slug}>
                  <picture>
                    <source type="image/avif" srcSet={`/images/posters/${p.slug}-640.avif 640w, /images/posters/${p.slug}-1024.avif 1024w`} sizes="(min-width: 640px) 24rem, 90vw" />
                    <img src={`/images/posters/${p.slug}-640.webp`} alt={p.alt} width={640} height={Math.round((640 * p.h) / p.w)} loading="lazy" decoding="async" className="w-full rounded-[2px] border border-line" style={{ backgroundImage: `url(${posterBlur[p.slug]})`, backgroundSize: "cover" }} />
                  </picture>
                  <ul className="mt-3 space-y-1">{p.text.map((t) => <li key={t} className="t-body">{t}</li>)}</ul>
                </li>
              ))}
            </ul>
          )}
          {e.videoId && <div className="mt-16 max-w-4xl"><VideoEmbed videoId={e.videoId} title={`${e.title}, video`} /></div>}
          {!posters.length && !e.videoId && !upcoming && <Body className="mt-16">The poster and video from this event will be added here.</Body>}
        </Container>

        {related.length > 0 && (
          <Container className="mt-24">
            <Label as="h2" className="border-t border-line pt-4">Related events</Label>
            <ul className="mt-4">{related.map((r) => <li key={r.slug} className="border-t border-line"><Link href={r.href ?? `/initiatives/${r.slug}`} className="ledger-row flex min-h-14 items-center py-3"><H3 as="span">{r.title}</H3></Link></li>)}</ul>
          </Container>
        )}
      </div>
    </>
  );
}
