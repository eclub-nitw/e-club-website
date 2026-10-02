"use client";
import { useState } from "react";
import { Gallery, type GalleryItem } from "./Gallery";

const PAGE = 12;

/** Gallery: a session filter and 12 photographs at a time with "Load more". Every image below the first three is lazy with a blur-up. */
export function GalleryBrowser({ items, sessions }: { items: GalleryItem[]; sessions: { slug: string; label: string }[] }) {
  const [session, setSession] = useState("all");
  const [shown, setShown] = useState(PAGE);
  const list = session === "all" ? items : items.filter((p) => p.event === session);
  const visible = list.slice(0, shown);
  const pick = (s: string) => { setSession(s); setShown(PAGE); };

  return (
    <div>
      <div role="group" aria-label="Filter by session" className="mb-12 flex flex-wrap items-center gap-2">
        <span className="t-label mr-2 text-muted">Session</span>
        {[{ slug: "all", label: "All" }, ...sessions].map((s) => (
          <button key={s.slug} type="button" aria-pressed={session === s.slug} onClick={() => pick(s.slug)}
            className={`t-label min-h-11 rounded-[2px] border px-4 transition-colors duration-200 ${session === s.slug ? "border-accent bg-accent text-accent-fg" : "border-line text-muted hover:text-fg"}`}>
            {s.label}
          </button>
        ))}
      </div>
      <Gallery key={session} items={visible} eagerCount={3} />
      <div className="mt-12 flex items-center gap-6">
        {visible.length < list.length && (
          <button type="button" onClick={() => setShown((n) => n + PAGE)} className="t-ui inline-flex min-h-11 items-center rounded-[2px] border border-line px-6 transition-colors hover:border-accent">Load more</button>
        )}
        <p className="t-label text-muted" aria-live="polite">{visible.length} of {list.length} photographs</p>
      </div>
    </div>
  );
}
