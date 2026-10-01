import Image from "next/image";
import type { Member } from "@/data/team";
import { H3, Label } from "./Type";

/**
 * Roster row, typographic first: name in the headline voice, role in mono, a handle link revealed on hover and focus.
 * A greyscale portrait appears only when consent is recorded in the data file AND a photo exists.
 */
export function TeamMember({ member }: { member: Member }) {
  const showPhoto = member.photoConsent && !!member.photo;
  return (
    <li className="ledger-row group rule-draw grid min-h-24 grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-5 md:grid-cols-[1.4fr_1fr_auto]">
      <H3>{member.name}</H3>
      <Label className="md:order-none">{member.role}</Label>
      <span className="flex items-center gap-4 md:justify-end">
        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="t-label inline-flex min-h-11 items-center text-link underline underline-offset-4 transition-opacity duration-200 hover:no-underline md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100">
            LinkedIn<span className="sr-only"> profile of {member.name} (opens in a new tab)</span>
          </a>
        )}
        {showPhoto && (
          <span className="relative block size-16 shrink-0 overflow-hidden rounded-[2px]">
            <Image src={member.photo!} alt={`Portrait of ${member.name}`} fill sizes="64px" className="object-cover grayscale transition duration-500 group-hover:grayscale-0 motion-reduce:transition-none" />
          </span>
        )}
      </span>
    </li>
  );
}
