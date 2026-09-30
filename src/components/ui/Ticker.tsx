/** Decorative marquee. Each half repeats the items twice so a half is wider than a desktop viewport. CSS-only (transform), pauses on hover, static and wrapped under reduced motion. */
export function Ticker({ items }: { items: readonly string[] }) {
  const row = (dup: boolean) => [...items, ...items].map((t, i) => (
    <li key={i} className={`${dup || i >= items.length ? "ticker-dup " : ""}flex shrink-0 items-center gap-8 pr-8`}>
      <span className="font-display text-2xl font-medium tracking-tight md:text-4xl">{t}</span>
      <span aria-hidden="true" className="size-2 rotate-45 bg-accent" />
    </li>
  ));
  return (
    <div aria-hidden="true" className="ticker overflow-hidden border-y border-line bg-bg py-5 text-fg">
      <ul className="ticker-track flex w-max">{row(false)}{row(true)}</ul>
    </div>
  );
}
