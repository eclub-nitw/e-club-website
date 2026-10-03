"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { ClubEvent } from "@/data/events";
import { EventRow } from "./EventRow";

type Row = { event: ClubEvent; chip: string | null; upcoming: boolean };
const TABS = [{ id: "all", label: "All" }, { id: "upcoming", label: "Upcoming" }, { id: "past", label: "Past" }] as const;
type Tab = (typeof TABS)[number]["id"];
const fromHash = (): Tab => TABS.find((t) => t.id === window.location.hash.slice(1))?.id ?? "all";

/**
 * Initiatives ledger with All / Upcoming / Past tabs (an ARIA tablist: Left/Right/Home/End move between tabs; the URL hash #upcoming or #past selects
 * one and follows the choice). Rows are real links, so without JS the full list is shown and every row works. `rows` arrives ordered and decided by the server.
 */
export function EventLedger({ rows, cover }: { rows: Row[]; cover: boolean }) {
  const uid = useId();
  const [tab, setTab] = useState<Tab>("all");
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const sync = () => setTab(fromHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const choose = (t: Tab, focus = false) => {
    setTab(t);
    history.replaceState(null, "", t === "all" ? window.location.pathname : `#${t}`);
    if (focus) tabs.current[t]?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab);
    const next = e.key === "ArrowRight" ? TABS[(i + 1) % TABS.length] : e.key === "ArrowLeft" ? TABS[(i + TABS.length - 1) % TABS.length] : e.key === "Home" ? TABS[0] : e.key === "End" ? TABS[TABS.length - 1] : null;
    if (next) { e.preventDefault(); choose(next.id, true); }
  };

  const shown = rows.filter((r) => tab === "all" || (tab === "upcoming" ? r.upcoming : !r.upcoming));
  const count = (t: Tab) => rows.filter((r) => t === "all" || (t === "upcoming" ? r.upcoming : !r.upcoming)).length;

  return (
    <div>
      <div role="tablist" aria-label="Filter initiatives" onKeyDown={onKey} className="mb-8 flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button key={t.id} ref={(el) => { tabs.current[t.id] = el; }} type="button" role="tab" id={`${uid}-${t.id}`} aria-selected={tab === t.id} aria-controls={`${uid}-panel`} tabIndex={tab === t.id ? 0 : -1} onClick={() => choose(t.id)}
            className={`t-label min-h-11 rounded-[2px] border px-4 transition-colors duration-200 ${tab === t.id ? "border-accent bg-accent text-accent-fg" : "border-line text-muted hover:text-fg"}`}>
            {t.label} <span className="tabular">{count(t.id)}</span>
          </button>
        ))}
      </div>
      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-${tab}`}>
        {shown.length > 0 ? (
          <ul className="border-b border-line">
            {shown.map((r, i) => <li key={r.event.slug}><EventRow event={r.event} index={i} chip={r.chip ?? (r.upcoming ? "Upcoming" : null)} cover={cover} large /></li>)}
          </ul>
        ) : (
          <p className="t-body border-y border-line py-8">{tab === "upcoming" ? "Nothing is scheduled right now. Follow us on Instagram or LinkedIn for the next one." : "No past initiatives are listed yet."}</p>
        )}
      </div>
      <p className="sr-only" role="status">{shown.length} initiatives shown ({tab})</p>
    </div>
  );
}
