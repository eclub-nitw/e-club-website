import Link from "next/link";
import type { ClubEvent } from "@/data/events";
import { fmtRange, yearOf } from "@/lib/format";
import { TYPE_LABEL } from "./EventRow";

/** One card in the events rail: a ledger entry made vertical. Fixed width so the rail has a stable length. */
export function EventCard({ event }: { event: ClubEvent }) {
  return (
    <li className="w-[min(78vw,22rem)] shrink-0 snap-start lg:w-[24rem]">
      <Link href={`/events/${event.slug}`} className="ledger-row group flex h-full min-h-72 flex-col lg:min-h-[26rem] justify-between border border-line bg-surface p-6 transition-transform duration-200 hover:-translate-y-1 motion-reduce:hover:translate-y-0">
        <div>
          <p className="font-mono text-xs tabular text-muted">{yearOf(event.dateStart)} · {TYPE_LABEL[event.type]}</p>
          <h3 className="mt-4 font-display text-3xl font-semibold leading-[1.05] tracking-tight lg:text-4xl">{event.title}</h3>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted tabular">{fmtRange(event.dateStart, event.dateEnd)}</p>
          <p className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted">{event.venue}</span>
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </p>
        </div>
      </Link>
    </li>
  );
}
