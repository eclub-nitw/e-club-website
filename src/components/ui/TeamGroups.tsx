import type { Member } from "@/data/team";
import { groupMembers } from "@/lib/team";
import { TeamMember } from "./TeamMember";

/** Members grouped by role group, each group a numbered ledger section. */
export function TeamGroups({ members }: { members: Member[] }) {
  return (
    <div className="space-y-20">
      {groupMembers(members).map((g, i) => (
        <section key={g.group} aria-labelledby={`grp-${g.group}`}>
          <h2 id={`grp-${g.group}`} className="border-t border-line pt-4 font-mono text-xs uppercase tracking-[0.08em] text-muted">{String(i + 1).padStart(2, "0")} — {g.group}</h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{g.members.map((m) => <TeamMember key={m.name} member={m} />)}</ul>
        </section>
      ))}
    </div>
  );
}
