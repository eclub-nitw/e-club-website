"use client";
import { useMemo, useState } from "react";
import type { ClubEvent, EventType } from "@/data/events";
import { EventRow, TYPE_LABEL } from "./EventRow";

const FILTERS: { value: EventType | "all"; label: string }[] = [{ value: "all", label: "All" }, { value: "flagship", label: "Flagship" }, { value: "other", label: "Events" }];

/**
 * Initiatives ledger with an All / Flagship / Events filter. Rows are real links, so the list works without JS and by keyboard; the filter only
 * narrows it (no layout animation). `events` arrives already ordered by the server; `upcomingSlugs` is decided there too.
 */
export function EventLedger({ events, upcomingSlugs }: { events: ClubEvent[]; upcomingSlugs: string[] }) {
  const [type, setType] = useState<EventType | "all">("all");
  const rows = useMemo(() => events.filter((e) => type === "all" || e.type === type), [events, type]);
  const kinds = new Set(events.map((e) => e.type));

  return (
    <div>
      {kinds.size > 1 && (
        <div role="group" aria-label="Filter initiatives" className="mb-8 flex flex-wrap items-center gap-2">
          <span className="t-label mr-2 text-muted">Show</span>
          {FILTERS.map((f) => (
            <button key={f.value} type="button" aria-pressed={type === f.value} onClick={() => setType(f.value)}
              className={`t-label min-h-11 rounded-[2px] border px-4 transition-colors duration-200 ${type === f.value ? "border-accent bg-accent text-accent-fg" : "border-line text-muted hover:text-fg"}`}>
              {f.label}
            </button>
          ))}
        </div>
      )}
      <ul className="border-b border-line">
        {rows.map((ev, i) => <li key={ev.slug}><EventRow event={ev} index={i} upcoming={upcomingSlugs.includes(ev.slug)} /></li>)}
      </ul>
      <p className="sr-only" role="status">{rows.length} initiatives shown ({type === "all" ? "all" : TYPE_LABEL[type].toLowerCase()})</p>
    </div>
  );
}
