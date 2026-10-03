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

/** The club's mark and full name. The institute's emblem is never paired with it (see InstituteMark): it stands apart, as the institution the club belongs to. */
export function BrandLockup({ size = 56 }: { size?: number }) {
  return (
    <div className="flex items-center gap-4">
      <ClubMark size={size} />
      <p className="t-label text-muted">Entrepreneurship Club,<br />NIT Warangal</p>
    </div>
  );
}

/** The NIT Warangal emblem on its own white plate with the club's legal name, in a place of its own (footer): reads as the institution the club works under. Hidden with `site.showInstituteLogo`. */
export function InstituteMark() {
  const nitw = site.logos.nitw;
  if (!site.showInstituteLogo) return null;
  return (
    <div className="flex items-center gap-4">
      <span className="flex size-20 shrink-0 items-center justify-center rounded-[2px] bg-white p-2"><Image src={nitw.src} alt={nitw.alt} width={nitw.w} height={nitw.h} sizes="5rem" className="h-full w-auto object-contain" /></span>
      <p className="t-label max-w-[22ch] text-muted">{site.legalName}</p>
    </div>
  );
}
