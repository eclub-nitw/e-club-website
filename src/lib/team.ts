import { team, type Member } from "@/data/team";

/** Academic years present in the data, newest first (e.g. "2026-27"). */
export const teamYears = () => [...new Set(team.map((m) => m.year))].sort().reverse();

const ORDER: Member["group"][] = ["Faculty", "Core", "Vertical", "Tech", "Design", "Other"];

export const groupMembers = (members: Member[]) =>
  ORDER.map((group) => ({ group, members: members.filter((m) => m.group === group) })).filter((g) => g.members.length);
