"use client";
import { useRef, useState } from "react";
import type { EventPhoto } from "@/data/event-photos";
import { fileOf, srcSet } from "@/lib/photo-url";

export type GalleryGroup = { slug: string; title: string; photos: EventPhoto[] };

/**
 * Gallery grouped by event, with an All / per-event filter (aria-pressed buttons). Every photo sits in the same 3:2 frame (a grid of two columns, three from 768px: six photos fill whole rows at both), cropped with
 * object-cover around its focal point; the viewer shows the whole picture. A photo opens in a native modal <dialog>: focus moves in and returns to the thumbnail on close,
 * Escape closes, arrow keys step through the visible set, and the counter and caption are always shown. Everything is lazy; the viewer image is
 * rendered only after the first open, so a closed dialog fetches nothing.
 */
export function Gallery({ groups }: { groups: GalleryGroup[] }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [filter, setFilter] = useState("all");
  const [i, setI] = useState(0);
  const [opened, setOpened] = useState(false);
  const shown = groups.filter((g) => filter === "all" || g.slug === filter);
  const flat = shown.flatMap((g) => g.photos.map((p) => ({ ...p, slug: g.slug, group: g.title })));
  const cur = flat[i];
  const open = (slug: string, n: number) => { setI(Math.max(0, flat.findIndex((p) => p.slug === slug && p.n === n))); setOpened(true); dlg.current?.showModal(); };
  const step = (d: number) => setI((v) => (v + d + flat.length) % flat.length);

  return (
    <div>
      <div role="group" aria-label="Filter by event" className="mb-10 flex flex-wrap items-center gap-2">
        <span className="t-label mr-2 text-muted">Event</span>
        {[{ slug: "all", title: "All" }, ...groups].map((g) => (
          <button key={g.slug} type="button" aria-pressed={filter === g.slug} onClick={() => setFilter(g.slug)}
            className={`t-label min-h-11 rounded-[2px] border px-4 transition-colors duration-200 ${filter === g.slug ? "border-accent bg-accent text-accent-fg" : "border-line text-muted hover:text-fg"}`}>
            {g.title}
          </button>
        ))}
      </div>

      {shown.map((g) => (
        <section key={g.slug} aria-labelledby={`g-${g.slug}`} className="mb-[var(--section-y)] last:mb-0">
          <h2 id={`g-${g.slug}`} className="t-label flex justify-between border-t border-line pt-4 text-muted"><span>{g.title}</span><span className="tabular">{g.photos.length} photographs</span></h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {g.photos.map((p) => (
              <li key={p.n}>
                <button type="button" onClick={() => open(g.slug, p.n)} className={`crop group relative block aspect-[3/2] w-full overflow-hidden rounded-[2px] bg-surface`} style={{ backgroundImage: `url(${p.blur})`, backgroundSize: "cover" }}>
                  <picture>
                    <source type="image/avif" srcSet={srcSet(g.slug, p, "avif")} sizes="(min-width: 768px) 33vw, 50vw" />
                    <source type="image/webp" srcSet={srcSet(g.slug, p, "webp")} sizes="(min-width: 768px) 33vw, 50vw" />
                    <img src={fileOf(g.slug, p.n, 640, "webp")} alt={p.alt} width={p.w} height={p.h} loading="lazy" decoding="async"
                      className="absolute inset-0 size-full object-cover transition-transform duration-[250ms] ease-[var(--ease-out-expo)] group-hover:-translate-y-1 motion-reduce:transition-none" style={{ objectPosition: p.focal }} />
                  </picture>
                  <span className="sr-only">View larger: {g.title}, photograph {p.n}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <dialog
        ref={dlg} aria-label="Photo viewer"
        onClick={(e) => e.target === dlg.current && dlg.current.close()}
        onKeyDown={(e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}
        className="m-auto max-h-[94svh] w-[min(1100px,94vw)] bg-transparent p-0 text-club-paper backdrop:bg-club-ink/90"
      >
        {opened && cur && (
          <figure>
            <div className="relative flex max-h-[76svh] justify-center">
              <picture>
                <source type="image/avif" srcSet={srcSet(cur.slug, cur, "avif")} sizes="94vw" />
                <source type="image/webp" srcSet={srcSet(cur.slug, cur, "webp")} sizes="94vw" />
                <img src={fileOf(cur.slug, cur.n, 1600, "webp")} alt={cur.alt} width={cur.w} height={cur.h} className="max-h-[76svh] w-auto max-w-full object-contain" style={{ backgroundImage: `url(${cur.blur})`, backgroundSize: "cover" }} />
              </picture>
            </div>
            <figcaption className="t-label mt-3 flex flex-wrap items-center justify-between gap-4">
              <span>{cur.group} · {i + 1}/{flat.length}</span>
              <span className="flex gap-2">
                <button type="button" onClick={() => step(-1)} className="min-h-11 min-w-11 border border-club-paper/30 px-3">Prev</button>
                <button type="button" onClick={() => step(1)} className="min-h-11 min-w-11 border border-club-paper/30 px-3">Next</button>
                <button type="button" onClick={() => dlg.current?.close()} className="min-h-11 min-w-11 border border-club-paper/30 px-3">Close</button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
      <p className="sr-only" role="status">{flat.length} photographs shown</p>
    </div>
  );
}
