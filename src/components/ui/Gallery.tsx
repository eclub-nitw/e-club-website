"use client";
import { useRef, useState } from "react";
import Image from "next/image";

export type GalleryItem = { src: string; alt: string; caption: string };

/** Uniform 3:2 grid with a keyboard-operable lightbox on a native <dialog> (focus trap + Esc come free). */
export function Gallery({ items }: { items: GalleryItem[] }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const open = (n: number) => { setI(n); dlg.current?.showModal(); };
  const step = (d: number) => setI((v) => (v + d + items.length) % items.length);
  const cur = items[i];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {items.map((it, n) => (
          <li key={it.src}>
            <button type="button" onClick={() => open(n)} className="group relative block aspect-[3/2] w-full overflow-hidden rounded-[2px] bg-surface">
              <Image src={it.src} alt={it.alt} fill loading="lazy" sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />
              <span className="sr-only">View larger: {it.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dlg} aria-label="Photo viewer"
        onClick={(e) => e.target === dlg.current && dlg.current.close()}
        onKeyDown={(e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}
        className="m-auto w-[min(1100px,94vw)] bg-transparent p-0 text-club-paper"
      >
        {cur && (
          <figure>
            <div className="relative aspect-[3/2] w-full"><Image src={cur.src} alt={cur.alt} fill sizes="94vw" className="object-contain" /></div>
            <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.08em]">
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
