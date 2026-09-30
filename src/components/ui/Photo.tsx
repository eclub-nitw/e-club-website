import type { Photo as PhotoT } from "@/data/media";
import { caption, fileOf, srcSet } from "@/lib/photos";

/**
 * A club photo: AVIF/WebP `<picture>` at 640/1024/1600, fixed aspect box (no layout shift), 24px blur-up behind it,
 * corner crop marks and a mono caption. Consent is enforced by the Photo type (`consent: true` only).
 */
export function Photo({ photo, sizes, aspect = "3/2", eager = false, showCaption = true, className = "" }: {
  photo: PhotoT; sizes: string; aspect?: string; eager?: boolean; showCaption?: boolean; className?: string;
}) {
  return (
    <figure className={className}>
      <div className="crop relative overflow-hidden rounded-[2px] bg-surface" style={{ aspectRatio: aspect }}>
        <picture>
          <source type="image/avif" srcSet={srcSet(photo, "avif")} sizes={sizes} />
          <source type="image/webp" srcSet={srcSet(photo, "webp")} sizes={sizes} />
          <img
            src={fileOf(photo, 1024, "webp")} alt={photo.alt} width={photo.w} height={photo.h}
            loading={eager ? "eager" : "lazy"} decoding="async"
            className="absolute inset-0 size-full object-cover" style={{ backgroundImage: `url(${photo.blur})`, backgroundSize: "cover" }}
          />
        </picture>
      </div>
      {showCaption && <figcaption className="label mt-3 flex justify-between gap-4 text-muted"><span>{caption(photo)}</span><span aria-hidden="true">{photo.id}</span></figcaption>}
    </figure>
  );
}
