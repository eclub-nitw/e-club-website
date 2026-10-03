"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { registration } from "@/data/timeline";
import { useNow, useSpotlight } from "@/lib/hooks";
import { phaseAt, viewOf } from "@/lib/phase";

const left = (ms: number) => {
  const d = Math.floor(ms / 86_400_000), h = Math.floor((ms % 86_400_000) / 3_600_000);
  return d > 0 ? `${d}d ${h}h left to register` : `${h}h left to register`;
};

/** Bottom-right status pill whose wording follows today's date against the Unstop timeline (lib/register-state.ts). Hidden on the Venture Vortex page and after the finale. */
// Only where the spotlight is the subject or a natural neighbour: Home, Initiatives and its own page. Never on About, Team, Sponsors, Gallery or Contact.
const PILL_ROUTES = ["/", "/initiatives", "/venture-vortex"];

export function FloatingPill({ spotlightVisible }: { spotlightVisible: boolean }) {
  const now = useNow();
  const pathname = usePathname();
  const spot = useSpotlight(spotlightVisible);
  if (now === null || !spot || !PILL_ROUTES.includes(pathname) || pathname.startsWith("/venture-vortex")) return null;
  const s = viewOf(phaseAt(now)).pill;
  if (!s) return null;
  const cls = "pill-in nav-surface fixed bottom-4 right-4 z-40 flex min-h-11 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full px-4 py-2 text-fg";
  if (s.tone === "register") {
    const until = left(new Date(registration.end).getTime() - now);
    return (
      <a href={s.href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:-translate-y-1 transition-transform duration-200 motion-reduce:transition-none`}>
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-accent" />
        <span className="t-ui">{s.label}</span>
        <span className="t-label hidden tabular text-muted sm:inline">{until}</span>
        <span className="sr-only"> (opens in a new tab). {until}</span>
      </a>
    );
  }
  const external = /^https?:/.test(s.href);
  const dot = <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-club-cyan" />;
  return external ? (
    <a href={s.href} target="_blank" rel="noopener noreferrer" className={cls}>{dot}<span className="t-ui">{s.label}</span><span className="sr-only"> (opens in a new tab)</span></a>
  ) : (
    <Link href={s.href} className={cls}>{dot}<span className="t-ui">{s.label}</span></Link>
  );
}
