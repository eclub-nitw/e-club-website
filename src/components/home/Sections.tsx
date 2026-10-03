import Link from "next/link";
import { copy } from "@/data/copy";
import { posterBlur } from "@/data/poster-blur";
import { shownPosters } from "@/data/posters";
import { speakers } from "@/data/speakers";
import { partnersOf } from "@/data/partners";
import { voices } from "@/data/voices";
import { Button } from "@/components/ui/Button";
import { ContactLedger } from "@/components/ui/ContactLedger";
import { PartnerGrid } from "@/components/ui/PartnerGrid";
import { Section } from "@/components/ui/Section";
import { Body, H3, Label, Lede } from "@/components/ui/Type";

/**
 * Poster wall: the club's own flyers (never event photographs), four in a symmetric grid: one column below 560px, two from there up. Every poster sits
 * in the same 5:7 frame on an ink mat with object-contain, so none is cropped and none sits off-centre. The poster's words are real text under each.
 */
export function PosterWall({ number }: { number: string }) {
  const list = shownPosters();
  return (
    <Section id="posters" number={number} title="Posters" heading={copy.posters.title} line={copy.posters.line} tone="paper">
      {list.length === 0 ? (
        <Body>No posters are published yet.</Body>
      ) : (
        <ul className="mx-auto grid max-w-[56rem] gap-[clamp(16px,2vw,32px)] min-[560px]:grid-cols-2">
          {list.map((p) => (
            <li key={p.slug}>
              <Link href="/venture-vortex" className="poster-tile block aspect-[5/7] overflow-hidden rounded-[2px] border border-line bg-club-ink">
                <picture>
                  <source type="image/avif" srcSet={`/images/posters/${p.slug}-640.avif 640w, /images/posters/${p.slug}-1024.avif 1024w`} sizes="(min-width: 560px) 28rem, 90vw" />
                  <img src={`/images/posters/${p.slug}-640.webp`} srcSet={`/images/posters/${p.slug}-640.webp 640w, /images/posters/${p.slug}-1024.webp 1024w`} sizes="(min-width: 560px) 28rem, 90vw"
                    alt={p.alt} width={640} height={Math.round((640 * p.h) / p.w)} loading="lazy" decoding="async" className="size-full object-contain"
                    style={{ backgroundImage: `url(${posterBlur[p.slug]})`, backgroundSize: "cover" }} />
                </picture>
              </Link>
              <Label className="mt-4">{p.title}</Label>
              <details className="mt-2">
                <summary className="t-ui inline-flex min-h-11 cursor-pointer items-center underline underline-offset-4">Poster text</summary>
                <ul className="mt-2 space-y-2">{p.text.map((t) => <li key={t} className="t-body">{t}</li>)}</ul>
              </details>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/** Data-gated: nothing renders until the club supplies speakers (and portrait consent). */
export function Speakers({ number }: { number: string }) {
  if (speakers.length === 0) return null;
  return (
    <Section id="speakers" number={number} title="Speakers" heading={copy.speakers.title}>
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {speakers.map((s) => (
          <li key={s.name}>
            {s.photo && s.photoConsent && <img src={s.photo} alt="" width={400} height={500} loading="lazy" decoding="async" className="mb-4 aspect-[4/5] w-full rounded-[2px] object-cover" />}
            <H3>{s.name}</H3><Body className="mt-1">{s.title}</Body><Label className="mt-2">{s.event}</Label>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Data-gated: testimonials appear only with written permission. */
export function Voices({ number }: { number: string }) {
  if (voices.length === 0) return null;
  return (
    <Section id="voices" number={number} title="Voices" heading={copy.voices.title} tone="paper">
      <ul className="grid gap-12 md:grid-cols-2">
        {voices.map((v) => <li key={v.who}><Lede>“{v.quote}”</Lede><Label className="mt-4">{v.who}</Label></li>)}
      </ul>
    </Section>
  );
}

/** Partners of this competition only. Club-wide sponsors are a separate list on /sponsors, empty until the club has some. */
export function PartnersBlock({ number }: { number: string }) {
  return (
    <Section id="partners" number={number} title="Partners" heading="Venture Vortex 2026 partners" line="Partners of this competition. Club-wide sponsors are listed on the Sponsors page.">
      <PartnerGrid list={partnersOf("venture-vortex-2026")} />
      <p className="t-ui mt-8 max-w-[62ch] text-body">
        Names are trademarks of their respective owners; appearing here does not imply endorsement, partnership or sponsorship unless explicitly stated. See the <Link href="/disclaimer" className="underline underline-offset-4 hover:text-fg">disclaimer</Link>.
      </p>
      <div className="mt-6"><Button href="/sponsors" variant="link">Sponsors and how to partner →</Button></div>
    </Section>
  );
}

const ROUTES = [
  { href: "/contact#join", label: "Join the club", note: "Tell us your branch and year" },
  { href: "/contact#query", label: "Ask a query", note: "About an event or the club" },
  { href: "/contact#sponsor", label: "Partner with us", note: "Sponsors and collaborators" },
] as const;

/** Closing chapter: three doors into the contact page, and the three public contact points. */
export function JoinUs({ number }: { number: string }) {
  return (
    <Section id="join" number={number} title="Join" heading={copy.join.title} line={copy.join.line} tone="paper">
      <div className="grid gap-x-[clamp(32px,5vw,96px)] gap-y-10 lg:grid-cols-2">
        <ol className="border-b border-line self-start">
          {ROUTES.map((r, i) => (
            <li key={r.href}>
              <Link href={r.href} className="ledger-row rule-draw group grid min-h-24 grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-5">
                <Label className="tabular">{String(i + 1).padStart(2, "0")}</Label>
                <span><span className="t-h3 block">{r.label}</span><Label className="mt-1 block">{r.note}</Label></span>
                <span aria-hidden="true" className="t-h3 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1 motion-reduce:transition-none">→</span>
              </Link>
            </li>
          ))}
        </ol>
        <ContactLedger />
      </div>
    </Section>
  );
}
