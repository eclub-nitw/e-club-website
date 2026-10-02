import { registerUrl, registration, rounds } from "@/data/timeline";

const [r1, r2, r3] = rounds;
const at = (s: string) => new Date(s).getTime();

export type PillState =
  | { kind: "register"; label: string; until: number; href: string }
  | { kind: "info"; label: string }
  | null;

/** What the floating pill says right now, from the timeline in data/timeline.ts. Hidden once the finale is over. */
export function pillState(now: number): PillState {
  if (now < at(registration.end)) return { kind: "register", label: "Register on Unstop", until: at(registration.end), href: registerUrl };
  if (now < at(r1.end)) return { kind: "info", label: "Registration closed · Round 1 submissions until 9 Oct" };
  if (now < at(r2.start)) return { kind: "info", label: "Round 1 closed · Round 2 opens 11 Oct" };
  if (now < at(r2.end)) return { kind: "info", label: "Round 2 in progress" };
  if (now < at(r3.start)) return { kind: "info", label: "Finale on campus, 30–31 Oct" };
  if (now < at(r3.end)) return { kind: "info", label: "Finale on campus" };
  return null;
}

/** True while registration on Unstop is open (until the end of 3 Oct IST). Server pages call this at render/revalidate time. */
export const registerOpen = () => pillState(Date.now())?.kind === "register";
