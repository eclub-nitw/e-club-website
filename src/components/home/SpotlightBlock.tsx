import Link from "next/link";
import { copy } from "@/data/copy";
import { event } from "@/data/event";
import { partnersOf } from "@/data/partners";
import { posterBlur } from "@/data/poster-blur";
import { spotlight } from "@/data/spotlight";
import { fmtRange } from "@/lib/format";
import { currentPhase, serverNow } from "@/lib/phase";
import { Art } from "@/components/ui/Art";
import { Container } from "@/components/ui/Container";
import { PartnerGrid } from "@/components/ui/PartnerGrid";
import { PhaseActions, PhaseCountdown } from "@/components/ui/PhaseActions";
import { Body, H2, H3, Label } from "@/components/ui/Type";
import { ReachMap } from "./ReachMap";

const [r1, r2, r3] = event.rounds;
const range = (r: { start: string; end: string }) => fmtRange(r.start, r.end);
const FACTS = [
  ["Registration", range(event.registration)],
  ["Teams", `${event.team.min} to ${event.team.max} members`],
  ["Open to", "UG, PG and working professionals across India"],
  ["Entry", event.fee],
  ["Finale", `On campus, ${range(r3)}`],
] as const;

/**
 * The one block on Home that is about the competition. It is time-boxed: the page renders it only while `spotlightVisible` holds. The poster is
 * hero-size (not a thumbnail), beside the key facts, countdown and the Unstop action; below it the round timeline, the "Campus to India" map and
 * the event partners with their logos. The dive lands on it.
 */
export function SpotlightBlock({ number }: { number: string }) {
  const phase = currentPhase();
  return (
    <section id="spotlight" data-section={`${number} — Spotlight`} aria-labelledby="spotlight-h" className="relative isolate overflow-hidden bg-bg py-[var(--section-y)] text-fg">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Art name="pitch-stage" sizes="100vw" className="size-full object-cover" />
        <div className="art-veil absolute inset-0" style={{ "--veil": "90%" } as React.CSSProperties} />
      </div>
      <Container>
        <header className="mb-[var(--head-gap)]">
          <Label className="border-t border-line pt-4">{number} — {copy.spotlight.label}</Label>
          <Label className="mt-6 block text-accent-text">{copy.spotlight.eyebrow}</Label>
          <H2 id="spotlight-h" className="mt-2">{spotlight.name}</H2>
          <p className="t-lede mt-4 max-w-[26ch] text-body">{copy.spotlight.line}</p>
        </header>

        <div className="grid gap-x-[clamp(32px,5vw,80px)] gap-y-10 lg:grid-cols-[minmax(0,26rem)_1fr]">
          <Link href={spotlight.href} className="poster-tile block w-full max-w-[26rem] justify-self-center lg:justify-self-start">
            <picture>
              <source type="image/avif" srcSet="/images/posters/vv-announcement-640.avif 640w, /images/posters/vv-announcement-1024.avif 1024w" sizes="(min-width: 1024px) 26rem, 90vw" />
              <img src="/images/posters/vv-announcement-1024.webp" srcSet="/images/posters/vv-announcement-640.webp 640w, /images/posters/vv-announcement-1024.webp 1024w" sizes="(min-width: 1024px) 26rem, 90vw"
                alt="Venture Vortex 2026 official poster: Decode the business, craft what's next." width={1024} height={1451} loading="lazy" decoding="async"
                className="mx-auto h-auto max-h-[82svh] w-auto max-w-full rounded-[2px] border border-line" style={{ backgroundImage: `url(${posterBlur["vv-announcement"]})`, backgroundSize: "cover" }} />
            </picture>
          </Link>

          <div className="flex flex-col justify-between gap-10">
            <div>
              <div className="cq max-w-[22rem]">
                <p className="t-stat tabular text-accent-text">₹50,000</p>
                <Label className="mt-3">Total prize pool</Label>
              </div>
              <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {FACTS.map(([k, v]) => <div key={k}><dt><Label>{k}</Label></dt><dd className="t-body mt-1 m-0">{v}</dd></div>)}
              </dl>
            </div>
            <div>
              <PhaseCountdown initial={phase} now={serverNow()} className="mb-3" />
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                <PhaseActions initial={phase} then={{ label: "Competition details", href: spotlight.href }} />
              </div>
            </div>
          </div>
        </div>

        <ol className="mt-[var(--section-y)] border-b border-line">
          {[r1, r2, r3].map((r) => (
            <li key={r.id} className="rule-draw grid gap-x-8 gap-y-1 py-5 md:grid-cols-[12rem_1fr_16rem]">
              <Label className="text-accent-text">Round {r.n} · {r.mode}</Label>
              <H3>{r.name}</H3>
              <Label className="tabular">{r.n === 1 ? "Submissions " : ""}{range(r)}</Label>
            </li>
          ))}
        </ol>

        <div className="mt-[var(--section-y)]">
          <Label as="h3" className="border-t border-line pt-4">{copy.spotlight.reach.title}</Label>
          <Body className="mb-8 mt-3">{copy.spotlight.reach.line}</Body>
          <ReachMap />
        </div>

        <div className="mt-[var(--section-y)]">
          <Label as="h3" className="border-t border-line pt-4">{copy.spotlight.partners.title}</Label>
          <Body className="mb-6 mt-3">{copy.spotlight.partners.line}</Body>
          <PartnerGrid list={partnersOf("venture-vortex-2026")} />
          <p className="t-ui mt-6 max-w-[62ch] text-body">
            Names are trademarks of their respective owners; appearing here does not imply endorsement, partnership or sponsorship unless explicitly stated. See the <Link href="/disclaimer" className="underline underline-offset-4 hover:text-fg">disclaimer</Link>.
          </p>
        </div>
      </Container>
    </section>
  );
}
