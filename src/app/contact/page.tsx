import type { Metadata } from "next";
import { site } from "@/data/site";
import { Container, LedgerRow, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email the Entrepreneurship Club of NIT Warangal or find us on Instagram and LinkedIn.",
  alternates: { canonical: "/contact" },
};

const ext = "text-link underline underline-offset-4 hover:no-underline";
const newTab = <span className="sr-only"> (opens in a new tab)</span>;

export default function ContactPage() {
  return (
    <>
      <PageHeader number="01" label="Contact" title="Get in touch" lede="Email is the quickest way to reach us." />
      <div className="bg-bg pb-28 text-fg">
        <Container>
          <dl className="max-w-3xl border-b border-line">
            <LedgerRow label="Email"><a className={ext} href={`mailto:${site.email}`}>{site.email}</a></LedgerRow>
            <LedgerRow label="Instagram"><a className={ext} href={site.instagram} target="_blank" rel="noopener noreferrer">@eclubnitw{newTab}</a></LedgerRow>
            <LedgerRow label="LinkedIn"><a className={ext} href={site.linkedin} target="_blank" rel="noopener noreferrer">Entrepreneurship Club-NIT Warangal{newTab}</a></LedgerRow>
            {site.youtube && <LedgerRow label="YouTube"><a className={ext} href={site.youtube} target="_blank" rel="noopener noreferrer">Our channel{newTab}</a></LedgerRow>}
            <LedgerRow label="Location">NIT Warangal, {site.address.locality}, {site.address.region}, India</LedgerRow>
          </dl>
        </Container>
      </div>
    </>
  );
}
