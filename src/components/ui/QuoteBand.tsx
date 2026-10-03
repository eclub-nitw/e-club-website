import { site } from "@/data/site";
import { Display, Label } from "./Type";
import { MaskedText } from "./MaskedText";

/** The club's four-word line, set large. Each word rises through its mask in sequence (700ms, 120ms apart) the first time it is scrolled into view. */
export function QuoteBand({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Label className="border-t border-line pt-4">{site.quote.club}</Label>
      <Display as="p" className="mt-6 max-w-[16ch]"><MaskedText text={site.quote.line} stagger={120} /></Display>
    </div>
  );
}
