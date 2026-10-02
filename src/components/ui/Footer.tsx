import Link from "next/link";
import { site } from "@/data/site";
import { copy } from "@/data/copy";
import { sponsors } from "@/data/sponsors";
import { legalPages } from "@/lib/legal";
import { ArrowButton } from "./ArrowButton";
import { Container } from "./Container";
import { SponsorLogo } from "./SponsorLogo";
import { Label } from "./Type";

const quick = [["/", "Home"], ["/about", "About"], ["/initiatives", "Initiatives"], ["/team", "Team"], ["/sponsors", "Sponsors"], ["/gallery", "Gallery"], ["/contact", "Contact"]] as const;

// Three contact cards. Email, Instagram and LinkedIn only: no personal phone numbers, ever.
const cards = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, external: false },
  { label: "Instagram", value: "@eclubnitw", href: site.instagram, external: true },
  { label: "LinkedIn", value: "Entrepreneurship Club-NIT Warangal", href: site.linkedin, external: true },
] as const;

const linkCls = "t-ui inline-flex min-h-11 items-center whitespace-nowrap text-body underline-offset-4 hover:text-fg hover:underline";

/** The last slide: three contact cards, quick links, the partner block, legal links and one closing line. */
export function Footer() {
  const logos = sponsors.filter((s) => s.consent && s.logo);
  return (
    <footer className="bg-club-ink text-club-paper">
      <Container className="pb-24 pt-20 md:pt-28">
        <Label className="border-t border-line pt-4">Get in touch</Label>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <li key={c.label}>
              <a href={c.href} {...(c.external && { target: "_blank", rel: "noopener noreferrer" })} data-cursor="OPEN"
                className="group block min-h-32 rounded-[2px] border border-line p-5 transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <Label>{c.label}</Label>
                <span className="t-h3 mt-4 block break-words">{c.value}</span>
                {c.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-[1fr_1.4fr]">
          <nav aria-label="Footer">
            <Label as="h2">Pages</Label>
            <ul className="mt-3 grid grid-cols-2 gap-x-6">{quick.map(([href, label]) => <li key={href}><Link href={href} className={linkCls}>{label}</Link></li>)}</ul>
          </nav>
          <div>
            <Label as="h2">Backed by</Label>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">{sponsors.map((s) => <li key={s.name} className="t-ui py-2 text-body">{s.name}</li>)}</ul>
            {logos.length > 0 && <ul className="mt-3 flex flex-wrap items-center gap-x-8">{logos.map((s) => <li key={s.name}><SponsorLogo sponsor={s} /></li>)}</ul>}
            <p className="t-ui mt-3 text-muted">Names belong to their owners and imply no endorsement beyond what is stated. See the <Link href="/disclaimer" className="underline underline-offset-4 hover:text-club-paper">disclaimer</Link>.</p>
          </div>
        </div>

        <p className="t-lede mt-20 max-w-[28ch] md:mt-28">{copy.closing}</p>

        <div className="t-ui mt-14 flex flex-col gap-4 border-t border-line pt-6 text-muted md:flex-row md:items-center md:justify-between">
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
