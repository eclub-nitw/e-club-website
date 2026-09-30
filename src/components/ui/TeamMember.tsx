import Image from "next/image";
import type { Member } from "@/data/team";

/** Index-card style member: greyscale 4:5 portrait (colour on hover), role in mono. Photo shows only with recorded consent. */
export function TeamMember({ member }: { member: Member }) {
  const showPhoto = member.photoConsent && !!member.photo;
  return (
    <li className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-surface">
        {showPhoto ? (
          <Image src={member.photo!} alt={`Portrait of ${member.name}`} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover grayscale transition duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0 motion-reduce:transition-none" />
        ) : (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center font-display text-7xl font-semibold text-muted/50">{member.name.charAt(0)}</span>
        )}
      </div>
      <p className="mt-4 font-display text-xl font-medium leading-snug">{member.name}</p>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.08em] text-muted">{member.role}</p>
      {member.linkedin && (
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center text-sm text-link underline underline-offset-4 hover:no-underline">
          {member.name} on LinkedIn<span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </li>
  );
}
