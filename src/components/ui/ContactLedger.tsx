import { site } from "@/data/site";
import { CopyEmail } from "./CopyEmail";
import { InstagramIcon, LinkedInIcon, MailIcon } from "./ContactIcons";
import { Label } from "./Type";

const link = "t-h3 inline-flex min-h-11 items-center underline decoration-line decoration-2 underline-offset-8 hover:decoration-accent";

/** The club's three public contact points, each with its glyph beside it. Email, Instagram and LinkedIn only: no personal phone numbers, ever. */
export function ContactLedger() {
  return (
    <dl className="border-b border-line">
      <div className="rule-draw grid grid-cols-[1.25rem_1fr] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[1.25rem_8rem_1fr]">
        <MailIcon /><dt><Label>Email</Label></dt>
        <dd className="m-0 flex flex-wrap items-center gap-x-6 max-sm:col-start-2"><a href={`mailto:${site.email}`} className={link}>{site.email}</a><CopyEmail email={site.email} /></dd>
      </div>
      <div className="rule-draw grid grid-cols-[1.25rem_1fr] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[1.25rem_8rem_1fr]">
        <InstagramIcon /><dt><Label>Instagram</Label></dt>
        <dd className="m-0 max-sm:col-start-2"><a href={site.instagram} target="_blank" rel="noopener noreferrer" className={link}>@eclubnitw<span className="sr-only"> (opens in a new tab)</span></a></dd>
      </div>
      <div className="rule-draw grid grid-cols-[1.25rem_1fr] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[1.25rem_8rem_1fr]">
        <LinkedInIcon /><dt><Label>LinkedIn</Label></dt>
        <dd className="m-0 max-sm:col-start-2"><a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={link}>Entrepreneurship Club-NIT Warangal<span className="sr-only"> (opens in a new tab)</span></a></dd>
      </div>
    </dl>
  );
}
