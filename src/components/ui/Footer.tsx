import Link from "next/link";
import { site } from "@/data/site";
import { copy } from "@/data/copy";
import { legalPages } from "@/lib/legal";
import { sponsors } from "@/data/sponsors";
import { Container } from "./Container";
import { SponsorLogo } from "./SponsorLogo";
import { ArrowButton } from "./ArrowButton";
import { Label } from "./Type";

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

const linkCls = "inline-flex min-h-11 items-center whitespace-nowrap text-body underline-offset-4 hover:text-fg hover:underline";

/** The last slide: one huge closing line in the serif voice, a "Thank you / Questions?" tag, then the working links. */
export function Footer() {
  return (
    <footer className="bg-club-ink text-club-paper">
      <Container className="pb-10 pt-20 md:pt-36">
        <Label className="border-t border-line pt-4">{copy.thanks}</Label>
        <p className="t-lede-xl mt-8 max-w-[16ch]">{copy.closing[0]}</p>
        <div className="mt-20 md:mt-28" />
        {listed.length > 0 && (
          <div className="mb-16 border-y border-line py-8">
            <Label>Backed by</Label>
            <ul className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-2">
              {listed.map((s) => <li key={s.name}><SponsorLogo sponsor={s} /></li>)}
            </ul>
            <p className="t-body mt-4 text-sm">
              Names and logos belong to their owners; see the <Link href="/disclaimer" className="underline underline-offset-4 hover:text-club-paper">disclaimer</Link>.
            </p>
          </div>
        )}
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="md:col-span-3 lg:col-span-1">
            <Label>Entrepreneurship Club · NIT Warangal</Label>
            <a href={`mailto:${site.email}`} className="mt-4 inline-flex min-h-11 items-center break-all text-lg underline decoration-accent decoration-2 underline-offset-8 hover:no-underline">{site.email}</a>
          </div>
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <Label as="h2">{c.title}</Label>
              <ul className="mt-3">{c.links.map(([href, label]) => <li key={href}><Link href={href} className={linkCls}>{label}</Link></li>)}</ul>
            </nav>
          ))}
          <nav aria-label="Social">
            <Label as="h2">Follow</Label>
            <ul className="mt-3">
              {socials.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>{s.label}<span className="sr-only"> (opens in a new tab)</span></a></li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
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
    </footer>
  );
}
