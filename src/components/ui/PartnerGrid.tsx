import Image from "next/image";
import type { Partner } from "@/data/partners";
import { Label } from "./Type";

/**
 * Equal cells in a hairline frame. Each cell: the partner's role in mono above, then a white plate of fixed size (it hides every logo file's own
 * background) holding the logo (object-contain) when the file and written permission exist, else the name as a wordmark. Names are plain text either way.
 */
export function PartnerGrid({ list }: { list: Partner[] }) {
  return (
    <ul className="grid grid-cols-1 border-l border-t border-line min-[560px]:grid-cols-2 lg:grid-cols-5">
      {list.map((p) => {
        const body = (
          <>
            <Label>{p.role}</Label>
            <span className="flex h-24 items-center justify-center rounded-[2px] bg-white p-4 text-club-ink">
              {p.consent && p.logo
                ? <Image src={p.logo.src} alt={p.name} width={p.logo.w} height={p.logo.h} sizes="12rem" className="max-h-full w-auto max-w-full object-contain" />
                : <span className="t-h3 text-center">{p.name}</span>}
            </span>
          </>
        );
        const cell = "ledger-row flex h-full flex-col gap-4 p-5";
        return (
          <li key={p.slug} className="border-b border-r border-line">
            {p.href
              ? <a href={p.href} target="_blank" rel="noopener noreferrer" className={cell}>{body}<span className="sr-only"> (opens in a new tab)</span></a>
              : <div className={cell}>{body}</div>}
          </li>
        );
      })}
    </ul>
  );
}
