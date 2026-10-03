import { spotlight } from "@/data/spotlight";

const at = (s: string) => new Date(s).getTime();

/** The spotlight is promoted from its start until `hideFromListsAfter` (it reads "concluded" between `until` and then). */
export const spotlightVisible = (now: number) => now >= at(spotlight.from) && now < at(spotlight.hideFromListsAfter);
/** The finale is over: no register or countdown wording, the Initiatives row moves from Upcoming to Past. */
export const spotlightEnded = (now: number) => now >= at(spotlight.until);
/** Past the sunset: the row leaves the Initiatives list and the page carries an ended banner. */
export const spotlightHidden = (now: number) => now >= at(spotlight.hideFromListsAfter);
