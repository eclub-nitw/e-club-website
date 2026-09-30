import { events, type ClubEvent } from "@/data/events";

// Evaluated at render/revalidation time on the server (pages set `revalidate`), never in the browser.
export const endMs = (e: ClubEvent) => new Date(e.dateEnd ?? e.dateStart).getTime();
export const isUpcoming = (e: ClubEvent) => endMs(e) >= Date.now();

/** Upcoming first (soonest first), then past events newest first. */
export const sortedEvents = () => [
  ...events.filter(isUpcoming).sort((a, b) => a.dateStart.localeCompare(b.dateStart)),
  ...events.filter((e) => !isUpcoming(e)).sort((a, b) => b.dateStart.localeCompare(a.dateStart)),
];
