"use client";
import { useRef, useState } from "react";
import { fileOf, srcSet } from "@/lib/photo-url";

export type GalleryItem = { id: string; event: string; w: number; h: number; alt: string; caption: string; blur: string };

/**
 * Masonry of club photographs (CSS columns, natural aspect, blur-up behind each) with a lightbox on a native modal <dialog>:
 * focus is trapped and restored, Esc closes, arrow keys and horizontal swipe step through, captions and a counter are always shown.
 */
export function Gallery({ items }: { items: GalleryItem[] }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const start = useRef<number | null>(null);
  const [i, setI] = useState(0);
  const [opened, setOpened] = useState(false); // the viewer image is rendered only after first open, so a closed dialog never fetches anything
  const open = (n: number) => { setI(n); setOpened(true); dlg.current?.showModal(); };
  const step = (d: number) => setI((v) => (v + d + items.length) % items.length);
  const cur = items[i];

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 md:gap-5">
        {items.map((it, n) => (
          <li key={it.id} className="mb-3 break-inside-avoid md:mb-5">
            <button type="button" onClick={() => open(n)} data-cursor="VIEW" className="crop group relative block w-full overflow-hidden rounded-[2px] bg-surface" style={{ aspectRatio: `${it.w} / ${it.h}`, backgroundImage: `url(${it.blur})`, backgroundSize: "cover" }}>
              <picture>
                <source type="image/avif" srcSet={srcSet(it, "avif")} sizes="(min-width: 768px) 33vw, 50vw" />
                <source type="image/webp" srcSet={srcSet(it, "webp")} sizes="(min-width: 768px) 33vw, 50vw" />
                <img src={fileOf(it, 640, "webp")} alt={it.alt} width={it.w} height={it.h} loading="lazy" fetchPriority="low" decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:-translate-y-1 motion-reduce:transition-none" />
              </picture>
              <span className="sr-only">View larger: {it.caption}</span>
            </button>
            <p className="t-label mt-2 text-muted" aria-hidden="true">{it.caption}</p>
          </li>
        ))}
      </ul>
      <dialog
        ref={dlg} aria-label="Photo viewer"
        onClick={(e) => e.target === dlg.current && dlg.current.close()}
        onKeyDown={(e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}
        className="m-auto max-h-[94svh] w-[min(1100px,94vw)] bg-transparent p-0 text-club-paper backdrop:bg-club-ink/90"
      >
        {opened && cur && (
          <figure>
            <div
              className="relative flex max-h-[76svh] justify-center touch-pan-y"
              onPointerDown={(e) => { start.current = e.clientX; }}
              onPointerUp={(e) => { if (start.current !== null && Math.abs(e.clientX - start.current) > 50) step(e.clientX < start.current ? 1 : -1); start.current = null; }}
            >
              <picture>
                <source type="image/avif" srcSet={srcSet(cur, "avif")} sizes="94vw" />
                <source type="image/webp" srcSet={srcSet(cur, "webp")} sizes="94vw" />
                <img src={fileOf(cur, 1600, "webp")} alt={cur.alt} width={cur.w} height={cur.h} className="max-h-[76svh] w-auto max-w-full object-contain" style={{ backgroundImage: `url(${cur.blur})`, backgroundSize: "cover" }} />
              </picture>
            </div>
            <figcaption className="t-label mt-3 flex flex-wrap items-center justify-between gap-4">
              <span>{cur.caption} · {i + 1}/{items.length}</span>
              <span className="flex gap-2">
                <button type="button" onClick={() => step(-1)} className="min-h-11 min-w-11 border border-club-paper/30 px-3">Prev</button>
                <button type="button" onClick={() => step(1)} className="min-h-11 min-w-11 border border-club-paper/30 px-3">Next</button>
                <button type="button" onClick={() => dlg.current?.close()} className="min-h-11 min-w-11 border border-club-paper/30 px-3">Close</button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
