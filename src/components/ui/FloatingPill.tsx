"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNow } from "@/lib/hooks";
import { pillState } from "@/lib/register-state";

const left = (ms: number) => {
  const d = Math.floor(ms / 86_400_000), h = Math.floor((ms % 86_400_000) / 3_600_000);
  return d > 0 ? `${d}d ${h}h left to register` : `${h}h left to register`;
};

/** Bottom-right status pill whose wording follows today's date against the Unstop timeline (lib/register-state.ts). Hidden on the Venture Vortex page and after the finale. */
export function FloatingPill() {
  const now = useNow();
  const pathname = usePathname();
  if (now === null || pathname.startsWith("/venture-vortex")) return null;
  const s = pillState(now);
  if (!s) return null;
  const cls = "pill-in nav-surface fixed bottom-4 right-4 z-40 flex min-h-11 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full px-4 py-2 text-fg";
  if (s.kind === "register") {
    return (
      <a href={s.href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:-translate-y-1 transition-transform duration-200 motion-reduce:transition-none`}>
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-accent" />
        <span className="t-ui">{s.label}</span>
        <span className="t-label hidden tabular text-muted sm:inline">{left(s.until - now)}</span>
        <span className="sr-only"> (opens in a new tab). {left(s.until - now)}</span>
      </a>
    );
  }
  return (
    <Link href="/venture-vortex" className={cls}>
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-club-cyan" />
      <span className="t-ui">{s.label}</span>
    </Link>
  );
}
