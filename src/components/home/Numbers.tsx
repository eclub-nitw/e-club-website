import { copy } from "@/data/copy";
import { CountUp } from "@/components/ui/CountUp";
import { InView } from "@/components/ui/InView";
import { Section } from "@/components/ui/Section";
import { H3, Label } from "@/components/ui/Type";

export type Stat = { value: string; label: string; note: string };

/**
 * Chapter "Venture Vortex in numbers": five verified figures in one ledger. Each cell is a three-row subgrid (numeral, label, note), so the
 * numerals can never run into their labels and the rows line up across the row. On entering the viewport the figures count up (900ms) and
 * each hairline draws once (CSS, see .stat-ledger); without JS or under reduced motion everything is simply there.
 */
export function Numbers({ number, stats }: { number: string; stats: Stat[] }) {
  return (
    <Section id="numbers" number={number} title="Numbers" heading={copy.numbers.title} line={copy.numbers.line}>
      <InView className="stat-ledger">
        <dl className="stat-grid">
          {stats.map((s, i) => (
            <div key={s.label} className="stat-cell" style={{ "--i": i } as React.CSSProperties}>
              <dt className="t-stat tabular"><CountUp value={s.value} /></dt>
              <dd className="m-0"><H3 as="p">{s.label}</H3></dd>
              <dd className="m-0"><Label>{s.note}</Label></dd>
            </div>
          ))}
        </dl>
      </InView>
    </Section>
  );
}
