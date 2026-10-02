import { registerUrl, registration, round1Result, rounds, unstopPageUrl } from "../data/timeline";

// The one place that decides what every date-driven surface says (pill, nav, hero CTA, ticker, countdown, Venture Vortex page).
// All boundaries come from data/timeline.ts and are IST instants, so the answer never depends on the visitor's timezone.
const [r1, r2, r3] = rounds;
const at = (s: string) => new Date(s).getTime();
const TZ = "Asia/Kolkata";
const part = (ms: number, o: Intl.DateTimeFormatOptions) => new Date(ms).toLocaleString("en-IN", { ...o, timeZone: TZ });
const day = (s: string) => part(at(s), { day: "numeric", month: "short" }); // "9 Oct"
/** "9 Oct, 08:00 IST": one format wherever a cut-off time matters. */
export const dayTime = (s: string) => `${day(s)}, ${part(at(s), { hour: "2-digit", minute: "2-digit", hour12: false })} IST`;
const days = (a: string, b: string) => `${part(at(a), { day: "numeric" })}–${day(b)}`; // "30–31 Oct"

export type Phase = "pre" | "registration" | "submissions" | "pending" | "round2" | "between" | "round3" | "finished";

export function phaseAt(now: number): Phase {
  if (now < at(registration.start)) return "pre";
  if (now < at(registration.end)) return "registration";
  if (now < at(r1.end)) return "submissions";
  if (now < at(r2.start)) return "pending";
  if (now < at(r2.end)) return "round2";
  if (now < at(r3.start)) return "between";
  if (now < at(r3.end)) return "round3";
  return "finished";
}

export type Link = { label: string; href: string };
export type PhaseView = {
  pill: (Link & { tone: "register" | "info" }) | null; // floating pill; null = hidden
  action: Link | null;                                  // external call to action (Unstop); null = nothing to act on
  hero: Link;                                           // hero primary button when there is no action
  ticker: string;                                       // first ticker item
  countdown: { label: string; start: string; end: string };
};

const vortex = "/venture-vortex";
const unstopPage = unstopPageUrl;

export function viewOf(phase: Phase): PhaseView {
  const hero = { label: "Venture Vortex 2026", href: vortex };
  const finale = { start: r3.start, end: r3.end };
  switch (phase) {
    case "pre":
      return { pill: { tone: "info", label: `Registration opens ${day(registration.start)}`, href: vortex }, action: null, hero,
        ticker: `Venture Vortex 2026 · registration opens ${day(registration.start)}`, countdown: { label: "Registration opens", start: registration.start, end: registration.start } };
    case "registration":
      return { pill: { tone: "register", label: "Register on Unstop", href: registerUrl }, action: { label: "Register on Unstop", href: registerUrl }, hero,
        ticker: `Venture Vortex 2026 registration is live on Unstop, closes ${day(registration.end)}`, countdown: { label: `Registration closes ${day(registration.end)}`, start: registration.end, end: registration.end } };
    case "submissions":
      return { pill: { tone: "info", label: `Registration closed · Submissions open until ${dayTime(r1.end)}`, href: unstopPage }, action: { label: "Round 1 submissions on Unstop", href: unstopPage }, hero,
        ticker: `Registration closed · Round 1 submissions open until ${dayTime(r1.end)}`, countdown: { label: `Round 1 submissions close ${dayTime(r1.end)}`, start: r1.end, end: r1.end } };
    case "pending":
      return { pill: { tone: "info", label: `Round 1 closed · Round 2 opens ${day(r2.start)}`, href: vortex }, action: null, hero,
        ticker: `Round 1 closed · result ${day(round1Result)} · Round 2 opens ${day(r2.start)}`, countdown: { label: `Round 2 opens ${day(r2.start)}`, start: r2.start, end: r2.start } };
    case "round2":
      return { pill: { tone: "info", label: "Round 2 in progress", href: vortex }, action: null, hero,
        ticker: `Round 2 in progress · closes ${dayTime(r2.end)}`, countdown: { label: `Round 2 closes ${dayTime(r2.end)}`, start: r2.end, end: r2.end } };
    case "between":
      return { pill: { tone: "info", label: `Finale on campus, ${days(r3.start, r3.end)}`, href: vortex }, action: null, hero,
        ticker: `Round 2 closed · finale on campus, ${days(r3.start, r3.end)}`, countdown: { label: `Finale on campus · ${days(r3.start, r3.end)}`, ...finale } };
    case "round3":
      return { pill: { tone: "info", label: "Finale on campus", href: vortex }, action: null, hero,
        ticker: "Finale on campus at NIT Warangal", countdown: { label: "Finale on campus", ...finale } };
    case "finished":
      return { pill: null, action: null, hero, ticker: "Venture Vortex 2026 has concluded", countdown: { label: "Venture Vortex 2026", ...finale } };
  }
}

/** The phase right now, for server components (render/revalidate time). Browser code uses usePhase. */
export const currentPhase = () => phaseAt(Date.now());
