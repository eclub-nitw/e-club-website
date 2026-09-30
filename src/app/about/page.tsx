import type { Metadata } from "next";
import { about } from "@/data/about";
import { site } from "@/data/site";
import { Button, Container, PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "About the Entrepreneurship Club (E-Club) of NIT Warangal: who we are and what we run.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  let n = 1;
  const next = () => ({ number: String(++n).padStart(2, "0"), tone: (n % 2 === 0 ? "paper" : "ink") as "paper" | "ink" });
  return (
    <>
      <PageHeader
        number="01" label="About" title="Who we are"
        lede={about.mission ?? "The Entrepreneurship Club (E-Club) is the student entrepreneurship community of NIT Warangal. We run events, competitions and speaker sessions for student founders."}
      />
      {site.foundedYear && <div className="bg-bg pb-10 text-fg"><Container><p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">Founded {site.foundedYear}</p></Container></div>}

      {about.verticals.length > 0 && (() => { const s = next(); return (
        <Section id="verticals" number={s.number} title="What we do" tone={s.tone}>
          <dl className="border-b border-line">{about.verticals.map((v) => (
            <div key={v.name} className="grid gap-2 border-t border-line py-6 md:grid-cols-[1fr_2fr] md:gap-10"><dt className="font-display text-2xl font-medium">{v.name}</dt><dd className="text-muted">{v.description}</dd></div>
          ))}</dl>
        </Section>
      ); })()}

      {about.timeline.length > 0 && (() => { const s = next(); return (
        <Section id="timeline" number={s.number} title="Year by year" tone={s.tone}>
          <ol className="border-b border-line">{about.timeline.map((t) => (
            <li key={t.year} className="grid gap-2 border-t border-line py-5 md:grid-cols-[8rem_1fr] md:gap-10"><span className="font-mono text-sm tabular text-muted">{t.year}</span><span>{t.text}</span></li>
          ))}</ol>
        </Section>
      ); })()}

      {(() => { const s = next(); return (
        <Section id="next" number={s.number} title="Take part" tone={s.tone}>
          {about.facultyCoordinator && <p className="mb-8 text-muted">Faculty coordinator: {about.facultyCoordinator}</p>}
          <div className="flex flex-wrap gap-3"><Button href="/events">See our events</Button><Button href="/team" variant="secondary">Meet the team</Button></div>
        </Section>
      ); })()}
    </>
  );
}
