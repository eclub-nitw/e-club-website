import Link from "next/link";
import { copy } from "@/data/copy";
import { Section } from "@/components/ui/Section";
import { Body, Label } from "@/components/ui/Type";

const ASKS = [
  { href: "/join", title: "Join the club", text: "Recruitment details and how to apply." },
  { href: "/sponsors", title: "Partner with us", text: "Back a competition, a session, or a student founder." },
] as const;

/** Chapter 09, the ask: two big rows (cards as ledger rows), one primary action each. */
export function Ask() {
  return (
    <Section id="ask" number="09" title="The ask" heading={copy.ask.heading} tone="paper">
      <ul className="border-b border-line">
        {ASKS.map((r, i) => (
          <li key={r.href}>
            <Link href={r.href} data-cursor="OPEN" className="ledger-row group rule-draw grid min-h-40 items-center gap-x-8 gap-y-3 py-8 md:grid-cols-[3rem_1.4fr_1fr_2rem]">
              <Label>{String(i + 1).padStart(2, "0")}</Label>
              <span className="t-h1">{r.title}</span>
              <Body as="span">{r.text}</Body>
              <span aria-hidden="true" className="hidden transition-transform duration-200 group-hover:translate-x-1 md:block">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
