import type { Metadata } from "next";
import Link from "next/link";
import { team } from "@/data/team";
import { teamYears } from "@/lib/team";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { TeamGroups } from "@/components/ui/TeamGroups";

export const metadata: Metadata = {
  title: "Team",
  description: "The people running the Entrepreneurship Club of NIT Warangal this year, with links to past teams.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  const years = teamYears();
  const members = team.filter((m) => m.year === years[0]);
  return (
    <>
      <PageHeader number="01" label="Team" title="The people behind the club" lede={years[0] ? `Team of ${years[0]}.` : "The current roster will be published here."} />
      <div className="bg-bg pb-28 text-fg">
        <Container>
          {members.length ? <TeamGroups members={members} /> : <p className="text-lg text-muted">No roster has been published yet.</p>}
          {years.length > 1 && (
            <nav aria-label="Past teams" className="mt-20 border-t border-line pt-4">
              <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-muted">Past teams</h2>
              <ul className="mt-2">{years.slice(1).map((y) => <li key={y}><Link href={`/team/${y}`} className="ledger-row flex min-h-14 items-center border-b border-line font-display text-2xl">{y}</Link></li>)}</ul>
            </nav>
          )}
        </Container>
      </div>
    </>
  );
}
