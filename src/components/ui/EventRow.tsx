import Link from "next/link";
import type { ClubEvent, EventType } from "@/data/events";
import { fmtRange, yearOf } from "@/lib/format";

export const TYPE_LABEL: Record<EventType, string> = {
  flagship: "Flagship", competition: "Competition", workshop: "Workshop", speaker: "Speaker session", other: "Event",
};

/** One hairline-ruled ledger row: year · title · type · date. Optional hover/focus hooks drive the cursor preview. */
export function EventRow({ event, upcoming, onActive, onInactive }: {
  event: ClubEvent;
  upcoming: boolean;
  onActive?: (e: React.PointerEvent | React.FocusEvent) => void;
  onInactive?: () => void;
}) {
  return (
    <Link
      href={`/events/${event.slug}`}
      onPointerMove={onActive} onFocus={onActive} onPointerLeave={onInactive} onBlur={onInactive}
      className="ledger-row group grid min-h-20 grid-cols-[3.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-t border-line py-5 md:grid-cols-[5rem_1fr_11rem_10rem_1.5rem] md:gap-x-6"
    >
      <span className="font-mono text-xs tabular text-muted">{yearOf(event.dateStart)}</span>
      <span className="font-display text-xl font-medium leading-snug md:text-3xl">
        {event.title}
        {upcoming && <span className="ml-3 align-middle font-mono text-[11px] uppercase tracking-[0.08em] text-link">Upcoming</span>}
      </span>
      <span className="col-start-2 font-mono text-xs uppercase tracking-[0.08em] text-muted md:col-start-auto">{TYPE_LABEL[event.type]}</span>
      <span className="col-start-2 font-mono text-xs tabular text-muted md:col-start-auto">{fmtRange(event.dateStart, event.dateEnd)}</span>
      <span aria-hidden className="hidden text-muted transition-transform duration-200 group-hover:translate-x-1 md:block">→</span>
    </Link>
  );
}
