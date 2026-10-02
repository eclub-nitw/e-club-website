import type { Metadata } from "next";
import { events } from "@/data/events";
import { breadcrumbLd, eventLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { VentureVortexPage } from "@/features/venture-vortex";

export const revalidate = 300;

const flagship = events.find((e) => e.href === "/venture-vortex")!;

export const metadata: Metadata = {
  title: "Venture Vortex 2026",
  description: "Tear down one of 50 Indian startups, build a strategy and defend it live at Technozion, NIT Warangal. ₹50,000 prize pool. Free, teams of 2 to 4.",
  alternates: { canonical: "/venture-vortex" },
  openGraph: { title: "Venture Vortex 2026 | E-Club NIT Warangal", url: "/venture-vortex" },
};

export default function Page() {
  return (
    <>
      <JsonLd data={eventLd(flagship)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Initiatives", path: "/initiatives" }, { name: "Venture Vortex 2026", path: "/venture-vortex" }])} />
      <VentureVortexPage />
    </>
  );
}
