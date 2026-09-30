import Link from "next/link";
import { site } from "@/data/site";
import { copy } from "@/data/copy";
import { legalPages } from "@/lib/legal";
import { sponsors } from "@/data/sponsors";
import { Container } from "./Container";
import { SponsorLogo } from "./SponsorLogo";
import { ArrowButton } from "./ArrowButton";

const cols = [
  { title: "Explore", links: [["/about", "About"], ["/events", "Events"], ["/gallery", "Gallery"], ["/team", "Team"]] },
  { title: "Get involved", links: [["/join", "Join the club"], ["/sponsors", "Partner with us"], ["/contact", "Contact"]] },
] as const;

const socials = [
  { label: "Instagram", href: site.instagram },
  { label: "LinkedIn", href: site.linkedin },
  { label: "YouTube", href: site.youtube },
].filter((s) => s.href);

const listed = sponsors.filter((s) => s.consent);

const linkCls = "inline-flex min-h-11 items-center whitespace-nowrap text-fg/90 underline-offset-4 hover:text-fg hover:underline";

export function Footer() {
  return (
    <footer className="bg-club-ink text-club-paper">
      <Container className="pb-10 pt-16 md:pt-28">
        <p className="h1-xl up max-w-[16ch] text-[clamp(2.75rem,8.5vw,8.5rem)]">{copy.closing[0]}</p>
        <div className="mt-16 md:mt-24" />
        {listed.length > 0 && (
          <div className="mb-16 border-y border-club-paper/15 py-8">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-club-mist">Backed by</p>
            <ul className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-2">
              {listed.map((s) => <li key={s.name}><SponsorLogo sponsor={s} /></li>)}
            </ul>
            <p className="mt-4 text-sm text-club-mist">
              Names and logos belong to their owners; see the <Link href="/disclaimer" className="underline underline-offset-4 hover:text-club-paper">disclaimer</Link>.
            </p>
          </div>
        )}
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="md:col-span-3 lg:col-span-1">
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.08em] text-club-mist">Entrepreneurship Club · NIT Warangal</p>
            <a href={`mailto:${site.email}`} className="mt-4 inline-flex min-h-11 items-center break-all text-lg underline decoration-club-gold decoration-2 underline-offset-8 hover:no-underline">{site.email}</a>
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
          <div className="flex flex-wrap items-center gap-x-6">
            <p>© {new Date().getFullYear()} {site.name}. Made by the E-Club tech team.</p>
            <ArrowButton href="#main" label="Back to top" direction="up" />
          </div>
        </div>
      </Container>
      <div aria-hidden="true" className="mega mega-ghost -mb-[0.06em] select-none overflow-hidden whitespace-nowrap px-5 text-center text-[clamp(5rem,30vw,26rem)] md:px-10" />
    </footer>
  );
}
