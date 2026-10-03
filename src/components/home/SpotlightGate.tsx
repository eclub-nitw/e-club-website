"use client";
import { useSpotlight } from "@/lib/hooks";

/** Server-rendered spotlight content that the browser clock can still take down: cached HTML never keeps promoting an initiative past its sunset. */
export function SpotlightGate({ initial, children }: { initial: boolean; children: React.ReactNode }) {
  return useSpotlight(initial) ? <>{children}</> : null;
}
