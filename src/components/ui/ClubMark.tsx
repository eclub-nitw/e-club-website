import Image from "next/image";
import { site } from "@/data/site";

/**
 * The club's mark. With the official logo file configured in data/site.ts it is that image; until then it is the site's own three-bar glyph
 * (the same drawing as the favicon), which makes no claim to be the official logo. Decorative: the words beside it carry the name.
 */
export function ClubMark({ size = 28 }: { size?: number }) {
  const logo = site.logos.eclub;
  if (logo) return <Image src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} style={{ height: size, width: "auto" }} />;
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 32 32" className="shrink-0">
      <rect x="5" y="19" width="5" height="8" fill="var(--color-club-teal)" />
      <rect x="13" y="13" width="5" height="14" fill="var(--color-club-cyan)" />
      <rect x="21" y="5" width="5" height="22" fill="var(--color-club-gold)" />
    </svg>
  );
}

/** Club mark, the NIT Warangal emblem (only while site.showInstituteLogo is on) and the full name. */
export function BrandLockup({ size = 40 }: { size?: number }) {
  const nitw = site.logos.nitw;
  return (
    <div className="flex items-center gap-4">
      <ClubMark size={size} />
      {site.showInstituteLogo && (
        <>
          <span aria-hidden="true" className="t-label text-muted">×</span>
          <Image src={nitw.src} alt={nitw.alt} width={nitw.w} height={nitw.h} style={{ height: size, width: "auto" }} />
        </>
      )}
      <p className="t-label text-muted">Entrepreneurship Club,<br />NIT Warangal</p>
    </div>
  );
}
