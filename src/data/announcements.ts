import { site } from "./site";
import { events } from "./events";
import { spotlight } from "./spotlight";

// Ticker items. Club items come first and never change with the season; spotlight items follow and exist only while the spotlight is promoted
// (the first spotlight item is the live phase line from lib/phase.ts, added by the ticker itself).
export const clubAnnouncements = [
  site.name,
  site.quote.line,
  ...events.filter((e) => e.slug !== spotlight.slug).map((e) => e.title),
];

export const spotlightAnnouncements = ["₹50,000 prize pool", "Part of Technozion"];
