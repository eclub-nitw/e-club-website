import { copy } from "@/data/copy";
import { events } from "@/data/events";
import { InView } from "@/components/ui/InView";
import { Section } from "@/components/ui/Section";
import { Body, Label } from "@/components/ui/Type";

// Decorative heights only. There is no axis and no value on purpose: this is an illustration, not growth data.
const BARS = [18, 26, 34, 46, 58, 74, 100];

/**
 * Chapter 04, the traction slide. The club has not supplied growth numbers, so this chapter never implies any: the bars are an explicit
 * illustration (labelled as such, no axis, no values), and the only figures shown are verified facts with their sources.
 */
export function Traction() {
  const stats = [...copy.facts, ...events.flatMap((e) => e.stats ?? [])];
  return (
    <Section id="traction" number="04" title="Traction" heading={copy.traction.heading}>
      <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
        <figure className="m-0">
          <InView className="bars">
            <div aria-hidden="true" className="flex h-[min(52vw,22rem)] items-end gap-[3%] border-b border-line">
              {BARS.map((h, i) => (
                <span key={h} style={{ height: `${h}%`, "--i": i } as React.CSSProperties}
                  className={`ledger-bar flex-1 rounded-t-[2px] ${i === BARS.length - 1 ? "bg-accent" : "bg-club-deep"}`} />
              ))}
            </div>
          </InView>
          <figcaption className="t-label mt-3 text-muted">{copy.traction.illustration}</figcaption>
        </figure>

        <div>
          <Body>{copy.traction.note}</Body>
          <dl className="mt-10">
            {stats.map((s) => (
              <div key={s.label} className="rule-draw grid gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,12rem)_1fr]">
                <dt className="t-h2 tabular">{s.value}</dt>
                <dd className="m-0">
                  <p className="t-body">{s.label}</p>
                  <Label className="mt-2">Source: {s.source}</Label>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
