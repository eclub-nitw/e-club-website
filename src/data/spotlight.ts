import { rounds } from "./timeline";

// The one initiative the club features while it runs. Everything that promotes it (nav button, Home block, ticker items, floating pill,
// the Initiatives "Upcoming" row) reads these dates, so when the season ends the promotion ends with no edit.
// `until` is the end of the finale; `hideFromListsAfter` is 7 days later: until then the spotlight stays up as "concluded", after it
// the site stops promoting it (the page itself stays, with an ended banner).
const WEEK = 7 * 24 * 3600 * 1000;
const until = rounds[2].end;

export const spotlight = {
  slug: "venture-vortex-2026",
  name: "Venture Vortex 2026",
  navLabel: "Venture Vortex",
  href: "/venture-vortex",
  from: "2026-09-22T00:00:00+05:30",
  until,
  hideFromListsAfter: new Date(new Date(until).getTime() + WEEK).toISOString(),
} as const;
