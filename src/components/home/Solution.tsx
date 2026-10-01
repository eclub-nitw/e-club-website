import { copy } from "@/data/copy";
import { Section } from "@/components/ui/Section";
import { Body, H3, Label, Lede } from "@/components/ui/Type";

/**
 * Chapter 03, the solution slide (who we are), on paper. Dominant: the serif description. Secondary: the areas as ledger rows whose
 * hairlines draw on scroll. Supporting: mono numbers. Copy is CONFIRM until the club supplies its own (docs/CONTENT-INTAKE.md).
 */
export function Solution() {
  return (
    <Section id="solution" number="03" title="The solution" heading="Who we are" tone="paper">
      <div className="grid gap-16 lg:grid-cols-[1.25fr_1fr] lg:gap-24">
        <Lede className="max-w-[28ch]">{copy.solution.lede[0]}</Lede>
        <ol className="self-end">
          {copy.solution.areas.map((a, i) => (
            <li key={a.name} className="rule-draw grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-2 py-6">
              <Label className="pt-2">{String(i + 1).padStart(2, "0")}</Label>
              <div>
                <H3>{a.name}</H3>
                <Body className="mt-2">{a.text}</Body>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
