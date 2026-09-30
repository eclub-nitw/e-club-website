"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "motion/react";
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
  const reduce = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);

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
      x.set(e.clientX + 24); y.set(e.clientY - 80);
    } else {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      x.set(Math.max(16, r.right - 300)); y.set(r.top - 190);
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

      <AnimatePresence>
        {active?.coverImage && !reduce && (
          <motion.div
            key={active.slug} aria-hidden style={{ x, y }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden aspect-[3/2] w-[280px] overflow-hidden rounded-[2px] border border-line md:block"
          >
            <Image src={active.coverImage} alt="" fill sizes="280px" className="object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
