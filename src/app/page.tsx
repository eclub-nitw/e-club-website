import type { Metadata } from "next";
import { site } from "@/data/site";
import { isUpcoming, sortedEvents } from "@/lib/events";
import { organizationLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/JsonLd";
import { Cover } from "@/components/home/Cover";
import { Problem } from "@/components/home/Problem";
import { Solution } from "@/components/home/Solution";
import { Traction } from "@/components/home/Traction";
import { Product } from "@/components/home/Product";
import { Flagship } from "@/components/home/Flagship";
import { Moments } from "@/components/home/Moments";
import { Investors } from "@/components/home/Investors";
import { Ask } from "@/components/home/Ask";

export const revalidate = 3600; // "upcoming" is decided at render time; refresh hourly

export const metadata: Metadata = {
  title: { absolute: `${site.name} — Entrepreneurship Club, NIT Warangal` },
  alternates: { canonical: "/" },
};

/** The home page is a nine-slide pitch deck: cover, problem, solution, traction, product, flagship, moments, investors, ask. */
export default function Home() {
  const flagship = sortedEvents().find((e) => e.type === "flagship" && isUpcoming(e));
  return (
    <>
      <JsonLd data={organizationLd()} />
      <Cover flagship={flagship} />
      <Problem />
      <Solution />
      <Traction />
      <Product flagship={flagship} />
      {flagship && <Flagship event={flagship} />}
      <Moments />
      <Investors />
      <Ask />
    </>
  );
}
