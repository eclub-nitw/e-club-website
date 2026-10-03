import Image from "next/image";
import { about } from "@/data/about";
import { copy } from "@/data/copy";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { MaskedText } from "@/components/ui/MaskedText";
import { Section } from "@/components/ui/Section";
import { Label } from "@/components/ui/Type";

const ROW = "rule-draw grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[8rem_1fr]";
const LINK = "t-body underline decoration-line decoration-2 underline-offset-4 hover:decoration-accent";

/**
 * Chapter "Who we are": paper. Left, one paragraph (its words rise through masks once) and the link to /about.
 * Right, a framed "At a glance" plate that always has content: the club's logo on a white tile (the institute's emblem never beside it: it sits in the
 * Institute row, `site.showInstituteLogo`) over ledger rows of verified facts. Both columns stretch to the same height from 1024px.
 */
export function About({ number }: { number: string }) {
  const nitw = site.logos.nitw, eclub = site.logos.eclub;
  return (
    <Section id="about" number={number} title="About" heading={copy.about.title} line={copy.about.line} tone="paper" className="isolate overflow-hidden">
      <p aria-hidden="true" data-word="WHO" className="t-ghost absolute -right-[0.04em] top-4 -z-10 text-club-ink" />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-stretch lg:gap-[clamp(40px,6vw,96px)]">
        <div className="flex flex-col gap-8">
          <p className="t-lede-xl max-w-[24ch]"><MaskedText text={copy.about.lede} /></p>
          <div><Button href="/about" variant="link">More about the club →</Button></div>
        </div>

        <aside aria-labelledby="glance-h" className="w-full border border-line">
          <div className="flex items-center gap-4 border-b border-line p-5">
            <div className="flex h-36 min-w-28 flex-1 items-center justify-center gap-8 rounded-[2px] bg-white p-4 sm:h-40">
              <Image src={eclub.src} alt={eclub.alt} width={eclub.w} height={eclub.h} sizes="8rem" className="h-full w-auto object-contain" />
            </div>
            <Label as="h3" id="glance-h" className="self-start">{copy.about.glance}</Label>
          </div>
          <dl className="px-5">
            <div className={ROW}><dt><Label>Institute</Label></dt><dd className="t-body m-0 flex items-center gap-4">{site.showInstituteLogo && <span className="flex size-14 shrink-0 items-center justify-center rounded-[2px] bg-white p-1.5"><Image src={nitw.src} alt={nitw.alt} width={nitw.w} height={nitw.h} sizes="3.5rem" className="h-full w-auto object-contain" /></span>}<span>NIT Warangal, {site.address.locality}, {site.address.region}</span></dd></div>
            {about.facultyCoordinator && <div className={ROW}><dt><Label>Faculty mentor</Label></dt><dd className="t-body m-0">{about.facultyCoordinator}</dd></div>}
            <div className={ROW}><dt><Label>Reach us</Label></dt><dd className="m-0"><a href={`mailto:${site.email}`} className={LINK}>{site.email}</a></dd></div>
            <div className={`${ROW} border-b border-line`}>
              <dt><Label>Follow</Label></dt>
              <dd className="m-0 flex flex-wrap gap-x-6 gap-y-1">
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={`${LINK} inline-flex min-h-11 items-center`}>Instagram @eclubnitw<span className="sr-only"> (opens in a new tab)</span></a>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={`${LINK} inline-flex min-h-11 items-center`}>LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </Section>
  );
}
