import Link from "next/link";
import { site } from "@/data/site";
import { legalPages } from "@/lib/legal";
import { Container } from "./Container";

const cols = [
  { title: "Explore", links: [["/about", "About"], ["/events", "Events"], ["/gallery", "Gallery"], ["/team", "Team"]] },
  { title: "Get involved", links: [["/join", "Join the club"], ["/sponsors", "Partner with us"], ["/contact", "Contact"]] },
] as const;

const socials = [
  { label: "Instagram", href: site.instagram },
  { label: "LinkedIn", href: site.linkedin },
  { label: "YouTube", href: site.youtube },
].filter((s) => s.href);

const linkCls = "inline-flex min-h-11 items-center text-fg/90 underline-offset-4 hover:text-fg hover:underline";

export function Footer() {
  return (
    <footer className="bg-club-ink text-club-paper">
      <Container className="py-16 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-4xl font-semibold leading-none tracking-tight md:text-5xl">E-Club</p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.08em] text-club-mist">Entrepreneurship Club · NIT Warangal</p>
            <a href={`mailto:${site.email}`} className="mt-8 inline-flex min-h-11 items-center break-all text-lg underline decoration-club-gold decoration-2 underline-offset-8 hover:no-underline">{site.email}</a>
          </div>
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-club-mist">{c.title}</h2>
              <ul className="mt-3">{c.links.map(([href, label]) => <li key={href}><Link href={href} className={linkCls}>{label}</Link></li>)}</ul>
            </nav>
          ))}
          <nav aria-label="Social">
            <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-club-mist">Follow</h2>
            <ul className="mt-3">
              {socials.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>{s.label}<span className="sr-only"> (opens in a new tab)</span></a></li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-club-paper/15 pt-6 text-sm text-club-mist md:flex-row md:items-center md:justify-between">
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5">
              {Object.entries(legalPages).map(([slug, p]) => <li key={slug}><Link href={`/${slug}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:text-club-paper hover:underline">{p.title}</Link></li>)}
            </ul>
          </nav>
          <p>© {new Date().getFullYear()} {site.name}. Made by the E-Club tech team.</p>
        </div>
      </Container>
    </footer>
  );
}
