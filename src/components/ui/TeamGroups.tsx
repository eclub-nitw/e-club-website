import type { Member } from "@/data/team";
import { groupMembers } from "@/lib/team";
import { TeamMember } from "./TeamMember";
import { Label } from "./Type";

/** Members grouped by role group, each group a numbered ledger section with a typographic roster. */
export function TeamGroups({ members }: { members: Member[] }) {
  return (
    <div className="space-y-20">
      {groupMembers(members).map((g, i) => (
        <section key={g.group} aria-labelledby={`grp-${g.group}`}>
          <Label as="h2" id={`grp-${g.group}`} className="border-t border-line pt-4">{String(i + 1).padStart(2, "0")} — {g.group}</Label>
          <ul className="mt-4 border-b border-line">{g.members.map((m) => <TeamMember key={m.name} member={m} />)}</ul>
        </section>
      ))}
    </div>
  );
}
