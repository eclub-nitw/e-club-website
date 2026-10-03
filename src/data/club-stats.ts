// Club-wide proof numbers (founding year, members, events held, typical participation). Each needs a source the club can point to.
// Empty on purpose: the competition's own figures are not club figures. The Home "In numbers" row renders only when this has entries.
// TODO(owner): docs/CONTENT-INTAKE.md, "V8: ten answers that fill the site".
export type ClubStat = { label: string; value: string; source: string };
export const clubStats: ClubStat[] = [];
