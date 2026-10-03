import type { Metadata } from "next";
import { site } from "@/data/site";
import { ContactBoxA, ContactBoxB } from "@/components/ui/ContactBoxes";
import { ContactLedger } from "@/components/ui/ContactLedger";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Label } from "@/components/ui/Type";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ask E-Club NIT Warangal a question, join the club, or write to us about sponsorship and partnership. Email, Instagram and LinkedIn.",
  alternates: { canonical: "/contact" },
};

/** Contact: the club's public contact points on top, then two separate boxes side by side (stacked below 1024px): club contact and queries, and sponsorship and partnership. */
export default function ContactPage() {
  return (
    <>
      <PageHeader number="01" label="Contact" title="Get in touch" art="boardroom-table" lede="Two boxes: one for the club, one for sponsors and partners." />
      <div className="bg-bg pb-[var(--section-y)] text-fg">
        <Container>
          <Label className="mb-4 border-t border-line pt-4">02 — Find us</Label>
          <div className="max-w-3xl">
            <ContactLedger />
            {site.campusLine && (
              <>
                <p className="t-body mt-6">{site.campusLine.text}</p>
                <Label className="mt-2 normal-case tracking-normal">Source: {site.campusLine.source}</Label>
              </>
            )}
          </div>

          <Label className="mb-6 mt-[var(--section-y)] border-t border-line pt-4">03 — Write to us</Label>
          <div className="grid items-stretch gap-8 lg:grid-cols-2">
            <ContactBoxA to={site.email} />
            <ContactBoxB to={site.email} />
          </div>
        </Container>
      </div>
    </>
  );
}
