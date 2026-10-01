import type { Metadata } from "next";
import Link from "next/link";
import { team } from "@/data/team";
import { teamYears } from "@/lib/team";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { TeamGroups } from "@/components/ui/TeamGroups";
import { Body, H3, Label } from "@/components/ui/Type";

export const metadata: Metadata = {
  title: "Team",
  description: "The people running the Entrepreneurship Club of NIT Warangal this year, with links to past teams.",
  alternates: { canonical: "/team" },
};

/** Typographic roster. No photographs until the roster and portraits (with consent) exist; until then a clear "Roster coming" state. */
export default function TeamPage() {
  const years = teamYears();
  const members = team.filter((m) => m.year === years[0]);
  return (
    <>
      <PageHeader number="01" label="Team" title="The people behind the club" art="network-city" lede={years[0] ? `Team of ${years[0]}.` : "The roster is being put together."} />
      <div className="bg-bg pb-28 text-fg">
        <Container>
          {members.length ? <TeamGroups members={members} /> : (
            <div className="rule-draw max-w-3xl py-8">
              <Label className="text-accent-text">Roster coming</Label>
              <H3 className="mt-3">Names and roles will be listed here once the club confirms them.</H3>
              <Body className="mt-4">Want to be on the next roster? <Link href="/join" className="text-link underline underline-offset-4">See how to join</Link>.</Body>
            </div>
          )}
          {years.length > 1 && (
            <nav aria-label="Past teams" className="mt-20 border-t border-line pt-4">
              <Label as="h2">Past teams</Label>
              <ul className="mt-2">{years.slice(1).map((y) => <li key={y}><Link href={`/team/${y}`} className="ledger-row t-h3 flex min-h-14 items-center border-b border-line">{y}</Link></li>)}</ul>
            </nav>
          )}
        </Container>
      </div>
    </>
  );
}
