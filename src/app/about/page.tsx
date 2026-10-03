import type { Metadata } from "next";
import { about } from "@/data/about";
import { event } from "@/data/event";
import { partnersOf } from "@/data/partners";
import { startups } from "@/data/startups";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { BrandLockup } from "@/components/ui/ClubMark";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Body, H2, Label, Lede } from "@/components/ui/Type";

export const metadata: Metadata = {
  title: "About",
  description: "Think. Connect. Create. Lead. How E-Club NIT Warangal reads its own line, who mentors the club, and how to join.",
  alternates: { canonical: "/about" },
};

const [r1, r2, r3] = event.rounds;
const partnerNames = partnersOf("venture-vortex-2026").filter((p) => p.slug !== "technozion").map((p) => p.name).join(", ");

// How we read the club's line, one word per programme step. Every claim is a fact in data/event.ts (the official brief, the Unstop timeline and the poster).
// The reading itself is an editorial framing by the tech team: it is listed in docs/COPY-REVIEW.md for the club to approve.
const WORDS = [
  { word: "Think.", where: `Round 1 · ${r1.name}`, text: `Teams take one of ${startups.length} startups apart: its journey, what sets it apart, how it makes money, its moat and its weaknesses, ending in two to four insights backed by evidence.` },
  { word: "Connect.", where: `Round 3 · ${r3.name}`, text: `The finale is live, on the NIT Warangal campus, in front of industry leaders from ${event.collaboration}, with ${partnerNames} behind the competition.` },
  { word: "Create.", where: `Round 2 · ${r2.name}`, text: `Shortlisted teams choose a vertical (${event.round2Verticals.map((v) => v.name).join(" or ")}) and build the strategy: positioning, channels, a first product, the numbers that would prove it.` },
  { word: "Lead.", where: `Round 3 · ${r3.name}`, text: `Teams defend their strategy in front of the room. Judging weighs ${event.round3Criteria.map((c) => c.label.toLowerCase()).join(", ")}.` },
] as const;

const INDEX = [["manifesto", "Manifesto"], ["words", "Our line, read"], ["mentor", "Mentor"], ["join", "Join"]] as const;

/** About: the club's line as a manifesto, then the four words read against what the club actually runs. Long-form, two columns, a sticky index on the left. */
export default function AboutPage() {
  return (
    <>
      <PageHeader number="01" label="About" title="Who we are" art="startup-ecosystem" lede={site.quote.line}>
        <div className="mb-10"><BrandLockup size={44} /></div>
      </PageHeader>

      <div className="bg-bg pb-[var(--section-y)] text-fg">
        <Container className="grid gap-x-[clamp(32px,5vw,96px)] gap-y-10 lg:grid-cols-[11rem_minmax(0,1fr)]">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <Label as="h2" className="border-t border-line pt-4">On this page</Label>
            <ul className="mt-2">{INDEX.map(([id, label]) => <li key={id}><a href={`#${id}`} className="t-ui inline-flex min-h-11 items-center underline-offset-4 hover:underline">{label}</a></li>)}</ul>
          </nav>

          <div className="max-w-[52rem]">
            <section id="manifesto" data-section="02 — Manifesto" aria-labelledby="manifesto-h" className="scroll-mt-28">
              <Label className="border-t border-line pt-4">02 — Manifesto</Label>
              <H2 id="manifesto-h" className="mt-6">{site.quote.club}</H2>
              <Lede className="mt-6 max-w-[34ch]">{about.mission ?? about.manifesto}</Lede>
              {site.foundedYear && <Label className="mt-8">Founded {site.foundedYear}</Label>}
            </section>

            <section id="words" data-section="03 — Our line" aria-labelledby="words-h" className="mt-[var(--section-y)] scroll-mt-28">
              <Label className="border-t border-line pt-4">03 — Our line</Label>
              <H2 id="words-h" className="mt-6">How we read it</H2>
              <Body className="mt-4">Our line, matched to the four steps of Venture Vortex 2026. This is how we read our own words, not a rule.</Body>
              <ol className="mt-8 border-b border-line">
                {WORDS.map((w) => (
                  <li key={w.word} className="rule-draw grid gap-x-8 gap-y-2 py-6 md:grid-cols-[11rem_1fr]">
                    <div><p className="t-h2">{w.word}</p><Label className="mt-2 text-accent-text">{w.where}</Label></div>
                    <Body>{w.text}</Body>
                  </li>
                ))}
              </ol>
            </section>

            {about.verticals.length > 0 && (
              <section id="verticals" data-section="04 — What we do" aria-labelledby="verticals-h" className="mt-[var(--section-y)] scroll-mt-28">
                <Label className="border-t border-line pt-4">04 — What we do</Label>
                <H2 id="verticals-h" className="mt-6">Year-round</H2>
                <ol className="mt-8 border-b border-line">{about.verticals.map((v) => (
                  <li key={v.name} className="rule-draw grid gap-x-8 gap-y-2 py-6 md:grid-cols-[11rem_1fr]"><p className="t-h3">{v.name}</p><Body>{v.description}</Body></li>
                ))}</ol>
              </section>
            )}

            {about.timeline.length > 0 && (
              <section id="timeline" data-section="05 — Timeline" aria-labelledby="timeline-h" className="mt-[var(--section-y)] scroll-mt-28">
                <Label className="border-t border-line pt-4">05 — Timeline</Label>
                <H2 id="timeline-h" className="mt-6">Year by year</H2>
                <ol className="mt-8 border-b border-line">{about.timeline.map((t) => (
                  <li key={t.year} className="rule-draw grid gap-2 py-5 md:grid-cols-[11rem_1fr]"><Label className="tabular">{t.year}</Label><Body>{t.text}</Body></li>
                ))}</ol>
              </section>
            )}

            {about.facultyCoordinator && (
              <section id="mentor" data-section="06 — Mentor" aria-labelledby="mentor-h" className="mt-[var(--section-y)] scroll-mt-28">
                <Label className="border-t border-line pt-4">06 — Mentor</Label>
                <H2 id="mentor-h" className="mt-6">Faculty mentor</H2>
                <Body className="mt-4">{about.facultyCoordinator}</Body>
              </section>
            )}

            <section id="join" data-section="07 — Join" aria-labelledby="join-h" className="mt-[var(--section-y)] scroll-mt-28">
              <Label className="border-t border-line pt-4">07 — Join</Label>
              <H2 id="join-h" className="mt-6">Take part</H2>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4"><Button href="/contact#join">Join the club</Button><Button href="/initiatives" variant="secondary">See initiatives</Button><Button href="/team" variant="secondary">Meet the team</Button></div>
            </section>
          </div>
        </Container>
      </div>
    </>
  );
}
