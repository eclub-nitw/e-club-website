"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { phaseAt, type Phase } from "./phase";

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 30_000);
  return () => clearInterval(id);
};
// Minute-granular so React sees a stable value between ticks.
const minute = () => Math.floor(Date.now() / 60_000) * 60_000;

/** Current time in ms, or null on the server and during hydration (so the markup never depends on the build date). */
export const useNow = () => useSyncExternalStore(subscribe, minute, () => null);

/** The timeline phase. Server and hydration render `initial` (what the server computed), then the browser clock takes over within a minute, so cached HTML never stays stale. */
export function usePhase(initial: Phase): Phase {
  const now = useNow();
  return now === null ? initial : phaseAt(now);
}

export type Chapter = { path: string; index: number; total: number; id: string; label: string };

/** The page's numbered chapters (`main [data-section]`): which one is under the reading line. Feeds the nav counter and the sapling rail. */
export function useChapter(pathname: string): Chapter | null {
  const [seen, setSeen] = useState<Chapter>({ path: "", index: 0, total: 0, id: "", label: "" });
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("main [data-section]")];
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) {
        const el = e.target as HTMLElement;
        setSeen({ path: pathname, index: els.indexOf(el), total: els.length, id: el.id, label: (el.dataset.section ?? "").replace(/^\d+ — /, "") });
      }
    }, { rootMargin: "-30% 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return seen.path === pathname ? seen : null;
}
