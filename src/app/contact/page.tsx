import type { Metadata } from "next";
import { site } from "@/data/site";
import { ContactForm } from "@/components/ui/ContactForm";
import { ContactLedger } from "@/components/ui/ContactLedger";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Label } from "@/components/ui/Type";

export const metadata: Metadata = {
  title: "Contact",
  description: "Join E-Club NIT Warangal, ask a question, write to us or propose a partnership. Email, Instagram and LinkedIn.",
  alternates: { canonical: "/contact" },
};

/** Contact: the club's public contact points on the left, one tabbed form on the right (Join, Query, Contact, Sponsor / Partnership; the URL hash picks the tab). */
export default function ContactPage() {
  return (
    <>
      <PageHeader number="01" label="Contact" title="Get in touch" art="boardroom-table" lede="Pick what fits, or write to us directly." />
      <div className="bg-bg pb-[var(--section-y)] text-fg">
        <Container className="grid gap-[clamp(32px,5vw,96px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <Label className="mb-4 border-t border-line pt-4">02 — Find us</Label>
            <ContactLedger />
            {site.campusLine && (
              <>
                <p className="t-body mt-6">{site.campusLine.text}</p>
                <Label className="mt-2 normal-case tracking-normal">Source: {site.campusLine.source}</Label>
              </>
            )}
          </div>
          <div>
            <Label className="mb-6 border-t border-line pt-4">03 — Write to us</Label>
            <ContactForm to={site.email} />
          </div>
        </Container>
      </div>
    </>
  );
}
