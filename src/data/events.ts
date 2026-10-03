import { eventPhotos, type EventPhoto } from "./event-photos";

export type EventType = "flagship" | "other";
export type ClubEvent = {
  slug: string;
  title: string;                                   // display name (typographic apostrophe)
  plain: string;                                   // apostrophe-safe name for attributes, JSON-LD and URLs' labels
  type: EventType;
  dateStart: string | null;                        // ISO 8601 with offset, e.g. "2026-10-30T08:00:00+05:30"; null = the club has not supplied it
  dateEnd?: string | null;
  venue: string | null;                            // null = not supplied
  summary: string | null;                          // one line from the club; null = not supplied (the UI omits it)
  status: "upcoming" | "past";
  photos: EventPhoto[];
  /** Basis on which everyone visible in `photos` agreed to be shown. null = not confirmed, so the photos are not rendered anywhere. */
  photoConsent: string | null;
  stats?: { label: string; value: string; source: string }[];  // only verified numbers, each with its source
  videoId?: string;                                // YouTube video ID
  registerUrl?: string;
  href?: string;                                   // dedicated page, when the event has one (the flagship does)
};

// Posters for an event live in data/posters.ts (keyed by slug). Event photographs appear on /gallery, on the event's own page and as one
// cover per event in the Home ledger, and only while `photoConsent` is set.
// TODO(owner): date, venue and a one-line format for each of the three events (docs/CONTENT-INTAKE.md section 2), and the consent statement for the photos.
export const events: ClubEvent[] = [
  {
    slug: "venture-vortex-2026",
    title: "Venture Vortex 2026", plain: "Venture Vortex 2026",
    type: "flagship", status: "upcoming",
    dateStart: "2026-10-30T08:00:00+05:30",
    dateEnd: "2026-10-31T20:00:00+05:30",
    venue: "NIT Warangal campus (finale) · Online on Unstop (Rounds 1–2)",
    summary: "All-India startup strategy competition: teardown, strategy build, live boardroom defence. ₹50,000 prize pool.",
    registerUrl: "https://unstop.com/o/cxKq1kz?lb=usedZ8to",
    href: "/venture-vortex",
    photos: [], photoConsent: null,
  },
  { slug: "valuation-wars", title: "Valuation Wars", plain: "Valuation Wars", type: "other", status: "past", dateStart: null, venue: null, summary: null, photos: eventPhotos["valuation-wars"], photoConsent: "Club owner (Abdul Wahid) confirmed consent of the people shown, 3 Oct 2026 launch brief" },
  { slug: "pitcher-perfect", title: "Pitch’er Perfect", plain: "Pitch'er Perfect", type: "other", status: "past", dateStart: null, venue: null, summary: null, photos: eventPhotos["pitcher-perfect"], photoConsent: "Club owner (Abdul Wahid) confirmed consent of the people shown, 3 Oct 2026 launch brief" },
  { slug: "the-pitch-league", title: "The Pitch League", plain: "The Pitch League", type: "other", status: "past", dateStart: null, venue: null, summary: null, photos: eventPhotos["the-pitch-league"], photoConsent: "Club owner (Abdul Wahid) confirmed consent of the people shown, 3 Oct 2026 launch brief" },
];

/** Photos that may be shown: the event's set, only when consent is recorded. */
export const shownPhotos = (e: ClubEvent) => (e.photoConsent ? e.photos : []);
export const eventPath = (e: ClubEvent) => e.href ?? `/initiatives/${e.slug}`;
