import { Container } from "./Container";
import { MaskedText } from "./MaskedText";
import { H2, Label } from "./Type";

/**
 * One chapter of the page (the site scrolls like a pitch deck). Header = mono numeral + title on a hairline, then one sentence-case
 * headline. Paper re-maps the semantic tokens via `.tone-paper`. `data-section` feeds the nav's "04 / 09" counter.
 * `bare` skips the container and header for chapters that lay themselves out (cover, flagship stage).
 */
export function Section({
  id, number, title, heading, line, tone = "ink", children, className = "", bare = false, gapOk = false,
}: {
  id: string;
  number: string;
  title: string;
  heading?: string;
  line?: string;
  tone?: "ink" | "paper";
  children: React.ReactNode;
  className?: string;
  bare?: boolean;
  /** A section whose height is its own runway (the full-viewport cover): scripts/gap-audit.mjs reports it but does not fail it. */
  gapOk?: boolean;
}) {
  return (
    <section id={id} data-section={`${number} — ${title}`} data-gap-ok={gapOk || undefined} aria-labelledby={heading ? `${id}-h` : undefined} aria-label={heading ? undefined : title}
      className={`${tone === "paper" ? "tone-paper" : "bg-bg text-fg"} relative ${bare ? "" : "py-[var(--section-y)]"} ${className}`}>
      {bare ? children : (
        <Container>
          <header className="mb-[var(--head-gap)]">
            <Label className="border-t border-line pt-4">{number} — {title}</Label>
            {heading && (
              <H2 id={`${id}-h`} className="mt-6 max-w-[20ch]">
                <MaskedText text={heading} />
              </H2>
            )}
            {line && <p className="t-body mt-4">{line}</p>}
          </header>
          {children}
        </Container>
      )}
    </section>
  );
}
