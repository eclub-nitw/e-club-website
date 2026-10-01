import Link from "next/link";
import type { ClubEvent, EventType } from "@/data/events";
import { fmtRange, yearOf } from "@/lib/format";

export const TYPE_LABEL: Record<EventType, string> = {
  flagship: "Flagship", competition: "Competition", workshop: "Workshop", speaker: "Speaker session", other: "Event",
};

/** One hairline-ruled ledger row: year, title, type, date. Dominant = the title (H3 size); the rest is mono. */
export function EventRow({ event, upcoming }: { event: ClubEvent; upcoming: boolean }) {
  return (
    <Link
      href={`/events/${event.slug}`} data-cursor="VIEW"
      className="ledger-row group rule-draw grid min-h-24 grid-cols-[3.5rem_1fr] items-baseline gap-x-4 gap-y-1 py-6 md:grid-cols-[5rem_1fr_11rem_10rem_1.5rem] md:gap-x-6"
    >
      <span className="t-label tabular text-muted">{yearOf(event.dateStart)}</span>
      <span className="t-h3">
        {event.title}
        {upcoming && <span className="t-label ml-3 align-middle text-accent-text">Upcoming</span>}
      </span>
      <span className="t-label col-start-2 text-muted md:col-start-auto">{TYPE_LABEL[event.type]}</span>
      <span className="t-label tabular col-start-2 text-muted md:col-start-auto">{fmtRange(event.dateStart, event.dateEnd)}</span>
      <span aria-hidden className="t-ui hidden text-muted transition-transform duration-200 group-hover:translate-x-1 md:block">→</span>
    </Link>
  );
}
