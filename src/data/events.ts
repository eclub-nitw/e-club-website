export type EventType = "flagship" | "competition" | "workshop" | "speaker" | "other";
export type ClubEvent = {
  slug: string; title: string; type: EventType;
  dateStart: string; dateEnd?: string;            // ISO 8601 with offset, e.g. "2026-10-30T08:00:00+05:30"
  venue: string; summary: string;
  stats?: { label: string; value: string; source: string }[];  // only verified numbers, each with its source
  videoId?: string;                                // YouTube video ID
  registerUrl?: string;
  href?: string;                                   // dedicated page, when the event has one (the flagship does)
};

// Posters for an event live in data/posters.ts (keyed by slug). Raw event photographs appear only on /gallery.
export const events: ClubEvent[] = [
  {
    slug: "venture-vortex-2026",
    title: "Venture Vortex 2026",
    type: "flagship",
    dateStart: "2026-10-30T08:00:00+05:30",
    dateEnd: "2026-10-31T20:00:00+05:30",
    venue: "NIT Warangal campus (finale) · Online on Unstop (Rounds 1–2)",
    summary: "All-India startup strategy competition: teardown, strategy build, live boardroom defence. ₹50,000 prize pool.",
    registerUrl: "https://unstop.com/o/cxKq1kz?lb=usedZ8to",
    href: "/venture-vortex",
  },
  // ADD past events here, from the club's own list (docs/CONTENT-INTAKE.md). Do NOT invent entries.
];
