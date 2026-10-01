import type { Metadata } from "next";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/ui/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { Label } from "@/components/ui/Type";

export const metadata: Metadata = {
  title: "Join the club",
  description: "How to join the Entrepreneurship Club of NIT Warangal.",
  alternates: { canonical: "/join" },
};

export default function JoinPage() {
  const open = !!site.recruitmentUrl;
  return (
    <>
      <PageHeader
        number="01" label="Join" art="workshop" title={open ? "Recruitment is open" : "Recruitment is closed for now"}
        lede={open ? "Apply through the form." : "We are not taking applications right now. Tell us you are interested and we will write when the next round opens."}
      />
      <div className="bg-bg pb-28 text-fg">
        <Container className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <div>
            <Label className="mb-6 border-t border-line pt-4">02 — {open ? "Apply" : "Tell us you are interested"}</Label>
            {open ? <Button href={site.recruitmentUrl}>Open the application form</Button> : <ContactForm to={site.email} subject="Joining E-Club" />}
          </div>
          <div>
            <Label className="mb-6 border-t border-line pt-4">03 — Follow</Label>
            <Button href={site.instagram} variant="secondary">Follow on Instagram</Button>
          </div>
        </Container>
      </div>
    </>
  );
}
