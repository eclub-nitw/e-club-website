import Link from "next/link";
import { copy } from "@/data/copy";
import { sponsors } from "@/data/sponsors";
import { Art } from "@/components/ui/Art";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SponsorLogo } from "@/components/ui/SponsorLogo";
import { Body, H2, Label } from "@/components/ui/Type";
import { PartnerMarquee } from "./PartnerMarquee";

/**
 * Chapter 08, the investors slide. Consented partner logos run as a marquee over the generated sponsors-band art; with none on record
 * the slide says so plainly and invites the first partner. No logo is shown without recorded consent (see data/sponsors.ts).
 */
export function Investors() {
  const listed = sponsors.filter((s) => s.consent);
  return (
    <Section id="investors" number="08" title="Investors" heading={copy.investors.heading[0]} bare className="isolate overflow-hidden py-24 md:py-36">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Art name="sponsors-band" sizes="100vw" className="size-full object-cover" />
        <div className="art-veil absolute inset-0" style={{ "--veil": "80%" } as React.CSSProperties} />
      </div>
      <Container>
        <Label className="border-t border-line pt-4">08 — Investors</Label>
        <H2 id="investors-h" className="mt-6 max-w-[18ch]">{copy.investors.heading[0]}</H2>
        {listed.length > 0 ? (
          <div className="mt-12">
            <PartnerMarquee>{listed.map((p) => <li key={p.name}><SponsorLogo sponsor={p} /></li>)}</PartnerMarquee>
            <Label className="mt-6 max-w-[60ch] normal-case tracking-normal">Names and logos belong to their owners; see our <Link href="/disclaimer" className="text-link underline underline-offset-4">disclaimer</Link>.</Label>
          </div>
        ) : (
          <div className="mt-10">
            <Body>{copy.investors.body}</Body>
            <div className="mt-8"><Button href="/sponsors">Partner with us</Button></div>
          </div>
        )}
      </Container>
    </Section>
  );
}
