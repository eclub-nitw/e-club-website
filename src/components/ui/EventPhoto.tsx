import type { EventPhoto as Photo } from "@/data/event-photos";
import { FRAME, fileOf, srcSet } from "@/lib/photo-url";

/** One event photograph in its fixed frame (3:2 or 4:5), cropped with object-cover around the photo's focal point. Lazy: never the LCP element. */
export function EventPhoto({ slug, photo, sizes, className = "", eager = false }: { slug: string; photo: Photo; sizes: string; className?: string; eager?: boolean }) {
  return (
    <span className={`relative block overflow-hidden rounded-[2px] bg-surface ${FRAME[photo.ratio]} ${className}`} style={{ backgroundImage: `url(${photo.blur})`, backgroundSize: "cover" }}>
      <picture>
        <source type="image/avif" srcSet={srcSet(slug, photo, "avif")} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(slug, photo, "webp")} sizes={sizes} />
        <img src={fileOf(slug, photo.n, 960, "webp")} alt={photo.alt} width={photo.w} height={photo.h} loading={eager ? "eager" : "lazy"} decoding="async"
          className="absolute inset-0 size-full object-cover" style={{ objectPosition: photo.focal }} />
      </picture>
    </span>
  );
}
