import Link from "next/link";
import { eventPath, shownPhotos, type ClubEvent } from "@/data/events";
import { fmtRange } from "@/lib/format";
import { Art } from "./Art";
import { EventPhoto } from "./EventPhoto";
import { Label } from "./Type";

/**
 * One hairline-ruled ledger row: number, title with an optional status chip, the date (only when the club supplied it) and a cover. Every row
 * has the same size and style. `cover` is decided once by the list: all rows show a cover or none do (a consented event photograph, or generated
 * art for the competition, which has no photo set). Hovering or focusing the row lifts the cover 4px and clears the ink over it, in place.
 */
export function EventRow({ event, index, chip, cover, large = false }: { event: ClubEvent; index: number; chip?: string | null; cover: boolean; large?: boolean }) {
  const photo = shownPhotos(event)[0];
  return (
    <Link
      href={eventPath(event)}
      className={`ledger-row group rule-draw grid ${large ? "min-h-32 py-7" : "min-h-24 py-5"} items-center gap-x-6 gap-y-3 ${cover ? "md:grid-cols-[2.5rem_1fr_11rem_13rem]" : "md:grid-cols-[2.5rem_1fr_11rem]"}`}
    >
      <Label className="tabular max-md:hidden">{String(index + 1).padStart(2, "0")}</Label>
      <span className={large ? "t-h2" : "t-h3"}>
        {event.title}
        {chip && <Label as="span" className="ml-3 align-middle text-accent-text">{chip}</Label>}
      </span>
      <Label>{event.dateStart ? fmtRange(event.dateStart, event.dateEnd ?? undefined) : "Initiative"}</Label>
      {cover && (
        <span aria-hidden="true" data-content className="relative block w-full max-w-[13rem] transition-transform duration-[250ms] ease-[var(--ease-out-expo)] group-hover:-translate-y-1 group-focus-visible:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
          {photo
            ? <EventPhoto slug={event.slug} photo={{ ...photo, ratio: "3:2" }} sizes="13rem" />
            : <span className="relative block aspect-[3/2] overflow-hidden rounded-[2px] bg-surface"><Art name="vortex" sizes="13rem" className="absolute inset-0 size-full object-cover" /></span>}
          <span className="absolute inset-0 rounded-[2px] bg-bg opacity-60 transition-opacity duration-[250ms] group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none" />
        </span>
      )}
    </Link>
  );
}

/** Lists show covers only when at least one row has a consented photograph (today none do), so every row then gets one. */
export const listHasCovers = (list: ClubEvent[]) => list.some((e) => shownPhotos(e).length > 0);
