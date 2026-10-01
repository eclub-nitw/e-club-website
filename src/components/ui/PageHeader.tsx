import type { ArtKey } from "@/data/art";
import { Art } from "./Art";
import { Container } from "./Container";
import { MaskedText } from "./MaskedText";
import { H1, Label, Lede } from "./Type";

/**
 * Top of every inner page, and slide 01 of its own small deck: mono numeral + label on a hairline, the page's single h1 (headline voice),
 * an optional serif lede, and when `art` is given a generated-art band behind it under an ink veil. It clears the floating nav.
 * Event photographs never appear here (see docs/TYPE-SYSTEM.md and the V4 photo policy); only generated art or plain ink.
 */
export function PageHeader({ number, label, title, lede, tone = "ink", art, children }: {
  number: string; label: string; title: string; lede?: string; tone?: "ink" | "paper"; art?: ArtKey; children?: React.ReactNode;
}) {
  return (
    <header data-section={`${number} — ${label}`} className={`${tone === "paper" ? "tone-paper" : "bg-bg text-fg"} relative isolate overflow-hidden pb-16 pt-36 md:pb-24 md:pt-52`}>
      {art && tone === "ink" && (
        <div aria-hidden="true" className="parallax-photo absolute inset-0 -z-10">
          <Art name={art} priority sizes="100vw" className="size-full object-cover" />
          <div className="art-veil absolute inset-0" style={{ "--veil": "86%" } as React.CSSProperties} />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
        </div>
      )}
      <Container>
        {children}
        <Label className="mt-6 border-t border-line pt-4">{number} — {label}</Label>
        <H1 className="mt-6 max-w-[16ch]"><MaskedText text={title} immediate /></H1>
        {lede && <Lede className="mt-8 max-w-[34ch] text-body">{lede}</Lede>}
      </Container>
    </header>
  );
}
