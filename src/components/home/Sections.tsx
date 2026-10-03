import Link from "next/link";
import { clubStats } from "@/data/club-stats";
import { copy } from "@/data/copy";
import { partnersOf } from "@/data/partners";
import { speakers } from "@/data/speakers";
import { team } from "@/data/team";
import { voices } from "@/data/voices";
import { ContactLedger } from "@/components/ui/ContactLedger";
import { PartnerGrid } from "@/components/ui/PartnerGrid";
import { Section } from "@/components/ui/Section";
import { Body, H3, Label, Lede } from "@/components/ui/Type";
import { Button } from "@/components/ui/Button";

// Data-gated sections: each renders nothing until the club supplies the data that unlocks it (docs/CONTENT-GAPS.md). The page checks `has*` so
// section numbers stay sequential.
export const hasClubStats = clubStats.length > 0;
export const hasTeam = team.some((m) => m.group !== "Faculty");
export const hasSpeakers = speakers.length > 0;
export const hasVoices = voices.length > 0;
export const hasClubPartners = partnersOf("club").length > 0;

/** One ledger row of club-wide proof numbers, each with its source. Never the competition's figures. */
export function ClubNumbers({ number }: { number: string }) {
  return (
    <Section id="numbers" number={number} title="In numbers" heading="The club in numbers">
      <dl className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
        {clubStats.map((s) => (
          <div key={s.label} className="border-b border-line py-6 pr-6 last:border-b-0 lg:border-b-0">
            <dt><Label>{s.label}</Label></dt>
            <dd className="m-0"><p className="t-stat tabular mt-2">{s.value}</p><Label className="mt-2 normal-case tracking-normal">Source: {s.source}</Label></dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/** A short roster (names and public roles only) and a link to the full team page. */
export function TeamTeaser({ number }: { number: string }) {
  const core = team.filter((m) => m.group === "Core").slice(0, 6);
  if (core.length === 0) return null;
  return (
    <Section id="team" number={number} title="Team" heading="Who runs it" tone="paper">
      <ul className="grid border-b border-line sm:grid-cols-2">
        {core.map((m) => <li key={m.name} className="rule-draw py-4 sm:pr-6"><H3>{m.name}</H3><Label className="mt-1 block">{m.role}</Label></li>)}
      </ul>
      <div className="mt-8"><Button href="/team" variant="link">Meet the team →</Button></div>
    </Section>
  );
}

export function Speakers({ number }: { number: string }) {
  return (
    <Section id="speakers" number={number} title="Speakers" heading={copy.speakers.title}>
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {speakers.map((s) => (
          <li key={s.name}>
            {s.photo && s.photoConsent && <img src={s.photo} alt="" width={400} height={500} loading="lazy" decoding="async" className="mb-4 aspect-[4/5] w-full rounded-[2px] object-cover" />}
            <H3>{s.name}</H3><Body className="mt-1">{s.title}</Body><Label className="mt-2">{s.event}</Label>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Voices({ number }: { number: string }) {
  return (
    <Section id="voices" number={number} title="Voices" heading={copy.voices.title} tone="paper">
      <ul className="grid gap-12 md:grid-cols-2">
        {voices.map((v) => <li key={v.who}><Lede>“{v.quote}”</Lede><Label className="mt-4">{v.who}</Label></li>)}
      </ul>
    </Section>
  );
}

/** Club-wide sponsors and partners only (scope `club`). Partners of the featured competition are inside its own block. */
export function ClubPartners({ number }: { number: string }) {
  return (
    <Section id="partners" number={number} title="Partners" heading="Who stands with the club">
      <PartnerGrid list={partnersOf("club")} />
      <p className="t-ui mt-8 max-w-[62ch] text-body">
        Names are trademarks of their respective owners; appearing here does not imply endorsement, partnership or sponsorship unless explicitly stated. See the <Link href="/disclaimer" className="underline underline-offset-4 hover:text-fg">disclaimer</Link>.
      </p>
    </Section>
  );
}

const ROUTES = [
  { href: "/contact#join", label: "Join the club", note: "Tell us your branch and year" },
  { href: "/contact#contact", label: "Ask a question", note: "About an event or the club" },
  { href: "/contact#sponsor", label: "Partner with us", note: "Sponsors and collaborators" },
] as const;

/** Closing chapter: three doors into the contact page (two lead to the contact box, one to the sponsorship box) and the public contact points. */
export function JoinUs({ number }: { number: string }) {
  return (
    <Section id="join" number={number} title="Join" heading={copy.join.title} line={copy.join.line} tone="paper">
      <div className="grid gap-x-[clamp(32px,5vw,96px)] gap-y-10 lg:grid-cols-2">
        <ol className="border-b border-line self-start">
          {ROUTES.map((r, i) => (
            <li key={r.href}>
              <Link href={r.href} className="ledger-row rule-draw group grid min-h-24 grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-5">
                <Label className="tabular">{String(i + 1).padStart(2, "0")}</Label>
                <span><span className="t-h3 block">{r.label}</span><Label className="mt-1 block">{r.note}</Label></span>
                <span aria-hidden="true" className="t-h3 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1 motion-reduce:transition-none">→</span>
              </Link>
            </li>
          ))}
        </ol>
        <ContactLedger />
      </div>
    </Section>
  );
}
