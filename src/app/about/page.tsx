import type { Metadata } from "next";
import { about } from "@/data/about";
import { site } from "@/data/site";
import { event } from "@/data/event";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Body, H3, Label, Lede } from "@/components/ui/Type";

export const metadata: Metadata = {
  title: "About",
  description: "E-Club NIT Warangal: who we are, what we run and how to join. Flagship: Venture Vortex 2026.",
  alternates: { canonical: "/about" },
};

// Verified rows only: the flagship is a fact (data/event.ts). Verticals appear when the club supplies them (data/about.ts).
const FLAGSHIP_AREA = { name: "Competitions", text: `${event.name} 2026 is our flagship: an all-India startup strategy competition with a ₹50,000 prize pool.` };

/** About: generated-art header, the club in a serif lede, what we do as ledger rows, a faculty line only if confirmed, how to join. */
export default function AboutPage() {
  const areas = about.verticals.length ? about.verticals.map((v) => ({ name: v.name, text: v.description })) : [FLAGSHIP_AREA];
  let n = 1;
  const next = () => ({ number: String(++n).padStart(2, "0"), tone: (n % 2 === 0 ? "paper" : "ink") as "paper" | "ink" });
  return (
    <>
      <PageHeader number="01" label="About" title="Who we are" art="startup-ecosystem" />

      {(() => { const s = next(); return (
        <Section id="who" number={s.number} title="The club" heading="In short" tone={s.tone}>
          <Lede className="max-w-[34ch]">{about.mission ?? about.manifesto}</Lede>
          {site.foundedYear && <Label className="mt-8">Founded {site.foundedYear}</Label>}
          {about.facultyCoordinator && <Label className="mt-8">Faculty mentor · {about.facultyCoordinator}</Label>}
        </Section>
      ); })()}

      {(() => { const s = next(); return (
        <Section id="verticals" number={s.number} title="What we do" heading="What we do" tone={s.tone}>
          <ol>{areas.map((a, i) => (
            <li key={a.name} className="rule-draw grid gap-x-8 gap-y-2 py-6 md:grid-cols-[3rem_1fr_2fr]">
              <Label className="pt-2">{String(i + 1).padStart(2, "0")}</Label>
              <H3>{a.name}</H3>
              <Body>{a.text}</Body>
            </li>
          ))}</ol>
          {!about.verticals.length && <Body className="mt-8">More programmes will be listed here as the club confirms them.</Body>}
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
          <div className="flex flex-wrap gap-x-8 gap-y-4"><Button href="/contact#join">Join the club</Button><Button href="/initiatives" variant="secondary">See initiatives</Button><Button href="/team" variant="secondary">Meet the team</Button></div>
        </Section>
      ); })()}
    </>
  );
}
