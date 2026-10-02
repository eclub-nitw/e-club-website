import Image from "next/image";
import type { Sponsor } from "@/data/sponsors";

/** Uniform 40px-high logo, greyscale until hover/focus. Only rendered when the sponsor's consent is recorded. */
export function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  if (!sponsor.consent || !sponsor.logo || !sponsor.width) return null;
  const img = <Image src={sponsor.logo} alt={sponsor.name} width={sponsor.width} height={40} className="h-10 w-auto opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0" />;
  return sponsor.href ? (
    <a href={sponsor.href} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-11 items-center">{img}<span className="sr-only"> (opens in a new tab)</span></a>
  ) : (
    <span className="group inline-flex min-h-11 items-center">{img}</span>
  );
}
