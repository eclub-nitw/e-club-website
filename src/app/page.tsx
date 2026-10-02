import type { Metadata } from "next";
import { site } from "@/data/site";
import { event } from "@/data/event";
import { registerOpen } from "@/lib/register-state";
import { organizationLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { Numbers } from "@/components/home/Numbers";
import { About } from "@/components/home/About";
import { Initiatives } from "@/components/home/Initiatives";
import { CampusToIndia } from "@/components/home/CampusToIndia";
import { VortexExpand } from "@/components/home/VortexExpand";
import { FlagshipStage } from "@/components/home/FlagshipStage";
import { BackedBy, JoinUs, PosterWall, Speakers, Voices } from "@/components/home/Sections";
import { startups } from "@/data/startups";
import { speakers } from "@/data/speakers";
import { voices } from "@/data/voices";
import { fmtDate } from "@/lib/format";

export const revalidate = 3600; // dates decide the ticker and CTAs at render time; refresh hourly

export const metadata: Metadata = {
  title: { absolute: site.name },
  description: "E-Club NIT Warangal runs competitions and pitch sessions for student founders. Flagship: Venture Vortex 2026, an all-India startup strategy competition.",
  alternates: { canonical: "/" },
};

const day = (iso: string) => fmtDate(iso).replace(/ 2026$/, "");

/** Home follows the IIT E-Cell order: hero, ticker, numbers, about, initiatives, reach map, flagship, posters, speakers, voices, backed by, join. */
export default function Home() {
  const [r1, r2, r3] = event.rounds;
  const open = registerOpen();
  const ticker = [
    open ? "Venture Vortex 2026 registration is live on Unstop" : "Venture Vortex 2026",
    `Round 1 · ${day(r1.start)} to ${day(r1.end)} · online`,
    `Round 2 · ${day(r2.start)} to ${day(r2.end)} · online`,
    `Round 3 · ${day(r3.start)} to ${day(r3.end)} · NIT Warangal`,
    "Part of Technozion",
    "₹50,000 prize pool",
  ];
  // Verified Venture Vortex facts only (data/event.ts, data/startups.ts). Not club-lifetime figures.
  const stats = [
    { value: String(event.rounds.length), label: "Rounds", note: "Two online, one on campus" },
    { value: String(startups.length), label: "Startups to choose from", note: "Round 1 teardown" },
    { value: `${event.team.min}–${event.team.max}`, label: "Members per team", note: "Cross-college allowed" },
    { value: "₹50,000", label: "Prize pool", note: "Total cash pool" },
    { value: "30–31 Oct", label: "Finale", note: "On campus, NIT Warangal" },
  ];
  const n = (i: number) => String(i).padStart(2, "0");
  let c = 1;
  return (
    <>
      <JsonLd data={organizationLd()} />
      <Hero number={n(c++)} />
      <Ticker items={ticker} />
      <Numbers number={n(c++)} stats={stats} />
      <About number={n(c++)} />
      <Initiatives number={n(c++)} />
      <CampusToIndia number={n(c++)} />
      <VortexExpand number={n(c++)}><FlagshipStage /></VortexExpand>
      <PosterWall number={n(c++)} />
      {speakers.length > 0 && <Speakers number={n(c++)} />}
      {voices.length > 0 && <Voices number={n(c++)} />}
      <BackedBy number={n(c++)} />
      <JoinUs number={n(c++)} />
    </>
  );
}
