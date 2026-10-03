import type { Metadata } from "next";
import { about } from "@/data/about";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { BrandLockup } from "@/components/ui/ClubMark";
import { Container } from "@/components/ui/Container";
import { ContactLedger } from "@/components/ui/ContactLedger";
import { PageHeader } from "@/components/ui/PageHeader";
import { Body, H2, Label, Lede } from "@/components/ui/Type";

export const metadata: Metadata = {
  title: "About",
  description: "Think. Connect. Create. Lead. Who E-Club NIT Warangal is, how it reads its own line, who mentors it and how to find it.",
  alternates: { canonical: "/about" },
};

// A reading of the club's four words, not a claim about what the club does. Every line is CONFIRM (docs/COPY-REVIEW.md): the owner approves or rewrites them.
const WORDS = [
  { word: "Think.", text: "Start with the question." },
  { word: "Connect.", text: "Meet the people who can answer it." },
  { word: "Create.", text: "Build the thing." },
  { word: "Lead.", text: "Carry it forward." },
] as const;

type Block = { id: string; label: string; title: string; show: boolean; body: React.ReactNode };

/** About: club-generic. A manifesto, the four words read as a ledger, the faculty mentor, a pointer to Initiatives and the contact points. Long-form, two columns, a sticky index on the left; blocks without data are not rendered and the numbers stay sequential. */
export default function AboutPage() {
  const blocks: Block[] = [
    {
      id: "manifesto", label: "Manifesto", title: site.quote.club, show: true,
      body: (<>
        <Lede className="mt-6 max-w-[34ch]">{about.mission ?? about.manifesto}</Lede>
        {site.foundedYear && <Label className="mt-8">Founded {site.foundedYear}</Label>}
      </>),
    },
    {
      id: "words", label: "Our line, read", title: "How we read it", show: true,
      body: (<>
        <Body className="mt-4">The club&apos;s four words, one line each. This is how we read our own line, not a rule.</Body>
        <ol className="mt-8 border-b border-line">
          {WORDS.map((w) => (
            <li key={w.word} className="rule-draw grid gap-x-8 gap-y-2 py-8 md:grid-cols-[14rem_1fr] md:items-baseline">
              <p className="t-h1">{w.word}</p>
              <Lede>{w.text}</Lede>
            </li>
          ))}
        </ol>
      </>),
    },
    {
      id: "verticals", label: "What we do", title: "Year-round", show: about.verticals.length > 0,
      body: (
        <ol className="mt-8 border-b border-line">{about.verticals.map((v) => (
          <li key={v.name} className="rule-draw grid gap-x-8 gap-y-2 py-6 md:grid-cols-[11rem_1fr]"><p className="t-h3">{v.name}</p><Body>{v.description}</Body></li>
        ))}</ol>
      ),
    },
    {
      id: "timeline", label: "Timeline", title: "Year by year", show: about.timeline.length > 0,
      body: (
        <ol className="mt-8 border-b border-line">{about.timeline.map((t) => (
          <li key={t.year} className="rule-draw grid gap-2 py-5 md:grid-cols-[11rem_1fr]"><Label className="tabular">{t.year}</Label><Body>{t.text}</Body></li>
        ))}</ol>
      ),
    },
    { id: "mentor", label: "Mentor", title: "Faculty mentor", show: !!about.facultyCoordinator, body: <Body className="mt-4">{about.facultyCoordinator}</Body> },
    {
      id: "run", label: "What we run", title: "What we run", show: true,
      body: (<>
        <Body className="mt-4">The competitions and pitch sessions we run, with their status, are on the Initiatives page.</Body>
        <div className="mt-6"><Button href="/initiatives" variant="link">See initiatives →</Button></div>
      </>),
    },
    {
      id: "find", label: "Find us", title: "Find us", show: true,
      body: (<>
        <div className="mt-6"><ContactLedger /></div>
        {site.campusLine && <Body className="mt-6">{site.campusLine.text}</Body>}
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4"><Button href="/contact#join">Join the club</Button><Button href="/team" variant="secondary">Meet the team</Button></div>
      </>),
    },
  ].filter((b) => b.show);

  return (
    <>
      <PageHeader number="01" label="About" title="Who we are" art="startup-ecosystem" lede={site.quote.line}>
        <div className="mb-10"><BrandLockup size={64} /></div>
      </PageHeader>

      <div className="bg-bg pb-[var(--section-y)] text-fg">
        <Container className="grid gap-x-[clamp(32px,5vw,96px)] gap-y-10 lg:grid-cols-[11rem_minmax(0,1fr)]">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <Label as="h2" className="border-t border-line pt-4">On this page</Label>
            <ul className="mt-2">{blocks.map((b) => <li key={b.id}><a href={`#${b.id}`} className="t-ui inline-flex min-h-11 items-center underline-offset-4 hover:underline">{b.label}</a></li>)}</ul>
          </nav>

          <div className="max-w-[52rem]">
            {blocks.map((b, i) => {
              const num = String(i + 2).padStart(2, "0");
              return (
                <section key={b.id} id={b.id} data-section={`${num} — ${b.label}`} aria-labelledby={`${b.id}-h`} className={`scroll-mt-28 ${i > 0 ? "mt-[var(--section-y)]" : ""}`}>
                  <Label className="border-t border-line pt-4">{num} — {b.label}</Label>
                  <H2 id={`${b.id}-h`} className="mt-6">{b.title}</H2>
                  {b.body}
                </section>
              );
            })}
          </div>
        </Container>
      </div>
    </>
  );
}
