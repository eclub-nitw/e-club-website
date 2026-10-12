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
    <li className="border-b border-line last:border-b-0">
      <details className="group">
        <summary className="ledger-row rule-draw grid min-h-24 cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-5 select-none md:grid-cols-[1.4fr_1fr_auto] [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="font-mono text-xs text-muted transition-transform duration-200 group-open:rotate-90">
              ▶
            </span>
            <H3>{member.name}</H3>
          </div>
          <Label className="md:order-none">{member.role}</Label>
          <span className="flex items-center gap-4 md:justify-end">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="t-label inline-flex min-h-11 items-center text-link underline underline-offset-4 transition-opacity duration-200 hover:no-underline [@media(hover:hover)_and_(min-width:768px)]:opacity-0 [@media(hover:hover)_and_(min-width:768px)]:group-hover:opacity-100 [@media(hover:hover)_and_(min-width:768px)]:focus-visible:opacity-100"
              >
                LinkedIn<span className="sr-only"> profile of {member.name} (opens in a new tab)</span>
              </a>
            )}
            <span className="t-label text-muted max-md:hidden">Details ↓</span>
          </span>
        </summary>

        <div className="mb-6 ml-6 border-l-2 border-line pb-4 pl-6 pt-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Space for Photo */}
            <div className="relative flex size-24 shrink-0 items-center justify-center rounded-[2px] border border-line bg-surface text-center sm:size-28">
              {showPhoto ? (
                <Image
                  src={member.photo!}
                  alt={`Portrait of ${member.name}`}
                  fill
                  sizes="112px"
                  className="rounded-[2px] object-cover grayscale transition duration-500 group-hover:grayscale-0 motion-reduce:transition-none"
                />
              ) : (
                <div className="p-2">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">
                    Photo Pending
                  </span>
                </div>
              )}
            </div>

            {/* Member Details */}
            <dl className="grid flex-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {member.batch && (
                <div>
                  <dt><Label>Year / Batch</Label></dt>
                  <dd className="t-body mt-1">{member.batch}</dd>
                </div>
              )}
              <div>
                <dt><Label>Role</Label></dt>
                <dd className="t-body mt-1">{member.role}</dd>
              </div>
              <div>
                <dt><Label>Tenure</Label></dt>
                <dd className="t-body tabular mt-1">{member.year}</dd>
              </div>
              {member.linkedin && (
                <div>
                  <dt><Label>Profile</Label></dt>
                  <dd className="mt-1">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-body text-link underline underline-offset-4"
                    >
                      View LinkedIn Profile →
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </details>
    </li>
  );
}
