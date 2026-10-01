"use client";
import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 30_000);
  return () => clearInterval(id);
};
// Snapshot is minute-granular so React sees a stable value between ticks.
const now = () => Math.floor(Date.now() / 60_000) * 60_000;

/** Days / hours / minutes to `start`. Renders a fixed-size placeholder on the server so layout never shifts. */
export function Countdown({ start, end }: { start: string; end?: string }) {
  const t = useSyncExternalStore(subscribe, now, () => null);
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : s;

  if (t !== null && t >= e) return <p className="t-label text-muted">Concluded</p>;
  if (t !== null && t >= s) return <p className="t-label text-link">Live now</p>;

  const diff = t === null ? null : s - t;
  const parts = diff === null ? null : [
    [Math.floor(diff / 86_400_000), "days"],
    [Math.floor((diff % 86_400_000) / 3_600_000), "hrs"],
    [Math.floor((diff % 3_600_000) / 60_000), "min"],
  ] as const;

  return (
    <div role="timer" aria-label="Time until the event starts" className="flex gap-6">
      {(parts ?? [["–", "days"], ["–", "hrs"], ["–", "min"]] as const).map(([n, label]) => (
        <div key={label} className="min-w-14">
          <p className="t-h3 tabular">{typeof n === "number" ? String(n).padStart(2, "0") : n}</p>
          <p className="t-label mt-2 text-muted">{label}</p>
        </div>
      ))}
    </div>
  );
}
