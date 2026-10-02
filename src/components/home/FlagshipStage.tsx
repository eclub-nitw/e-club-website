import { event } from "@/data/event";
import { fmtRange } from "@/lib/format";
import { registerOpen } from "@/lib/register-state";
import { Art } from "@/components/ui/Art";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Countdown } from "@/components/ui/Countdown";
import { Body, H2, H3, Label } from "@/components/ui/Type";

/** Chapter "Flagship", part two: the stage the vortex lands on. Countdown, prize, three rounds, Unstop CTA. */
export function FlagshipStage() {
  const open = registerOpen();
  const [r1, r2, r3] = event.rounds;
  return (
    <div id="flagship-stage" className="relative isolate overflow-hidden py-24 md:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Art name="pitch-stage" sizes="100vw" className="size-full object-cover" />
        <div className="art-veil absolute inset-0" style={{ "--veil": "88%" } as React.CSSProperties} />
      </div>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Label className="border-t border-line pt-4">Finale on campus · {fmtRange(r3.start, r3.end)}</Label>
            <H2 id="flagship-h" className="mt-6">{event.name} 2026</H2>
            <p className="t-stat tabular mt-8 text-accent-text">₹50,000</p>
            <Label className="mt-2">Total prize pool</Label>
            <Body className="mt-6">{event.eligibility} Teams of {event.team.min} to {event.team.max}. {event.fee} to enter.</Body>
            <div className="mt-8"><Countdown start={r3.start} end={r3.end} /></div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              {open && <Button href={event.registerUrl}>Register on Unstop</Button>}
              <Button href="/venture-vortex" variant={open ? "secondary" : "primary"}>Competition details</Button>
            </div>
          </div>
          <ol className="self-end border-b border-line">
            {[r1, r2, r3].map((r) => (
              <li key={r.id} className="rule-draw grid gap-x-6 gap-y-1 py-6">
                <Label className="text-accent-text">Round {r.n} · {r.mode}</Label>
                <H3>{r.name}</H3>
                <Label className="tabular">{fmtRange(r.start, r.end)} · {r.subtitle}</Label>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </div>
  );
}
