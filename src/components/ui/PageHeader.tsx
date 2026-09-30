import { photoById } from "@/lib/photos";
import { fileOf, srcSet } from "@/lib/photo-url";
import { Container } from "./Container";
import { MaskedText } from "./MaskedText";

/**
 * Top of every inner page: mono label, the page's single h1, a lede and, when `photoId` is given, a photo-led band behind it
 * (a real club photograph under an ink wash so the type stays readable). Clears the fixed nav.
 */
export function PageHeader({ number, label, title, lede, tone = "ink", photoId, children }: {
  number: string; label: string; title: string; lede?: string; tone?: "ink" | "paper"; photoId?: string; children?: React.ReactNode;
}) {
  const photo = photoId ? photoById(photoId) : null;
  return (
    <div className={`${tone === "paper" ? "tone-paper" : "bg-bg text-fg"} relative isolate overflow-hidden pb-14 pt-32 md:pb-20 md:pt-44`}>
      {photo && tone === "ink" && (
        <div className="parallax-photo absolute inset-0 -z-10">
          <picture>
            <source type="image/avif" srcSet={srcSet(photo, "avif")} sizes="100vw" />
            <source type="image/webp" srcSet={srcSet(photo, "webp")} sizes="100vw" />
            <img src={fileOf(photo, 1024, "webp")} alt={photo.alt} width={photo.w} height={photo.h} fetchPriority="high" decoding="async" className="size-full object-cover" />
          </picture>
          <div className="absolute inset-0 bg-bg/80" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent" />
        </div>
      )}
      <Container>
        {children}
        <p className="label mt-6 border-t border-line pt-4 text-muted">{number} — {label}</p>
        <h1 className="h1-xl up mt-6 max-w-[14ch]">
          <MaskedText text={title} immediate />
        </h1>
        {lede && <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-fg/80 md:text-xl">{lede}</p>}
      </Container>
    </div>
  );
}
