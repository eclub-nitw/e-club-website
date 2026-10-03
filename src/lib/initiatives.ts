import { events, type ClubEvent } from "@/data/events";
import { spotlight } from "@/data/spotlight";
import { phaseAt, viewOf } from "@/lib/phase";
import { spotlightHidden, spotlightVisible } from "@/lib/spotlight";
import { isUpcoming, sortedEvents } from "@/lib/events";

export type Listed = { event: ClubEvent; chip: string | null; upcoming: boolean };

/** The club's initiatives for a list at time `now`. The spotlight row drops out after its sunset and moves from Upcoming to Past when the finale ends. */
export function listInitiatives(now = Date.now()): Listed[] {
  const statusWord = viewOf(phaseAt(now)).status;
  return sortedEvents(events, now)
    .filter((e) => e.slug !== spotlight.slug || !spotlightHidden(now))
    .map((event) => {
      const live = event.slug === spotlight.slug && spotlightVisible(now);
      return { event, chip: live ? statusWord : null, upcoming: isUpcoming(event, now) };
    });
}
