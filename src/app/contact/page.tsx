import type { Metadata } from "next";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/ui/ContactForm";
import { LedgerRow } from "@/components/ui/LedgerRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { Label } from "@/components/ui/Type";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email E-Club NIT Warangal, ask to join, or find us on Instagram and LinkedIn.",
  alternates: { canonical: "/contact" },
};

const ext = "text-link underline underline-offset-4 hover:no-underline";
const newTab = <span className="sr-only"> (opens in a new tab)</span>;

export default function ContactPage() {
  return (
    <>
      <PageHeader number="01" label="Contact" title="Get in touch" art="boardroom-table" lede="Email is the quickest way to reach us." />
      <div className="bg-bg pb-28 text-fg">
        <Container className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <div>
            <Label className="mb-6 border-t border-line pt-4">02 — Write to us</Label>
            <ContactForm to={site.email} subject="Message from the E-Club website" />
          </div>
          <div>
            <Label className="mb-2 border-t border-line pt-4">03 — Or find us</Label>
            <dl className="border-b border-line">
              <LedgerRow label="Email"><a className={ext} href={`mailto:${site.email}`}>{site.email}</a></LedgerRow>
              <LedgerRow label="Instagram"><a className={ext} href={site.instagram} target="_blank" rel="noopener noreferrer">@eclubnitw{newTab}</a></LedgerRow>
              <LedgerRow label="LinkedIn"><a className={ext} href={site.linkedin} target="_blank" rel="noopener noreferrer">Entrepreneurship Club-NIT Warangal{newTab}</a></LedgerRow>
              {site.youtube && <LedgerRow label="YouTube"><a className={ext} href={site.youtube} target="_blank" rel="noopener noreferrer">Our channel{newTab}</a></LedgerRow>}
              <LedgerRow label="Location">NIT Warangal, {site.address.locality}, {site.address.region}, India</LedgerRow>
            </dl>
          </div>
        </Container>
        <Container className="mt-24 grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <div id="join" className="scroll-mt-28">
            <Label className="mb-6 border-t border-line pt-4">04 — Join the club</Label>
            <ContactForm to={site.email} subject="Join E-Club NIT Warangal" />
          </div>
          <div>
            <Label className="mb-2 border-t border-line pt-4">Before you write</Label>
            <p className="t-body mt-4">Tell us your name, year and branch, and what you would like to work on. Recruitment dates are announced on our Instagram and LinkedIn pages.</p>
            {site.recruitmentUrl && <p className="mt-6"><a className={ext} href={site.recruitmentUrl} target="_blank" rel="noopener noreferrer">Open recruitment form{newTab}</a></p>}
          </div>
        </Container>
      </div>
    </>
  );
}
