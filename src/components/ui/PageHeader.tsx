import { Container } from "./Container";
import { MaskedText } from "./MaskedText";

/** Top of every inner page: mono label, the page's single h1, and a lede. Clears the fixed nav. */
export function PageHeader({ number, label, title, lede, tone = "ink", children }: {
  number: string; label: string; title: string; lede?: string; tone?: "ink" | "paper"; children?: React.ReactNode;
}) {
  return (
    <div className={`${tone === "paper" ? "tone-paper" : "bg-bg text-fg"} pb-14 pt-32 md:pb-20 md:pt-44`}>
      <Container>
        {children}
        <p className="mt-6 border-t border-line pt-4 font-mono text-xs uppercase tracking-[0.08em] text-muted">{number} — {label}</p>
        <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-[0.98] tracking-tight">
          <MaskedText text={title} immediate />
        </h1>
        {lede && <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-muted md:text-xl">{lede}</p>}
      </Container>
    </div>
  );
}
