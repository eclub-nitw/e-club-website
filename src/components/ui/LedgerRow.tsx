/** A label/value row inside a <dl>: mono label, plain value, hairline above. */
export function LedgerRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-t border-line py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <dt className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{label}</dt>
      <dd className="text-base leading-relaxed">{children}</dd>
    </div>
  );
}
