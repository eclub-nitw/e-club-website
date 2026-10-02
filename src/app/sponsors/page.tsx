import type { Metadata } from "next";
import Link from "next/link";
import { sponsors } from "@/data/sponsors";
import { site } from "@/data/site";
import { Art } from "@/components/ui/Art";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SponsorLogo } from "@/components/ui/SponsorLogo";
import { Body, H3, Label } from "@/components/ui/Type";

export const metadata: Metadata = {
  title: "Sponsors and partners",
  description: "Organisations that have backed E-Club NIT Warangal, and how to partner with us.",
  alternates: { canonical: "/sponsors" },
};

const TIERS = [
  { name: "Flagship partner", text: "Back Venture Vortex 2026, our all-India startup strategy competition." },
  { name: "Event partner", text: "Support a single session, workshop or competition round." },
  { name: "Community partner", text: "Collaborate with us in kind: venues, mentors, tools, prizes." },
] as const; // CONFIRM: tier names are draft structure only; the club decides real tiers and terms

/** Sponsors: logos only with recorded consent, tiers as ledger rows, and a "Partner with us" panel with an email slot (no phone numbers). */
export default function SponsorsPage() {
  const listed = sponsors.filter((s) => s.consent);
  let n = 1;
  return (
    <>
      <PageHeader number="01" label="Sponsors and partners" title="Partners who back the club" art="sponsors-band" lede="Sponsors and collaborators make our events possible." />
      {listed.length > 0 && (
        <Section id="wall" number={String(++n).padStart(2, "0")} title="Past partners" heading="Who has backed us" tone="paper">
          <ul className="flex flex-wrap items-center gap-x-12 gap-y-8">{listed.map((s) => <li key={s.name}><SponsorLogo sponsor={s} /></li>)}</ul>
          <Label className="mt-10 max-w-[60ch] normal-case tracking-normal">Names and logos are trademarks of their owners and appear with their permission. Their appearance here does not imply endorsement unless stated. See our <Link href="/disclaimer" className="text-link underline underline-offset-4">disclaimer</Link>.</Label>
        </Section>
      )}
      <Section id="tiers" number={String(++n).padStart(2, "0")} title="Ways to partner" heading="Three ways in" tone={listed.length ? "ink" : "paper"}>
        <ol>{TIERS.map((t, i) => (
          <li key={t.name} className="rule-draw grid gap-x-8 gap-y-2 py-6 md:grid-cols-[3rem_1fr_2fr]">
            <Label className="pt-2">{String(i + 1).padStart(2, "0")}</Label><H3>{t.name}</H3><Body>{t.text}</Body>
          </li>
        ))}</ol>
      </Section>
      <Section id="partner" number={String(++n).padStart(2, "0")} title="Partner with us" bare tone={listed.length ? "paper" : "ink"} className="isolate overflow-hidden py-24 md:py-32">
        {!listed.length && <div aria-hidden="true" className="absolute inset-0 -z-10"><Art name="sponsors-band" sizes="100vw" className="size-full object-cover" /><div className="art-veil absolute inset-0" style={{ "--veil": "84%" } as React.CSSProperties} /></div>}
        <Container>
          <Label className="border-t border-line pt-4">{String(n).padStart(2, "0")} — Partner with us</Label>
          <Body className="mt-8 max-w-[52ch]">To sponsor or collaborate on an event, write to us and tell us what you have in mind. We will reply with what is possible.</Body>
          <div className="mt-8"><Button href={`mailto:${site.email}?subject=${encodeURIComponent("Partnership enquiry")}`}>Email {site.email}</Button></div>
        </Container>
      </Section>
    </>
  );
}
