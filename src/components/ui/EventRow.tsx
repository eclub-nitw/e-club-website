import Link from "next/link";
import { eventPath, shownPhotos, type ClubEvent, type EventType } from "@/data/events";
import { fmtRange } from "@/lib/format";
import { Art } from "./Art";
import { EventPhoto } from "./EventPhoto";
import { Label } from "./Type";

export const TYPE_LABEL: Record<EventType, string> = { flagship: "Flagship", other: "Event" };

/**
 * One hairline-ruled ledger row: number, title, type and date (the date only when the club supplied it), and a cover. The cover is a consented
 * event photograph, or generated art for the flagship; with neither the row is text only. Hovering or focusing the row lifts the cover 4px and
 * clears the ink over it, in place (no pointer following).
 */
export function EventRow({ event, index, upcoming }: { event: ClubEvent; index: number; upcoming: boolean }) {
  const photo = shownPhotos(event)[0];
  const hasCover = !!photo || event.type === "flagship";
  return (
    <Link
      href={eventPath(event)}
      className={`ledger-row group rule-draw grid min-h-24 items-center gap-x-6 gap-y-3 py-5 ${hasCover ? "md:grid-cols-[2.5rem_1fr_11rem_13rem]" : "md:grid-cols-[2.5rem_1fr_11rem]"}`}
    >
      <Label className="tabular max-md:hidden">{String(index + 1).padStart(2, "0")}</Label>
      <span className="t-h3">
        {event.title}
        {upcoming && <Label className="ml-3 align-middle text-accent-text">Upcoming</Label>}
      </span>
      <Label>{TYPE_LABEL[event.type]}{event.dateStart && ` · ${fmtRange(event.dateStart, event.dateEnd ?? undefined)}`}</Label>
      {hasCover && (
        <span aria-hidden="true" className="relative block w-full max-w-[13rem] transition-transform duration-[250ms] ease-[var(--ease-out-expo)] group-hover:-translate-y-1 group-focus-visible:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
          {photo
            ? <EventPhoto slug={event.slug} photo={{ ...photo, ratio: "3:2" }} sizes="13rem" />
            : <span className="relative block aspect-[3/2] overflow-hidden rounded-[2px] bg-surface"><Art name="vortex" sizes="13rem" className="absolute inset-0 size-full object-cover" /></span>}
          <span className="absolute inset-0 rounded-[2px] bg-bg opacity-60 transition-opacity duration-[250ms] group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none" />
        </span>
      )}
    </Link>
  );
}
