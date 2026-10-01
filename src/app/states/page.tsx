import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Container } from "@/components/ui/Container";
import { Body, Display, H1, H2, H3, Label, Lede } from "@/components/ui/Type";

export const metadata: Metadata = { title: "States sheet", robots: { index: false, follow: false } };

const field = "t-body min-h-14 w-full rounded-[2px] border bg-transparent px-4";

/**
 * QA only (build with SHOW_STATES=1): every voice and every interactive state of the core components on one page, so each state can be
 * screenshotted. Hover/focus/active are forced with the `data-force` classes defined below. Returns 404 in a normal production build.
 */
export default function StatesPage() {
  if (process.env.SHOW_STATES !== "1") notFound();
  return (
    <div className="bg-bg pb-32 pt-40 text-fg">
      <style>{`
        [data-force="hover"] { transform: translateY(-2px); border-color: var(--accent) !important; }
        [data-force="focus"] { outline: 2px solid var(--accent); outline-offset: 3px; }
        [data-force="active"] { transform: scale(.98); }
      `}</style>
      <Container className="space-y-16">
        <section aria-label="Type voices" className="space-y-6">
          <Label>Voices</Label>
          <Display>Impact</Display>
          <H1>Headline one</H1><H2>Headline two</H2><H3>Headline three</H3>
          <Lede>Lede, serif roman, for pull-quotes and chapter ledes.</Lede>
          <Body>Body copy in Instrument Sans at 17 to 19 pixels with a 62 character measure, set in the body colour on ink.</Body>
          <Label>Label, mono, uppercase</Label>
        </section>

        <section aria-label="Buttons" className="space-y-6">
          <Label>Buttons, sizes L / M / S</Label>
          <div className="flex flex-wrap items-center gap-6"><Button href="/" size="L">Large</Button><Button href="/">Medium</Button><Button href="/" size="S">Small</Button></div>
          <Label>Primary: rest / hover / focus-visible / active / disabled</Label>
          <div className="flex flex-wrap items-center gap-6">
            <Button href="/">Rest</Button>
            <span data-force="hover" className="inline-block"><Button href="/">Hover</Button></span>
            <span data-force="focus" className="inline-block"><Button href="/">Focus</Button></span>
            <span data-force="active" className="inline-block"><Button href="/">Active</Button></span>
            <button type="button" disabled className="t-ui min-h-11 rounded-[2px] border border-line px-5 opacity-50">Disabled</button>
            <button type="button" disabled className="t-ui min-h-11 cursor-wait rounded-[2px] border border-line px-5 opacity-60">Loading…</button>
          </div>
          <Label>Secondary and link</Label>
          <div className="flex flex-wrap items-center gap-8"><Button href="/" variant="secondary">Secondary</Button><Button href="/" variant="link">Link →</Button><ArrowButton href="/" label="Arrow button" /><span data-force="hover" className="inline-block"><ArrowButton href="/" label="Arrow hover" /></span><span data-force="focus" className="inline-block"><ArrowButton href="/" label="Arrow focus" /></span></div>
        </section>

        <section aria-label="Form fields" className="grid max-w-3xl gap-6 sm:grid-cols-2">
          <Label className="sm:col-span-2">Fields: rest / hover / focus / error / disabled</Label>
          <input aria-label="Rest" placeholder="Rest" className={`${field} border-line`} />
          <input aria-label="Hover" placeholder="Hover" data-force="hover" className={`${field} border-line`} />
          <input aria-label="Focus" placeholder="Focus" data-force="focus" className={`${field} border-accent`} />
          <div><input aria-label="Error" aria-invalid="true" placeholder="Error" className={`${field} border-accent-text`} /><p className="t-ui mt-2 text-accent-text">Enter an email address we can reply to.</p></div>
          <input aria-label="Disabled" placeholder="Disabled" disabled className={`${field} border-line opacity-50`} />
        </section>
      </Container>
    </div>
  );
}
