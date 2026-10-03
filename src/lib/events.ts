import { events, type ClubEvent } from "@/data/events";

// Evaluated at render/revalidation time on the server (pages set `revalidate`), never in the browser.
export const endMs = (e: ClubEvent) => (e.dateEnd ?? e.dateStart ? new Date((e.dateEnd ?? e.dateStart)!).getTime() : null);
export const isUpcoming = (e: ClubEvent) => (e.status === "upcoming" && (endMs(e) ?? Infinity) >= Date.now());

/** Upcoming first (soonest first), then past events newest first; events without a date keep the order of data/events.ts, after the dated ones. */
export const sortedEvents = (list: ClubEvent[] = events) => {
  const dated = (e: ClubEvent) => e.dateStart !== null;
  return [
    ...list.filter(isUpcoming).sort((a, b) => (a.dateStart ?? "").localeCompare(b.dateStart ?? "")),
    ...list.filter((e) => !isUpcoming(e) && dated(e)).sort((a, b) => (b.dateStart ?? "").localeCompare(a.dateStart ?? "")),
    ...list.filter((e) => !isUpcoming(e) && !dated(e)),
  ];
};
