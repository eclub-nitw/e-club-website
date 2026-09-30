import type { Metadata } from "next";
import Link from "next/link";
import { sponsors } from "@/data/sponsors";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SponsorLogo } from "@/components/ui/SponsorLogo";

export const metadata: Metadata = {
  title: "Sponsors and partners",
  description: "Organisations that have backed the Entrepreneurship Club of NIT Warangal, and how to partner with us.",
  alternates: { canonical: "/sponsors" },
};

export default function SponsorsPage() {
  const listed = sponsors.filter((s) => s.consent);
  return (
    <>
      <PageHeader number="01" label="Sponsors and partners" title="Partners who back the club" lede="Sponsors and collaborators make our events possible. Here is who they are and how to join them." />
      {listed.length > 0 && (
        <Section id="wall" number="02" title="Past partners" tone="paper">
          <ul className="flex flex-wrap items-center gap-x-12 gap-y-8">{listed.map((s) => <li key={s.name}><SponsorLogo sponsor={s} /></li>)}</ul>
          <p className="mt-10 max-w-[60ch] text-sm text-muted">Names and logos are trademarks of their owners and appear with their permission. Their appearance here does not imply endorsement unless stated. See our <Link href="/disclaimer" className="text-link underline underline-offset-4">disclaimer</Link>.</p>
        </Section>
      )}
      <Section id="partner" number={listed.length ? "03" : "02"} title="Partner with us" tone={listed.length ? "ink" : "paper"}>
        <p className="max-w-[58ch] text-lg leading-relaxed text-muted">To sponsor or collaborate on an event, write to us and tell us what you have in mind. We will reply with what is possible.</p>
        <div className="mt-8"><Button href={`mailto:${site.email}?subject=${encodeURIComponent("Partnership enquiry")}`}>Email {site.email}</Button></div>
      </Section>
    </>
  );
}
