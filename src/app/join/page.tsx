import type { Metadata } from "next";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

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
        number="01" label="Join" photoId="01-12" title={open ? "Recruitment is open" : "Recruitment is closed for now"}
        lede={open ? "Apply through the form below." : "We are not taking applications right now. Follow us or write to us to hear first when the next round opens."}
      />
      <div className="bg-bg pb-28 text-fg">
        <Container className="flex flex-wrap gap-3">
          {open ? <Button href={site.recruitmentUrl}>Open the application form</Button> : <Button href={`mailto:${site.email}?subject=${encodeURIComponent("Joining E-Club")}`}>Email us</Button>}
          <Button href={site.instagram} variant="secondary">Follow on Instagram</Button>
        </Container>
      </div>
    </>
  );
}
