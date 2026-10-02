// The Unstop timeline and register link, split out of event.ts so client components (nav, floating pill, map) import a few hundred bytes
// instead of the whole fact sheet. event.ts re-exports these; times are IST and AUTHORITATIVE (Unstop "Stages and Timelines" panel).
export const registerUrl = "https://unstop.com/o/cxKq1kz?lb=usedZ8to"; // Unstop's own normalised link (utm/fbclid stripped)

export const rounds = [
  { id: "r1", n: 1, name: "Behind the Startup", subtitle: "Startup teardown", mode: "Online · Unstop",
    start: "2026-09-24T09:00:00+05:30", end: "2026-10-09T08:00:00+05:30" },
  { id: "r2", n: 2, name: "Strategy Build", subtitle: "Marketing or Product vertical", mode: "Online · Unstop",
    start: "2026-10-11T08:00:00+05:30", end: "2026-10-18T20:00:00+05:30" },
  { id: "r3", n: 3, name: "Boardroom Showdown", subtitle: "Grand finale", mode: "On campus · NIT Warangal",
    start: "2026-10-30T08:00:00+05:30", end: "2026-10-31T20:00:00+05:30" },
] as const;
