export type EventType = "flagship" | "competition" | "workshop" | "speaker" | "other";
export type ClubEvent = {
  slug: string; title: string; type: EventType;
  dateStart: string; dateEnd?: string;            // ISO 8601 with offset, e.g. "2026-10-30T08:00:00+05:30"
  venue: string; summary: string;
  stats?: { label: string; value: string; source: string }[];  // only verified numbers, each with its source
  coverImage?: string; gallery?: string[];         // coverImage: path under /public; gallery: photo ids from data/media.ts
  videoId?: string;                                // YouTube video ID
  registerUrl?: string;
};

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
  },
  // ADD past events here. Data comes from the club's Drive folders (last year's assets) — do NOT invent entries.
];
