// The timeline and register link, split out of event.ts so client components (nav, floating pill, map) import a few hundred bytes
// instead of the whole fact sheet. event.ts re-exports these; times are IST. Updated 2 Oct 2026 from the club's official timeline poster (confirmed by the owner): registration 22 Sep to 3 Oct, Round 1 submissions 24 Sep to 9 Oct, result 10 Oct. The poster gives dates only, so registration is treated as closing at the end of 3 Oct IST.
export const registerUrl = "https://unstop.com/o/cxKq1kz?lb=usedZ8to"; // Unstop's own normalised link (utm/fbclid stripped)

export const unstopPageUrl = "https://unstop.com/competitions/venture-vortex-entrepreneurship-club-nit-warangal-1760873";

/** Round 1 registration window (the team is locked when it closes). */
export const registration = { start: "2026-09-22T00:00:00+05:30", end: "2026-10-03T23:59:59+05:30" } as const;
export const round1Result = "2026-10-10";

export const rounds = [
  { id: "r1", n: 1, name: "Behind the Startup", subtitle: "Startup teardown", mode: "Online · Unstop",
    start: "2026-09-24T09:00:00+05:30", end: "2026-10-09T08:00:00+05:30" },
  { id: "r2", n: 2, name: "Strategy Build", subtitle: "Marketing or Product vertical", mode: "Online · Unstop",
    start: "2026-10-11T08:00:00+05:30", end: "2026-10-18T20:00:00+05:30" },
  { id: "r3", n: 3, name: "Boardroom Showdown", subtitle: "Grand finale", mode: "On campus · NIT Warangal",
    start: "2026-10-30T08:00:00+05:30", end: "2026-10-31T20:00:00+05:30" },
] as const;
