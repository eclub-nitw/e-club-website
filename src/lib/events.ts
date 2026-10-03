import { events, type ClubEvent } from "@/data/events";

// Evaluated at render/revalidation time on the server (pages set `revalidate`), never in the browser. `now` is a parameter so tests can fake the clock.
export const endMs = (e: ClubEvent) => (e.dateEnd ?? e.dateStart ? new Date((e.dateEnd ?? e.dateStart)!).getTime() : null);
export const isUpcoming = (e: ClubEvent, now = Date.now()) => (e.status === "upcoming" && (endMs(e) ?? Infinity) >= now);

/** Upcoming first (soonest first), then past events newest first; events without a date keep the order of data/events.ts, after the dated ones. */
export const sortedEvents = (list: ClubEvent[] = events, now = Date.now()) => {
  const dated = (e: ClubEvent) => e.dateStart !== null;
  return [
    ...list.filter((e) => isUpcoming(e, now)).sort((a, b) => (a.dateStart ?? "").localeCompare(b.dateStart ?? "")),
    ...list.filter((e) => !isUpcoming(e, now) && dated(e)).sort((a, b) => (b.dateStart ?? "").localeCompare(a.dateStart ?? "")),
    ...list.filter((e) => !isUpcoming(e, now) && !dated(e)),
  ];
};
