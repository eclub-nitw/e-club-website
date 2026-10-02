import Link from "next/link";
import { copy } from "@/data/copy";
import { posterBlur } from "@/data/poster-blur";
import { shownPosters } from "@/data/posters";
import { speakers } from "@/data/speakers";
import { sponsors } from "@/data/sponsors";
import { voices } from "@/data/voices";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SponsorLogo } from "@/components/ui/SponsorLogo";
import { Body, H3, Label, Lede } from "@/components/ui/Type";

/** Poster wall: the club's own flyers (never event photographs). Tiles lift 4px; the poster's words are real text under each tile. */
export function PosterWall({ number }: { number: string }) {
  const list = shownPosters();
  return (
    <Section id="posters" number={number} title="Posters" heading={copy.posters.title} tone="paper">
      <p className="t-body -mt-8 mb-12 md:-mt-10">{copy.posters.line}</p>
      {list.length === 0 ? (
        <Body>No posters are published yet.</Body>
      ) : (
        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <li key={p.slug} className={i % 2 ? "lg:mt-16" : ""}>
              <Link href="/venture-vortex" data-cursor="OPEN" className="poster-tile block overflow-hidden rounded-[2px] border border-line bg-surface" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                <picture>
                  <source type="image/avif" srcSet={`/images/posters/${p.slug}-640.avif 640w, /images/posters/${p.slug}-1024.avif 1024w`} sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw" />
                  <img src={`/images/posters/${p.slug}-640.webp`} srcSet={`/images/posters/${p.slug}-640.webp 640w, /images/posters/${p.slug}-1024.webp 1024w`} sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
                    alt={p.alt} width={640} height={Math.round((640 * p.h) / p.w)} loading="lazy" decoding="async" className="size-full object-cover"
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

const consented = sponsors.filter((s) => s.consent && s.logo);

/** "Backed by": collaborators named on the official poster, as typography. Logos only for partners with recorded written consent. */
export function BackedBy({ number }: { number: string }) {
  return (
    <Section id="backed" number={number} title="Backed by" heading={copy.backed.title}>
      <p className="t-body -mt-8 mb-12 md:-mt-10">{copy.backed.line}</p>
      <ul className="border-b border-line">
        {sponsors.map((s) => (
          <li key={s.name} className="rule-draw grid gap-x-8 gap-y-1 py-5 md:grid-cols-[14rem_1fr]">
            <Label>{s.role}</Label>
            <span className="t-h3">{s.name}</span>
          </li>
        ))}
      </ul>
      {consented.length > 0 && <ul className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-3">{consented.map((s) => <li key={s.name}><SponsorLogo sponsor={s} /></li>)}</ul>}
      <p className="t-ui mt-8 max-w-[62ch] text-body">
        Names are trademarks of their respective owners; appearing here does not imply endorsement, partnership or sponsorship unless explicitly stated. See the <Link href="/disclaimer" className="underline underline-offset-4 hover:text-fg">disclaimer</Link>.
      </p>
      <div className="mt-8"><Button href="/sponsors" variant="link">Partner with us →</Button></div>
    </Section>
  );
}

/** Closing chapter: Join is a section here, not a tab. */
export function JoinUs({ number }: { number: string }) {
  return (
    <Section id="join" number={number} title="Join" heading={copy.join.title} tone="paper">
      <Container className="px-0 md:px-0">
        <p className="t-lede max-w-[30ch]">{copy.join.line}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button href="/contact#join">Join the club</Button>
          <Button href={`mailto:${site.email}`} variant="secondary">{site.email}</Button>
        </div>
      </Container>
    </Section>
  );
}
