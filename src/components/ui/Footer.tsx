import Link from "next/link";
import { site } from "@/data/site";
import { legalPages } from "@/lib/legal";
import { ArrowButton } from "./ArrowButton";
import { BrandLockup, InstituteMark } from "./ClubMark";
import { Container } from "./Container";
import { InstagramIcon, LinkedInIcon, MailIcon } from "./ContactIcons";
import { Label } from "./Type";

const quick = [["/", "Home"], ["/about", "About"], ["/initiatives", "Initiatives"], ["/team", "Team"], ["/sponsors", "Sponsors"], ["/gallery", "Gallery"], ["/contact", "Contact"]] as const;

const linkCls = "t-ui inline-flex min-h-11 items-center whitespace-nowrap text-body underline-offset-4 hover:text-fg hover:underline";

// Email, Instagram and LinkedIn only: no personal phone numbers, ever.
const contacts = [
  { label: site.email, href: `mailto:${site.email}`, icon: <MailIcon />, external: false },
  { label: "@eclubnitw", href: site.instagram, icon: <InstagramIcon />, external: true },
  { label: "Entrepreneurship Club-NIT Warangal", href: site.linkedin, icon: <LinkedInIcon />, external: true },
] as const;

/** The last slide: the club's line, the lockup, pages, the three contact points on one line each, legal links. Partners live on /sponsors, not here. */
export function Footer() {
  return (
    <footer className="bg-club-ink text-club-paper">
      <Container className="pb-24 pt-[var(--section-y)]">
        <p className="t-lede-xl max-w-[18ch]">{site.quote.line}</p>
        <div className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-[1.1fr_1fr_1.4fr]">
          <BrandLockup />
          <nav aria-label="Footer">
            <Label as="h2">Pages</Label>
            <ul className="mt-3 grid grid-cols-2 gap-x-6">{quick.map(([href, label]) => <li key={href}><Link href={href} className={linkCls}>{label}</Link></li>)}</ul>
          </nav>
          <div>
            <Label as="h2">Get in touch</Label>
            <ul className="mt-3">
              {contacts.map((c) => (
                <li key={c.href}>
                  <a href={c.href} {...(c.external && { target: "_blank", rel: "noopener noreferrer" })} className={`${linkCls} gap-3`}>
                    {c.icon}<span className="max-md:whitespace-normal">{c.label}</span>
                    {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {site.showInstituteLogo && <div className="mt-14 flex justify-end border-t border-line pt-6"><InstituteMark /></div>}

        <div className="t-ui mt-6 flex flex-col gap-4 border-t border-line pt-6 text-muted md:flex-row md:items-center md:justify-between">
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
