import Image from "next/image";
import type { Partner } from "@/data/partners";
import { Label } from "./Type";

/** Hairline-framed, equal-size cells: role in mono above, then the logo if the partner's file and written consent exist, else the name in display type. */
export function PartnerGrid({ list }: { list: Partner[] }) {
  return (
    <ul className="grid grid-cols-1 border-l border-t border-line min-[560px]:grid-cols-2 lg:grid-cols-5">
      {list.map((p) => {
        const body = (
          <>
            <Label>{p.role}</Label>
            <span className="mt-auto flex min-h-16 items-end">
              {p.consent && p.logo
                ? <Image src={p.logo.src} alt={p.name} width={p.logo.w} height={p.logo.h} className="h-14 w-auto max-w-full object-contain object-left" />
                : <span className="t-h3">{p.name}</span>}
            </span>
          </>
        );
        const cell = "ledger-row flex h-full min-h-40 flex-col gap-6 p-5";
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
