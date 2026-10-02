import { event } from "@/data/event";
import { fmtDate, fmtRange } from "@/lib/format";
import { currentPhase, dayTime } from "@/lib/phase";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ActionButton, PhaseActions, PhaseCountdown } from "@/components/ui/PhaseActions";
import { MaskedText } from "@/components/ui/MaskedText";
import { Body, H1, H2, H3, Label, Lede } from "@/components/ui/Type";
import { posterBlur } from "@/data/poster-blur";
import { sponsors } from "@/data/sponsors";
import { Startups } from "./Startups";

const [r1, r2, r3] = event.rounds;
const range = (r: { start: string; end: string }) => fmtRange(r.start, r.end);

function Head({ n, title, id, children }: { n: string; title: string; id: string; children?: React.ReactNode }) {
  return (
    <header className="mb-10 md:mb-14">
      <Label className="border-t border-line pt-4">{n} — {title}</Label>
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

const FAQ = [
  { q: "Who can take part?", a: event.eligibility },
  { q: "How big is a team?", a: `${event.team.min} to ${event.team.max} members. Teams can mix colleges and years. A team is locked when Round 1 registration closes.` },
  { q: "What does it cost?", a: `${event.fee}. Registration is on Unstop.` },
  { q: "Where do the rounds happen?", a: `Rounds 1 and 2 are online on Unstop. Round 3, the Boardroom Showdown, is on the NIT Warangal campus, ${range(r3)}.` },
  { q: "How do I get the WhatsApp group?", a: "Registered teams receive the invite directly from Unstop after registering." },
  { q: "What do winners receive?", a: `A ₹50,000 total prize pool, ${event.prize.extras.join(", ").toLowerCase()}. Participants receive a participation certificate; finalists a merit certificate and goodies.` },
];

/**
 * The Venture Vortex page. Lives in src/features/venture-vortex so it can be merged as-is; the wrapper carries data-theme="vortex",
 * so every club token below resolves to the Venture Vortex palette. All facts come from data/event.ts and data/startups.ts.
 */
export function VentureVortexPage() {
  const phase = currentPhase();
  return (
    <div data-theme="vortex" className="bg-bg text-fg">
      <section data-section="01 — Venture Vortex" aria-labelledby="vv-h" className="relative isolate overflow-hidden pb-20 pt-32 md:pb-28 md:pt-44">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-20">
          <div>
            <Label className="border-t border-line pt-4">{event.organiser} · {event.fest}</Label>
            <H1 id="vv-h" className="mt-6"><MaskedText text={`${event.name} 2026`} immediate /></H1>
            <Lede className="mt-6 max-w-[26ch] text-body">{event.tagline}</Lede>
            <Body className="mt-6">Tear down one of 50 Indian startups, build a marketing or product strategy, and defend it live on campus.</Body>
            <p className="t-stat tabular mt-8 text-highlight">₹50,000</p>
            <Label className="mt-2">Total prize pool</Label>
            <div className="mt-8"><PhaseCountdown initial={phase} className="mb-3" /></div>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <PhaseActions initial={phase} then={{ label: "See the rounds", href: "#rounds" }} />
            </div>
          </div>
          <picture className="mx-auto block w-full max-w-sm">
            <source type="image/avif" srcSet="/images/posters/vv-announcement-640.avif 640w, /images/posters/vv-announcement-1024.avif 1024w" sizes="24rem" />
            <img src="/images/posters/vv-announcement-1024.webp" srcSet="/images/posters/vv-announcement-640.webp 640w, /images/posters/vv-announcement-1024.webp 1024w" sizes="24rem"
              alt="Venture Vortex 2026 official poster: Decode the business, craft what's next." width={1024} height={1451} fetchPriority="high" decoding="async"
              className="w-full rounded-[2px] border border-line" style={{ backgroundImage: `url(${posterBlur["vv-announcement"]})`, backgroundSize: "cover" }} />
          </picture>
        </Container>
      </section>

      <section data-section="02 — Facts" aria-labelledby="facts-h" className="border-y border-line py-12">
        <Container>
          <h2 id="facts-h" className="sr-only">Key facts</h2>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {[["Registration", range(event.registration)], ["Teams", `${event.team.min} to ${event.team.max} members`], ["Open to", "UG, PG and working professionals across India"], ["Entry", event.fee], ["Finale", `On campus, ${range(r3)}`]].map(([k, v]) => (
              <div key={k}><dt><Label>{k}</Label></dt><dd className="t-body mt-2">{v}</dd></div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="rounds" data-section="03 — Rounds" aria-labelledby="rounds-h" className="scroll-mt-24 py-20 md:py-28">
        <Container>
          <Head n="03" title="Rounds" id="rounds-h">Three rounds, one stage.</Head>
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

      <section data-section="04 — Round 1" aria-labelledby="r1-h" className="bg-surface py-20 md:py-28">
        <Container>
          <Head n="04" title="Round 1" id="r1-h">Behind the Startup.</Head>
          <Lede className="max-w-[34ch]">{event.round1Objective}</Lede>
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <div>
              <Label as="h3" className="border-b border-line pb-3">Cover these seven areas</Label>
              {event.round1Areas.map((a, i) => (
                <details key={a.title} className="group border-b border-line">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 py-3">
                    <Label className="tabular">{String(i + 1).padStart(2, "0")}</Label><span className="t-h3">{a.title}</span>
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

      <section data-section="05 — Rounds 2 and 3" aria-labelledby="r23-h" className="py-20 md:py-28">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <Label className="border-t border-line pt-4">Round 2 · {r2.name}</Label>
            <H2 id="r23-h" className="mt-6">Choose a vertical.</H2>
            <Body className="mt-4">Shortlisted teams pick one. Problem statements go to shortlisted teams only.</Body>
            <ul className="mt-6 border-b border-line">
              {event.round2Verticals.map((v) => (
                <li key={v.id} className="border-t border-line py-4"><H3>{v.id}. {v.name}</H3><p className="t-body mt-2">{v.items.join(" · ")}</p></li>
              ))}
            </ul>
          </div>
          <div>
            <Label className="border-t border-line pt-4">Round 3 · {r3.name}</Label>
            <H2 className="mt-6">Defend it live.</H2>
            <Body className="mt-4">A live pitch and a boardroom defence on the NIT Warangal campus, {range(r3)}.</Body>
            <Criteria list={event.round3Criteria} />
          </div>
        </Container>
      </section>

      <Startups />

      <section data-section="07 — FAQ" aria-labelledby="faq-h" className="bg-surface py-20 md:py-28">
        <Container>
          <Head n="07" title="FAQ" id="faq-h">Questions we get.</Head>
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

      <section data-section="08 — Partners" aria-labelledby="partners-h" className="py-20 md:py-28">
        <Container>
          <Head n="08" title="Partners" id="partners-h">Presented with.</Head>
          <ul className="border-b border-line">
            {sponsors.map((s) => (
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
