"use client";
import { useMemo, useState } from "react";
import type { ClubEvent, EventType } from "@/data/events";
import { yearOf } from "@/lib/format";
import { EventRow, TYPE_LABEL } from "./EventRow";

function Chips<T extends string>({ label, options, value, onChange, show }: { label: string; options: readonly T[]; value: T | "all"; onChange: (v: T | "all") => void; show: (v: T) => string }) {
  if (options.length < 2) return null;
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="t-label mr-2 text-muted">{label}</span>
      {(["all", ...options] as const).map((o) => (
        <button
          key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)}
          className={`t-label min-h-11 rounded-[2px] border px-4 transition-colors duration-200 ${value === o ? "border-accent bg-accent text-accent-fg" : "border-line text-muted hover:text-fg"}`}
        >
          {o === "all" ? "All" : show(o as T)}
        </button>
      ))}
    </div>
  );
}

/**
 * Events ledger: year and type as mono chips (shown only when there is more than one value), then hairline rows.
 * Rows are real links, so the list works without JS and by keyboard; the chips only narrow it (no layout animation).
 */
export function EventLedger({ events, nowIso }: { events: ClubEvent[]; nowIso: string }) {
  const [type, setType] = useState<EventType | "all">("all");
  const [year, setYear] = useState<string | "all">("all");
  const now = new Date(nowIso).getTime();

  const types = useMemo(() => [...new Set(events.map((e) => e.type))], [events]);
  const years = useMemo(() => [...new Set(events.map((e) => yearOf(e.dateStart)))].sort().reverse(), [events]);
  const rows = useMemo(() => {
    const list = events.filter((e) => (type === "all" || e.type === type) && (year === "all" || yearOf(e.dateStart) === year));
    const isUp = (e: ClubEvent) => new Date(e.dateEnd ?? e.dateStart).getTime() >= now;
    return [
      ...list.filter(isUp).sort((a, b) => a.dateStart.localeCompare(b.dateStart)),
      ...list.filter((e) => !isUp(e)).sort((a, b) => b.dateStart.localeCompare(a.dateStart)),
    ];
  }, [events, type, year, now]);

  return (
    <div>
      {(types.length > 1 || years.length > 1) && (
        <div className="mb-8 flex flex-col gap-3">
          <Chips label="Year" options={years} value={year} onChange={setYear} show={(v) => v} />
          <Chips label="Type" options={types} value={type} onChange={setType} show={(v) => TYPE_LABEL[v]} />
        </div>
      )}
      <ul className="border-b border-line">
        {rows.map((ev) => (
          <li key={ev.slug}><EventRow event={ev} upcoming={new Date(ev.dateEnd ?? ev.dateStart).getTime() >= now} /></li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">{rows.length} events shown</p>
    </div>
  );
}
