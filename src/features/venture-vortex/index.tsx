import { event } from "@/data/event";
import { fmtDate, fmtRange } from "@/lib/format";
import { currentPhase, dayTime } from "@/lib/phase";
import { spotlightIsEnded } from "@/lib/spotlight";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ActionButton, PhaseActions, PhaseCountdown } from "@/components/ui/PhaseActions";
import { MaskedText } from "@/components/ui/MaskedText";
import { Body, H1, H2, H3, Label, Lede } from "@/components/ui/Type";
import { posterBlur } from "@/data/poster-blur";
import { partnersOf } from "@/data/partners";
import { Posters } from "./Posters";
import { Startups } from "./Startups";

const [r1, r2, r3] = event.rounds;
const range = (r: { start: string; end: string }) => fmtRange(r.start, r.end);

// One counter for every numbered block, so the numbers can never skip.
const n = (i: number) => String(i).padStart(2, "0");

function Head({ num, title, id, children }: { num: string; title: string; id: string; children?: React.ReactNode }) {
  return (
    <header className="mb-10 md:mb-14">
      <Label className="border-t border-line pt-4">{num} — {title}</Label>
      <H2 id={id} className="mt-6 max-w-[22ch]">{children ?? title}</H2>
    </header>
  );
}

const Criteria = ({ list }: { list: readonly { label: string; weight: number }[] }) => (
  <dl className="mt-6 border-b border-line">
    {list.map((c) => (
      <div key={c.label} className="grid grid-cols-[1fr_auto] gap-4 border-t border-line py-3">
        <dt className="t-body">{c.label}</dt><dd className="t-label tabular m-0 text-fg">{c.weight} pts</dd>
      </div>
    ))}
  </dl>
);

// Brand names keep their own capitalisation ("Upstox courses"); the other prize items read as plain lower-case nouns.
const extras = event.prize.extras.map((x) => (x.startsWith("Upstox") ? x : x.toLowerCase())).join(", ");

const FAQ = [
  { q: "Who can take part?", a: event.eligibility },
  { q: "How big is a team?", a: `${event.team.min} to ${event.team.max} members. Teams can mix colleges and years. A team is locked when Round 1 registration closes.` },
  { q: "What does it cost?", a: `${event.fee}. Registration is on Unstop.` },
  { q: "Where do the rounds happen?", a: `Rounds 1 and 2 are online on Unstop. Round 3, the Boardroom Showdown, is on the NIT Warangal campus, ${range(r3)}.` },
  { q: "How do I get the WhatsApp group?", a: "Registered teams receive the invite directly from Unstop after registering." },
  { q: "What do winners receive?", a: `A ₹50,000 total prize pool, ${extras}. Participants receive a participation certificate; finalists a merit certificate and goodies.` },
];

/**
 * The Venture Vortex page. Lives in src/features/venture-vortex so it can be merged as-is; the wrapper carries data-theme="vortex",
 * so every club token below resolves to the Venture Vortex palette. All facts come from data/event.ts and data/startups.ts.
 * Hero: the official poster sits inside it (right column from 1024px, directly under the buttons below), never after it.
 */
export function VentureVortexPage() {
  const phase = currentPhase();
  const ended = spotlightIsEnded();
  let c = 1;
  return (
    <div data-theme="vortex" className="bg-bg text-fg">
      {ended && (
        <p role="status" className="t-label border-b border-line bg-surface px-5 py-3 pt-24 text-center text-fg md:pt-28">
          {event.name} 2026 has ended. This page stays as a record.
        </p>
      )}
      <section data-section={`${n(c)} — Venture Vortex`} aria-labelledby="vv-h" className={`relative isolate overflow-hidden pb-12 ${ended ? "pt-10 lg:pt-12" : "pt-28 lg:pt-32"} lg:pb-8`}>
        <Container className="grid gap-x-[clamp(32px,5vw,80px)] gap-y-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <Label className="border-t border-line pt-4">{n(c++)} — {event.organiser} · {event.fest}</Label>
            <H1 id="vv-h" className="mt-6"><MaskedText text={`${event.name} 2026`} immediate /></H1>
            <Lede className="mt-5 max-w-[26ch] text-body">{event.tagline}</Lede>
            <Body className="mt-5 max-w-[48ch]">Tear down one of 50 Indian startups, build a marketing or product strategy, and defend it live on campus.</Body>
            <p className="t-stat tabular mt-7 text-highlight">₹50,000</p>
            <Label className="mt-2">Total prize pool</Label>
            <div className="mt-6"><PhaseCountdown initial={phase} className="mb-3" /></div>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
              <PhaseActions initial={phase} then={{ label: "See the rounds", href: "#rounds" }} />
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <picture>
              <source type="image/avif" srcSet="/images/posters/vv-announcement-640.avif 640w, /images/posters/vv-announcement-1024.avif 1024w" sizes="(min-width: 1024px) 28rem, 90vw" />
              <img src="/images/posters/vv-announcement-1024.webp" srcSet="/images/posters/vv-announcement-640.webp 640w, /images/posters/vv-announcement-1024.webp 1024w" sizes="(min-width: 1024px) 28rem, 90vw"
                alt="Venture Vortex 2026 official poster: Decode the business, craft what's next." width={1024} height={1451} fetchPriority="high" decoding="async"
                className="h-auto w-auto max-w-full rounded-[2px] border border-line max-lg:max-w-[min(24rem,100%)] lg:max-h-[min(82svh,calc(100svh-10rem))]" style={{ backgroundImage: `url(${posterBlur["vv-announcement"]})`, backgroundSize: "cover" }} />
            </picture>
          </div>
        </Container>
      </section>

      <section data-section={`${n(c)} — Facts`} aria-labelledby="facts-h" className="border-y border-line py-12">
        <Container>
          <h2 id="facts-h" className="sr-only">{n(c++)} — Key facts</h2>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {[["Registration", range(event.registration)], ["Teams", `${event.team.min} to ${event.team.max} members`], ["Open to", "UG, PG and working professionals across India"], ["Entry", event.fee], ["Finale", `On campus, ${range(r3)}`]].map(([k, v]) => (
              <div key={k}><dt><Label>{k}</Label></dt><dd className="t-body mt-2">{v}</dd></div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="rounds" data-section={`${n(c)} — Rounds`} aria-labelledby="rounds-h" className="scroll-mt-24 py-20 md:py-28">
        <Container>
          <Head num={n(c++)} title="Rounds" id="rounds-h">Three rounds, one stage.</Head>
          <ol className="border-b border-line">
            {[r1, r2, r3].map((r) => (
              <li key={r.id} className="rule-draw grid gap-x-8 gap-y-1 py-6 md:grid-cols-[6rem_1fr_16rem]">
                <Label className="text-accent-text">Round {r.n}</Label>
                <div><H3>{r.name}</H3><Body className="mt-1">{r.subtitle}</Body></div>
                <Label className="tabular">{r.n === 1 ? "Submissions " : ""}{range(r)}<br />{r.mode}{r.n === 1 && <><br />Submissions close {dayTime(r.end)}<br />Registration {range(event.registration)}<br />Result {fmtDate(event.round1Result)}</>}</Label>
              </li>
            ))}
          </ol>
          <p className="t-ui mt-4 text-muted">Times are IST and follow the Unstop timeline.</p>
        </Container>
      </section>

      <section data-section={`${n(c)} — Round 1`} aria-labelledby="r1-h" className="bg-surface py-20 md:py-28">
        <Container>
          <Head num={n(c++)} title="Round 1" id="r1-h">Behind the Startup.</Head>
          <Lede className="max-w-[34ch]">{event.round1Objective}</Lede>
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <div>
              <Label as="h3" className="border-b border-line pb-3">Cover these seven areas</Label>
              {event.round1Areas.map((a, i) => (
                <details key={a.title} className="group border-b border-line">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 py-3">
                    <Label className="tabular">{n(i + 1)}</Label><span className="t-h3">{a.title}</span>
                  </summary>
                  <ul className="mb-4 ml-10 list-disc space-y-1 pl-4">{a.points.map((p) => <li key={p} className="t-body">{p}</li>)}</ul>
                </details>
              ))}
              <Body className="mt-6">{event.round1Insights}</Body>
            </div>
            <div>
              <Label as="h3">Deliver</Label>
              <Body className="mt-3">{event.round1Deliverable.deck} {event.round1Deliverable.titleSlide}</Body>
              <Label as="h3" className="mt-8">LinkedIn post (mandatory)</Label>
              <ul className="mt-3 list-disc space-y-1 pl-5">{event.round1Deliverable.linkedin.map((l) => <li key={l} className="t-body">{l}</li>)}</ul>
              <Label as="h3" className="mt-8">Judging</Label>
              <Criteria list={event.round1Criteria} />
            </div>
          </div>
        </Container>
      </section>

      <div className="py-20 md:py-28">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <section data-section={`${n(c)} — Round 2`} aria-labelledby="r2-h">
            <Label className="border-t border-line pt-4">{n(c++)} — Round 2 · {r2.name}</Label>
            <H2 id="r2-h" className="mt-6">Choose a vertical.</H2>
            <Body className="mt-4">Shortlisted teams pick one. Problem statements go to shortlisted teams only.</Body>
            <ul className="mt-6 border-b border-line">
              {event.round2Verticals.map((v) => (
                <li key={v.id} className="border-t border-line py-4"><H3>{v.id}. {v.name}</H3><p className="t-body mt-2">{v.items.join(" · ")}</p></li>
              ))}
            </ul>
          </section>
          <section data-section={`${n(c)} — Round 3`} aria-labelledby="r3-h">
            <Label className="border-t border-line pt-4">{n(c++)} — Round 3 · {r3.name}</Label>
            <H2 id="r3-h" className="mt-6">Defend it live.</H2>
            <Body className="mt-4">A live pitch and a boardroom defence on the NIT Warangal campus, {range(r3)}.</Body>
            <Criteria list={event.round3Criteria} />
          </section>
        </Container>
      </div>

      <Posters num={n(c++)} />

      <Startups num={n(c++)} />

      <section data-section={`${n(c)} — FAQ`} aria-labelledby="faq-h" className="bg-surface py-20 md:py-28">
        <Container>
          <Head num={n(c++)} title="FAQ" id="faq-h">Questions we get.</Head>
          <div className="max-w-3xl border-b border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="border-t border-line">
                <summary className="t-h3 flex min-h-14 cursor-pointer list-none items-center py-3">{f.q}</summary>
                <p className="t-body pb-5">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section data-section={`${n(c)} — Partners`} aria-labelledby="partners-h" className="py-20 md:py-28">
        <Container>
          <Head num={n(c++)} title="Partners" id="partners-h">Presented with.</Head>
          <ul className="border-b border-line">
            {partnersOf("venture-vortex-2026").map((s) => (
              <li key={s.name} className="grid gap-x-8 gap-y-1 border-t border-line py-4 md:grid-cols-[14rem_1fr]"><Label>{s.role}</Label><span className="t-h3">{s.name}</span></li>
            ))}
          </ul>
          <p className="t-ui mt-6 max-w-[62ch] text-muted">Names and logos belong to their owners and imply no endorsement beyond what is stated.</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ActionButton initial={phase} />
            <Button href={`mailto:${event.email}`} variant="secondary">{event.email}</Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
