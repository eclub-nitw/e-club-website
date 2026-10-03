"use client";
import Link from "next/link";
import { usePhase, useSpotlight } from "@/lib/hooks";
import { viewOf, type Phase } from "@/lib/phase";

/** One small, phase-aware line under the hero buttons. Gone when the spotlight ends (the clock decides in the browser). */
export function SpotlightChip({ initial, visible }: { initial: Phase; visible: boolean }) {
  const on = useSpotlight(visible);
  const chip = viewOf(usePhase(initial)).chip;
  if (!on) return null;
  return (
    <Link href={chip.href} className="t-label group mt-8 inline-flex min-h-11 items-center gap-3 border-y border-line py-2 text-fg hover:border-accent">
      <span aria-hidden="true" className="size-1.5 rotate-45 bg-accent" />
      <span>{chip.label}</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">→</span>
    </Link>
  );
}
