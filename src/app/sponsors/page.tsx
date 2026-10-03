import type { Metadata } from "next";
import Link from "next/link";
import { partnersOf } from "@/data/partners";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { PartnerGrid } from "@/components/ui/PartnerGrid";
import { Section } from "@/components/ui/Section";
import { Body, H3, Label } from "@/components/ui/Type";

export const metadata: Metadata = {
  title: "Sponsors and partners",
  description: "Who partners with E-Club NIT Warangal, and who is behind Venture Vortex 2026. Write to us to sponsor or collaborate.",
  alternates: { canonical: "/sponsors" },
};

/**
 * Two lists that must not be confused: the club's own sponsors and partners (empty until the club has some on record) and the partners of one
 * competition, Venture Vortex 2026. Offers and tiers are not listed: the club has not supplied any (docs/CONTENT-GAPS.md).
 */
export default function SponsorsPage() {
  const club = partnersOf("club");
  return (
    <>
      <PageHeader number="01" label="Sponsors and partners" title="Who stands with the club" art="sponsors-band" lede="Club sponsors first, then the partners of this year's competition." />

      <Section id="club" number="02" title="Club" heading="Club sponsors and partners" tone="paper">
        {club.length > 0 ? <PartnerGrid list={club} /> : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <H3>No club-wide sponsor or partner is listed yet.</H3>
              <Body className="mt-4">When the club agrees one, it appears here with its role. Partners of a single competition are listed below, under that competition.</Body>
            </div>
            <div>
              <Label className="mb-3">Want to be the first?</Label>
              <Button href="/contact#sponsor">Sponsor or partner with us</Button>
            </div>
          </div>
        )}
        {site.brochureUrl && <p className="mt-8"><a className="text-link underline underline-offset-4" href={site.brochureUrl} target="_blank" rel="noopener noreferrer">Sponsorship brochure<span className="sr-only"> (opens in a new tab)</span></a></p>}
      </Section>

      <Section id="vortex-partners" number="03" title="This year" heading="Venture Vortex 2026 partners" line="Named on the official poster. They partner with this competition, not with the club as a whole.">
        <PartnerGrid list={partnersOf("venture-vortex-2026")} />
        <p className="t-ui mt-8 max-w-[62ch] text-body">
          Names are trademarks of their owners and appear as plain text unless their written permission is on record; appearing here does not imply endorsement unless stated. See our <Link href="/disclaimer" className="text-link underline underline-offset-4">disclaimer</Link>.
        </p>
        <div className="mt-6"><Button href="/venture-vortex" variant="link">About Venture Vortex 2026 →</Button></div>
      </Section>
    </>
  );
}
