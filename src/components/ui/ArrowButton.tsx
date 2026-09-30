/** Square, arrow-only icon button (44px). `up` is a link to an in-page target, e.g. back to top. Label is for assistive tech and the tooltip. */
export function ArrowButton({ href, label, direction = "right" }: { href: string; label: string; direction?: "right" | "up" }) {
  const path = direction === "up" ? "M8 14V2M3 7l5-5 5 5" : "M2 8h12M9 3l5 5-5 5";
  return (
    <a href={href} title={label} className="group inline-flex size-11 items-center justify-center rounded-[2px] border border-line text-fg transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <span className="sr-only">{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d={path} stroke="currentColor" strokeWidth="1.5" /></svg>
    </a>
  );
}
