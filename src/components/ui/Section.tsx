import { Container } from "./Container";
import { MaskedText } from "./MaskedText";
import { H2, Label } from "./Type";

/**
 * One chapter of the page (the site scrolls like a pitch deck). Header = mono numeral + title on a hairline, then one sentence-case
 * headline. Paper re-maps the semantic tokens via `.tone-paper`. `data-section` feeds the nav's "04 / 09" counter.
 * `bare` skips the container and header for chapters that lay themselves out (cover, flagship stage).
 */
export function Section({
  id, number, title, heading, tone = "ink", children, className = "", bare = false,
}: {
  id: string;
  number: string;
  title: string;
  heading?: string;
  tone?: "ink" | "paper";
  children: React.ReactNode;
  className?: string;
  bare?: boolean;
}) {
  return (
    <section id={id} data-section={`${number} — ${title}`} aria-labelledby={heading ? `${id}-h` : undefined} aria-label={heading ? undefined : title}
      className={`${tone === "paper" ? "tone-paper" : "bg-bg text-fg"} relative ${bare ? "" : "py-20 md:py-32"} ${className}`}>
      {bare ? children : (
        <Container>
          <header className="mb-12 md:mb-16">
            <Label className="border-t border-line pt-4">{number} — {title}</Label>
            {heading && (
              <H2 id={`${id}-h`} className="mt-6 max-w-[20ch]">
                <MaskedText text={heading} />
              </H2>
            )}
          </header>
          {children}
        </Container>
      )}
    </section>
  );
}
