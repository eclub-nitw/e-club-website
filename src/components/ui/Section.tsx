import { Container } from "./Container";
import { MaskedText } from "./MaskedText";

/** Numbered ledger section on ink or paper. Paper re-maps the semantic tokens via `.tone-paper`. */
export function Section({
  id, number, title, tone = "ink", children, className = "",
}: {
  id: string;
  number?: string;
  title?: string;
  tone?: "ink" | "paper";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} data-section={title ? `${number ? `${number} — ` : ""}${title}` : undefined} aria-labelledby={title ? `${id}-h` : undefined} className={`${tone === "paper" ? "tone-paper" : "bg-bg text-fg"} py-20 md:py-28 ${className}`}>
      <Container>
        {(number || title) && (
          <header className="mb-10 border-t border-line pt-4 md:mb-14">
            {number && <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{number}{title ? ` — ${title}` : ""}</p>}
            {title && (
              <h2 id={`${id}-h`} className={`mt-4 max-w-[18ch] font-display text-[clamp(2.5rem,6.5vw,6rem)] font-extrabold leading-[0.95] tracking-[0.01em] ${tone === "ink" ? "uppercase" : ""}`}>
                <MaskedText text={title} />
              </h2>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
