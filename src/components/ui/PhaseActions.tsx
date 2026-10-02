"use client";
import { usePhase } from "@/lib/hooks";
import { viewOf, type Link, type Phase } from "@/lib/phase";
import { Button } from "./Button";
import { Countdown } from "./Countdown";
import { Label } from "./Type";

// Client leaves for the date-driven bits of otherwise static pages. Each takes the phase the server computed, so the first paint matches
// the HTML, and then follows the browser clock (see usePhase).

/** The Unstop call to action while one exists (registration, then submissions); nothing afterwards. */
export function ActionButton({ initial }: { initial: Phase }) {
  const action = viewOf(usePhase(initial)).action;
  return action ? <Button href={action.href}>{action.label}</Button> : null;
}

/** Buttons for a hero or stage: the Unstop action if there is one, else `lead` if given; `then` is secondary beside either, primary when alone. */
export function PhaseActions({ initial, lead, then }: { initial: Phase; lead?: Link; then: Link }) {
  const action = viewOf(usePhase(initial)).action ?? lead;
  return (
    <>
      {action && <Button href={action.href}>{action.label}</Button>}
      <Button href={then.href} variant={action ? "secondary" : "primary"}>{then.label}</Button>
    </>
  );
}

/** Label and countdown for whatever the next boundary is. */
export function PhaseCountdown({ initial, className = "" }: { initial: Phase; className?: string }) {
  const c = viewOf(usePhase(initial)).countdown;
  return (
    <>
      <Label className={className}>{c.label}</Label>
      <Countdown start={c.start} end={c.end} label={c.label} />
    </>
  );
}
