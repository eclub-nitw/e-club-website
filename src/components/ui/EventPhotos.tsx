"use client";
import { useState } from "react";
import type { EventPhoto } from "@/data/event-photos";
import { fileOf, srcSet } from "@/lib/photo-url";

/**
 * Photo-led block for an event page: one large photograph (whole frame, on an ink mat) and a strip of thumbnails. The thumbnails are real
 * buttons (Tab to reach, Enter or Space to choose, aria-pressed marks the current one), and Arrow keys move along the strip.
 */
export function EventPhotos({ slug, title, photos }: { slug: string; title: string; photos: EventPhoto[] }) {
  const [i, setI] = useState(0);
  const cur = photos[i];
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setI((v) => (v + 1) % photos.length);
    if (e.key === "ArrowLeft") setI((v) => (v - 1 + photos.length) % photos.length);
  };
  return (
    <div>
      <figure>
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[2px] bg-club-ink" style={{ backgroundImage: `url(${cur.blur})`, backgroundSize: "cover" }}>
          <picture key={cur.n}>
            <source type="image/avif" srcSet={srcSet(slug, cur, "avif")} sizes="(min-width: 1024px) 60rem, 94vw" />
            <source type="image/webp" srcSet={srcSet(slug, cur, "webp")} sizes="(min-width: 1024px) 60rem, 94vw" />
            <img src={fileOf(slug, cur.n, 960, "webp")} alt={cur.alt} width={cur.w} height={cur.h} loading="lazy" decoding="async" className="absolute inset-0 size-full object-contain" />
          </picture>
        </div>
        <figcaption className="t-label mt-3 flex justify-between text-muted"><span>{title}</span><span className="tabular" aria-live="polite">{i + 1} / {photos.length}</span></figcaption>
      </figure>
      <ul role="group" aria-label={`${title} photographs`} onKeyDown={onKey} className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
        {photos.map((p, n) => (
          <li key={p.n}>
            <button type="button" aria-pressed={n === i} aria-label={`Photograph ${n + 1} of ${photos.length}`} onClick={() => setI(n)}
              className={`relative block aspect-[3/2] w-full min-h-11 overflow-hidden rounded-[2px] border transition-opacity duration-200 ${n === i ? "border-accent" : "border-line opacity-70 hover:opacity-100"}`} style={{ backgroundImage: `url(${p.blur})`, backgroundSize: "cover" }}>
              <picture>
                <source type="image/webp" srcSet={fileOf(slug, p.n, 640, "webp")} />
                <img src={fileOf(slug, p.n, 640, "webp")} alt="" width={p.w} height={p.h} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" style={{ objectPosition: p.focal }} />
              </picture>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
