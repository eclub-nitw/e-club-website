import type { Metadata } from "next";
import { about } from "@/data/about";
import { copy } from "@/data/copy";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Body, H3, Label, Lede } from "@/components/ui/Type";

export const metadata: Metadata = {
  title: "About",
  description: "About the Entrepreneurship Club (E-Club) of NIT Warangal: who we are and what we run.",
  alternates: { canonical: "/about" },
};

/** About: workshop-art header, the club description as a serif lede, areas as ledger rows, timeline only with club-supplied dates, how to join. */
export default function AboutPage() {
  const areas = about.verticals.length ? about.verticals.map((v) => ({ name: v.name, text: v.description })) : copy.solution.areas.map((a) => ({ name: a.name, text: a.text }));
  let n = 1;
  const next = () => ({ number: String(++n).padStart(2, "0"), tone: (n % 2 === 0 ? "paper" : "ink") as "paper" | "ink" });
  return (
    <>
      <PageHeader number="01" label="About" title="Who we are" art="workshop" />

      {(() => { const s = next(); return (
        <Section id="who" number={s.number} title="The club" heading="In our words" tone={s.tone}>
          <Lede className="max-w-[30ch]">{about.mission ?? copy.solution.lede[0]}</Lede>
          {site.foundedYear && <Label className="mt-8">Founded {site.foundedYear}</Label>}
        </Section>
      ); })()}

      {(() => { const s = next(); return (
        <Section id="verticals" number={s.number} title="What we do" heading="Where we spend our time" tone={s.tone}>
          <ol>{areas.map((a, i) => (
            <li key={a.name} className="rule-draw grid gap-x-8 gap-y-2 py-6 md:grid-cols-[3rem_1fr_2fr]">
              <Label className="pt-2">{String(i + 1).padStart(2, "0")}</Label>
              <H3>{a.name}</H3>
              <Body>{a.text}</Body>
            </li>
          ))}</ol>
        </Section>
      ); })()}

      {about.timeline.length > 0 && (() => { const s = next(); return (
        <Section id="timeline" number={s.number} title="Timeline" heading="Year by year" tone={s.tone}>
          <ol>{about.timeline.map((t) => (
            <li key={t.year} className="rule-draw grid gap-2 py-5 md:grid-cols-[8rem_1fr] md:gap-10"><Label className="tabular">{t.year}</Label><Body>{t.text}</Body></li>
          ))}</ol>
        </Section>
      ); })()}

      {(() => { const s = next(); return (
        <Section id="join" number={s.number} title="How to join" heading="Take part" tone={s.tone}>
          {about.facultyCoordinator && <Body className="mb-8">Faculty coordinator: {about.facultyCoordinator}</Body>}
          <div className="flex flex-wrap gap-x-8 gap-y-4"><Button href="/join">How to join</Button><Button href="/events" variant="secondary">See our events</Button><Button href="/team" variant="secondary">Meet the team</Button></div>
        </Section>
      ); })()}
    </>
  );
}
