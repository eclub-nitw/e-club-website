import type { Metadata } from "next";
import { site } from "@/data/site";
import { clubAnnouncements, spotlightAnnouncements } from "@/data/announcements";
import { currentPhase } from "@/lib/phase";
import { spotlightIsVisible } from "@/lib/spotlight";
import { organizationLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { About } from "@/components/home/About";
import { Initiatives } from "@/components/home/Initiatives";
import { FromTheFloor, floorPicks } from "@/components/home/FromTheFloor";
import { VortexExpand } from "@/components/home/VortexExpand";
import { SpotlightBlock } from "@/components/home/SpotlightBlock";
import { ClubNumbers, ClubPartners, JoinUs, Speakers, TeamTeaser, Voices, hasClubPartners, hasClubStats, hasSpeakers, hasTeam, hasVoices } from "@/components/home/Sections";

export const revalidate = 60; // the spotlight and the phase decide the ticker, chip and block at render time; the browser re-resolves them from its clock, this keeps the HTML itself fresh for no-JS visitors and crawlers

export const metadata: Metadata = {
  title: { absolute: site.name },
  description: `${site.name}, the Entrepreneurship Club of NIT Warangal. ${site.quote.line}`,
  alternates: { canonical: "/" },
};

/** Home follows the IIT E-Cell order: hero, ticker, about, initiatives, from the floor, the dive, this season's spotlight, optional club sections, join. Sections without data do not render. */
export default function Home() {
  const phase = currentPhase();
  const spot = spotlightIsVisible();
  const n = (i: number) => String(i).padStart(2, "0");
  let c = 1;
  return (
    <>
      <JsonLd data={organizationLd()} />
      <Hero number={n(c++)} />
      <Ticker phase={phase} spotlightVisible={spot} club={clubAnnouncements} spotlight={spotlightAnnouncements} />
      <About number={n(c++)} />
      <Initiatives number={n(c++)} />
      {floorPicks().length > 0 && <FromTheFloor number={n(c++)} />}
      <VortexExpand number={n(c++)}>{spot && <SpotlightBlock number={n(c++)} />}</VortexExpand>
      {hasClubStats && <ClubNumbers number={n(c++)} />}
      {hasTeam && <TeamTeaser number={n(c++)} />}
      {hasSpeakers && <Speakers number={n(c++)} />}
      {hasVoices && <Voices number={n(c++)} />}
      {hasClubPartners && <ClubPartners number={n(c++)} />}
      <JoinUs number={n(c++)} />
    </>
  );
}
