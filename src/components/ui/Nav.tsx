"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

const FLAGSHIP = { href: "/events/venture-vortex-2026", label: "Venture Vortex 2026" };

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" aria-label="E-Club NITW, home" className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap font-display font-semibold tracking-tight">
      <span className={small ? "text-base" : "text-lg"}>E-Club</span>
      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">NITW</span>
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const [seen, setSeen] = useState({ path: "", label: "" });
  const section = seen.path === pathname ? seen.label : "";

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; setScrolled(window.scrollY > 96); });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, []);

  // Section-aware state: the pill names the numbered section nearest the top of the viewport.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("main [data-section]");
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setSeen({ path: pathname, label: (e.target as HTMLElement).dataset.section ?? "" });
    }, { rootMargin: "-30% 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const openMenu = () => { document.documentElement.classList.add("lenis-stopped"); drawer.current?.showModal(); };
  const closeMenu = () => drawer.current?.close();

  const current = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkCls = (href: string) =>
    `inline-flex min-h-11 items-center px-3 text-sm transition-colors ${current(href) ? "text-fg underline decoration-accent decoration-2 underline-offset-[10px]" : "text-muted hover:text-fg"}`;
  const flagCls = "inline-flex min-h-11 items-center whitespace-nowrap rounded-[2px] bg-accent px-4 text-sm font-medium text-accent-fg transition duration-200 hover:-translate-y-0.5 hover:brightness-110 motion-reduce:hover:translate-y-0";
  const menuBtn = (
    <button type="button" onClick={openMenu} aria-haspopup="dialog" className="inline-flex min-h-11 min-w-11 items-center justify-center text-fg md:hidden">
      <span className="sr-only">Open menu</span>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 14h14" stroke="currentColor" strokeWidth="1.5" /></svg>
    </button>
  );

  return (
    <>
      <a href="#main" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-[2px] bg-accent px-4 py-3 font-mono text-xs uppercase tracking-[0.08em] text-accent-fg focus:translate-y-0">Skip to content</a>

      {/* Full bar at the top of the page */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-opacity duration-300 ${scrolled ? "invisible opacity-0" : "opacity-100"}`}>
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between border-b border-line px-5 text-fg md:px-10">
          <Wordmark />
          <nav aria-label="Primary" className="hidden items-center md:flex">
            <ul className="flex items-center">{NAV_LINKS.map((l) => <li key={l.href}><Link href={l.href} className={linkCls(l.href)} aria-current={current(l.href) ? "page" : undefined}>{l.label}</Link></li>)}</ul>
            <Link href={FLAGSHIP.href} className={`${flagCls} ml-4 max-lg:hidden`}>{FLAGSHIP.label}</Link>
          </nav>
          {menuBtn}
        </div>
      </header>

      {/* Floating pill after scroll: the site's one glass surface, floating over moving content */}
      <div className={`fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition duration-300 ${scrolled ? "opacity-100" : "invisible -translate-y-3 opacity-0"}`}>
        <nav aria-label="Primary (compact)" className="flex items-center gap-1 rounded-full border border-line bg-surface/75 pl-4 pr-1.5 text-fg shadow-[0_8px_30px_rgb(0_0_0/0.35)] backdrop-blur-md">
          <Wordmark small />
          {section && <span aria-hidden="true" className="ml-1 hidden max-w-[22ch] truncate border-l border-line pl-3 font-mono text-[10px] uppercase tracking-[0.08em] text-muted xl:inline">{section}</span>}
          <ul className="ml-2 hidden items-center lg:flex">{NAV_LINKS.filter((l) => l.href !== "/").map((l) => <li key={l.href}><Link href={l.href} className={linkCls(l.href)} aria-current={current(l.href) ? "page" : undefined}>{l.label}</Link></li>)}</ul>
          <Link href={FLAGSHIP.href} className={`${flagCls} ml-1 rounded-full max-sm:hidden`}>{FLAGSHIP.label}</Link>
          {menuBtn}
        </nav>
      </div>

      <dialog
        ref={drawer}
        aria-label="Menu"
        onClose={() => document.documentElement.classList.remove("lenis-stopped")}
        className="menu m-0 h-full max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-transparent"
      >
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
                  <Link href={l.href} onClick={closeMenu} aria-current={current(l.href) ? "page" : undefined} className={`flex min-h-16 items-baseline gap-4 py-3 font-display text-4xl font-semibold tracking-tight ${current(l.href) ? "text-link" : ""}`}>
                    <span className="font-mono text-xs font-normal text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mask-word" style={{ "--i": i } as React.CSSProperties}><span>{l.label}</span></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="py-6">
            <Link href={FLAGSHIP.href} onClick={closeMenu} className={`${flagCls} w-full`}>{FLAGSHIP.label}</Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
