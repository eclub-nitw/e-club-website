/** A label/value row inside a <dl>: mono label, plain value, hairline above. */
export function LedgerRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-t border-line py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <dt className="t-label text-muted">{label}</dt>
      <dd className="t-body">{children}</dd>
    </div>
  );
}
