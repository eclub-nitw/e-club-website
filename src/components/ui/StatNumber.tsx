/** A verified number with its source footnote. Rendering a stat without a source is not allowed. */
export function StatNumber({ value, label, source }: { value: string; label: string; source: string }) {
  return (
    <div className="border-t border-line pt-4">
      <p className="tabular font-display text-5xl font-semibold leading-none tracking-tight md:text-6xl">{value}</p>
      <p className="mt-3 text-base">{label}</p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">Source: {source}</p>
    </div>
  );
}
