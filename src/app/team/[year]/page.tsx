import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { team } from "@/data/team";
import { teamYears } from "@/lib/team";
import { breadcrumbLd } from "@/lib/jsonld";
import { Breadcrumbs, Container, JsonLd, PageHeader, TeamGroups } from "@/components/ui";

export const dynamicParams = false;
export const generateStaticParams = () => teamYears().map((year) => ({ year }));

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Team ${year}`,
    description: `The Entrepreneurship Club of NIT Warangal team for ${year}.`,
    alternates: { canonical: `/team/${year}` },
  };
}

export default async function TeamYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const members = team.filter((m) => m.year === year);
  if (!members.length) notFound();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Team", path: "/team" }, { name: year, path: `/team/${year}` }])} />
      <PageHeader number="01" label="Team archive" title={`Team of ${year}`}>
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Team", path: "/team" }, { name: year }]} />
      </PageHeader>
      <div className="bg-bg pb-28 text-fg"><Container><TeamGroups members={members} /></Container></div>
    </>
  );
}
