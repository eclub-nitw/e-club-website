"use client";
import { useEffect } from "react";

/** A polite status message that slides up (transform + opacity, 250 ms) and dismisses itself. `tone="error"` uses an alert role. */
export function Toast({ message, tone = "ok", onDone }: { message: string; tone?: "ok" | "error"; onDone: () => void }) {
  useEffect(() => { const id = window.setTimeout(onDone, 7000); return () => window.clearTimeout(id); }, [onDone]);
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className="toast-in fixed inset-x-4 bottom-4 z-[80] mx-auto flex max-w-md items-center justify-between gap-4 rounded-[2px] border border-line bg-club-ink px-5 py-3 text-club-paper shadow-[0_8px_30px_rgb(0_0_0/0.4)]"
    >
      <span className="t-ui">{message}</span>
      <button type="button" onClick={onDone} className="t-label inline-flex min-h-11 items-center underline underline-offset-4">Dismiss</button>
    </div>
  );
}
