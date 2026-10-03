import { copy } from "@/data/copy";
import { listInitiatives } from "@/lib/initiatives";
import { Button } from "@/components/ui/Button";
import { EventRow, listHasCovers } from "@/components/ui/EventRow";
import { Section } from "@/components/ui/Section";

/** Chapter "What we run": every initiative as an equal ledger row (the one in the spotlight carries a status chip while it runs). */
export function Initiatives({ number }: { number: string }) {
  const rows = listInitiatives();
  const cover = listHasCovers(rows.map((r) => r.event));
  return (
    <Section id="initiatives" number={number} title="Initiatives" heading={copy.initiatives.title} line={copy.initiatives.line}>
      <ul className="border-b border-line">
        {rows.map((r, i) => <li key={r.event.slug}><EventRow event={r.event} index={i} chip={r.chip} cover={cover} /></li>)}
      </ul>
      <div className="mt-8"><Button href="/initiatives" variant="link">All initiatives →</Button></div>
    </Section>
  );
}
