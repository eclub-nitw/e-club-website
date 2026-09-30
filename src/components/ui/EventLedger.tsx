"use client";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { ClubEvent, EventType } from "@/data/events";
import { EventRow, TYPE_LABEL } from "./EventRow";

/**
 * Events ledger: type filter + hairline rows. Hovering (or focusing) a row with a cover photo
 * shows a 3:2 preview that follows the cursor. Rows are real links, so it all works without JS
 * and by keyboard; the preview is decoration (alt="").
 */
export function EventLedger({ events, nowIso }: { events: ClubEvent[]; nowIso: string }) {
  const [type, setType] = useState<EventType | "all">("all");
  const [active, setActive] = useState<ClubEvent | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const place = (x: number, y: number) => { if (preview.current) preview.current.style.transform = `translate3d(${x}px, ${y}px, 0)`; };

  const types = useMemo(() => [...new Set(events.map((e) => e.type))], [events]);
  const now = new Date(nowIso).getTime();
  const rows = useMemo(() => {
    const list = events.filter((e) => type === "all" || e.type === type);
    const isUp = (e: ClubEvent) => new Date(e.dateEnd ?? e.dateStart).getTime() >= now;
    return [
      ...list.filter(isUp).sort((a, b) => a.dateStart.localeCompare(b.dateStart)),
      ...list.filter((e) => !isUp(e)).sort((a, b) => b.dateStart.localeCompare(a.dateStart)),
    ];
  }, [events, type, now]);

  const track = (e: React.PointerEvent | React.FocusEvent, ev: ClubEvent) => {
    if (!ev.coverImage) return;
    if ("clientX" in e) {
      if (e.pointerType !== "mouse") return;
      place(e.clientX + 24, e.clientY - 80);
    } else {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      place(Math.max(16, r.right - 300), r.top - 190);
    }
    setActive(ev);
  };

  return (
    <div>
      {types.length > 1 && (
        <div role="group" aria-label="Filter events by type" className="sticky top-3 z-20 mb-8 flex flex-wrap gap-2">
          {(["all", ...types] as const).map((t) => (
            <button
              key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)}
              className={`min-h-11 rounded-[2px] border px-4 font-mono text-xs uppercase tracking-[0.08em] transition-colors ${type === t ? "border-accent bg-accent text-accent-fg" : "border-line bg-bg/80 text-muted backdrop-blur-md hover:text-fg"}`}
            >
              {t === "all" ? "All" : TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      )}

      <ul className="border-b border-line">
        {rows.map((ev) => (
          <li key={ev.slug}>
            <EventRow event={ev} upcoming={new Date(ev.dateEnd ?? ev.dateStart).getTime() >= now} onActive={(e) => track(e, ev)} onInactive={() => setActive(null)} />
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">{rows.length} events shown</p>

      {/* One preview node; the image swaps and the node fades. Hidden by CSS under reduced motion. */}
      <div
        ref={preview} aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden aspect-[3/2] w-[280px] overflow-hidden rounded-[2px] border border-line transition-opacity duration-200 motion-reduce:!hidden md:block ${active?.coverImage ? "opacity-100" : "opacity-0"}`}
      >
        {active?.coverImage && <Image src={active.coverImage} alt="" fill sizes="280px" className="object-cover" />}
      </div>
    </div>
  );
}
