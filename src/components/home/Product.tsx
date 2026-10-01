import type { ClubEvent } from "@/data/events";
import { copy } from "@/data/copy";
import { ArchiveRows } from "@/components/ui/ArchiveRows";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

/** Chapter 05, the product slide: the events as a ledger with hover-swap covers (generated art until real cover art exists). */
export function Product({ flagship }: { flagship?: ClubEvent }) {
  return (
    <Section id="events" number="05" title="Product" heading={copy.events.heading} tone="paper">
      <ArchiveRows flagship={flagship} />
      <div className="mt-10"><Button href="/events" variant="link">All events and the archive →</Button></div>
    </Section>
  );
}
