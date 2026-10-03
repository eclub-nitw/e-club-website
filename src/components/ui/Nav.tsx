"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { registerUrl } from "@/data/timeline";
import { useChapter, useNow } from "@/lib/hooks";
import { phaseAt } from "@/lib/phase";
import { ClubMark } from "./ClubMark";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/initiatives", label: "Initiatives" },
  { href: "/team", label: "Team" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

/** Register goes to Unstop while Round 1 is open; afterwards the pill points at the competition page. */
function Register({ open, cls, onClick }: { open: boolean; cls: string; onClick?: () => void }) {
  return open
    ? <a href={registerUrl} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls}>Register<span className="sr-only"> on Unstop (opens in a new tab)</span></a>
    : <Link href="/venture-vortex" onClick={onClick} className={cls}>Venture Vortex</Link>;
}

function Wordmark() {
  return (
    <Link href="/" className="t-wordmark inline-flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap">
      <ClubMark size={22} />
      <span>E-Club NITW</span>
      <span className="sr-only">, home</span>
    </Link>
  );
}

/**
 * One floating bar. Surface is ink at 90% with a blur, so nothing underneath is legible. It hides on scroll down and returns on
 * scroll up (and whenever focus is inside it). The counter reads the page's numbered chapters ("04 / 09"); a 2px rail shows progress.
 */
export function Nav() {
  const pathname = usePathname();
  const drawer = useRef<HTMLDialogElement>(null);
  const [hidden, setHidden] = useState(false);
  const here = useChapter(pathname);
  const now = useNow();
  const open = now !== null && phaseAt(now) === "registration";

  useEffect(() => {
    let last = window.scrollY, raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY, dy = y - last;
        if (Math.abs(dy) > 6) { setHidden(y > 140 && dy > 0); last = y; }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, []);

  const openMenu = () => { document.documentElement.classList.add("lenis-stopped"); drawer.current?.showModal(); };
  const closeMenu = () => drawer.current?.close();

  const current = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkCls = (href: string) =>
    `inline-flex min-h-11 items-center px-3 t-ui transition-colors ${current(href) ? "text-fg underline decoration-accent decoration-2 underline-offset-[10px]" : "text-muted hover:text-fg"}`;
  const flagCls = "inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-accent px-4 t-ui text-accent-fg transition duration-200 hover:-translate-y-0.5 hover:brightness-110 motion-reduce:hover:translate-y-0";

  return (
    <>
      <a href="#main" className="t-label fixed left-4 top-4 z-[100] -translate-y-24 rounded-[2px] bg-accent px-4 py-3 text-accent-fg focus:translate-y-0">Skip to content</a>

      <header data-hidden={hidden} className="nav-wrap fixed inset-x-0 top-3 z-50 flex justify-center px-3">
        <nav aria-label="Primary" className="nav-surface flex w-full max-w-[1100px] items-center justify-between gap-2 rounded-full py-1 pl-5 pr-1.5 text-fg">
          <Wordmark />
          {here && here.total > 1 && (
            <p aria-hidden="true" className="t-label tabular ml-1 flex min-w-0 items-center gap-3 border-l border-line pl-3 text-muted">
              <span className="text-fg">{pad(here.index + 1)} / {pad(here.total)}</span>
            </p>
          )}
          <ul className="ml-auto hidden items-center lg:flex">{NAV_LINKS.map((l) => <li key={l.href}><Link href={l.href} className={linkCls(l.href)} aria-current={current(l.href) ? "page" : undefined}>{l.label}</Link></li>)}</ul>
          <Register open={open} cls={`${flagCls} max-md:hidden`} />
          <button type="button" onClick={openMenu} aria-haspopup="dialog" className="ml-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-fg lg:hidden">
            <span className="sr-only">Open menu</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 14h14" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </nav>
      </header>

      <dialog ref={drawer} data-lenis-prevent aria-label="Menu" onClose={() => document.documentElement.classList.remove("lenis-stopped")}
        className="menu m-0 h-full max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-transparent">
        <div className="mx-auto flex h-full max-w-[1280px] flex-col px-5 py-2 md:px-10">
          <div className="flex h-16 items-center justify-between">
            <Wordmark />
            <button type="button" onClick={closeMenu} className="inline-flex min-h-11 min-w-11 items-center justify-center">
              <span className="sr-only">Close menu</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-6 flex-1 overflow-y-auto">
            <ul>
              {NAV_LINKS.map((l, i) => (
                <li key={l.href} className="border-t border-line last:border-b">
                  <Link href={l.href} onClick={closeMenu} aria-current={current(l.href) ? "page" : undefined} className={`t-h2 flex min-h-16 items-baseline gap-4 py-3 ${current(l.href) ? "text-link" : ""}`}>
                    <span className="t-label text-muted">{pad(i + 1)}</span>
                    <span className="mask-word" style={{ "--i": i } as React.CSSProperties}><span>{l.label}</span></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="py-6"><Register open={open} cls={`${flagCls} w-full justify-center`} onClick={() => drawer.current?.close()} /></div>
        </div>
      </dialog>
    </>
  );
}
