import { copy } from "@/data/copy";
import { Art } from "@/components/ui/Art";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Body, Label } from "@/components/ui/Type";

/**
 * Chapter 02, the problem slide. Split layout: one big serif question on the left, three small mono-labelled statements on the right,
 * over the generated ledger art under a heavy ink veil (paper text on that veil measures well above 7:1).
 */
export function Problem() {
  return (
    <Section id="problem" number="02" title="The problem" heading={copy.problem.question[0]} bare className="isolate overflow-hidden py-24 md:py-40">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Art name="manifesto" sizes="100vw" className="size-full object-cover" />
        <div className="art-veil absolute inset-0" style={{ "--veil": "86%" } as React.CSSProperties} />
      </div>
      <Container>
        <Label className="border-t border-line pt-4">02 — The problem</Label>
        <div className="mt-12 grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
          <h2 id="problem-h" className="t-lede-xl m-0 max-w-[16ch]">{copy.problem.question[0]}</h2>
          <ul className="flex flex-col justify-end gap-8 lg:pb-3">
            {copy.problem.statements.map((s, i) => (
              <li key={s.label} className="rule-draw pt-5">
                <Label className="text-accent-text">{String(i + 1).padStart(2, "0")} / {s.label}</Label>
                <Body className="mt-2">{s.text}</Body>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
