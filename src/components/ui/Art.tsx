import { art, type ArtKey } from "@/data/art";

/**
 * Generated abstract art (never a photograph of the club). AVIF/WebP at 800 and 1600 wide, fixed intrinsic size so nothing shifts,
 * 24px blur placeholder behind it. Decorative by default (alt=""); pass `alt` only if the image carries meaning.
 */
export function Art({ name, sizes = "100vw", priority = false, alt = "", className = "" }: {
  name: ArtKey; sizes?: string; priority?: boolean; alt?: string; className?: string;
}) {
  const a = art[name];
  const set = (ext: "avif" | "webp") => `/images/art/${name}-800.${ext} 800w, /images/art/${name}-1600.${ext} 1600w`;
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`/images/art/${name}-1600.webp`} alt={alt} width={a.w} height={a.h}
        {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })} decoding="async"
        className={className} style={{ backgroundImage: `url(${a.blur})`, backgroundSize: "cover" }}
      />
    </picture>
  );
}
