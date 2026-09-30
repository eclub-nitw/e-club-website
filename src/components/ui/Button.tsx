import Link from "next/link";
import { Magnetic } from "./Magnetic";

const base = "group relative isolate inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium transition-[color,transform] duration-300 active:scale-[.98] motion-reduce:transition-none";
const pill = "overflow-hidden rounded-[2px] border border-club-paper/25 bg-club-ink px-5 text-club-paper hover:text-club-ink focus-visible:text-club-ink";
const rule = "px-0 after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 after:ease-[var(--ease-out-expo)] before:absolute before:inset-x-0 before:bottom-2 before:h-px before:bg-line hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none";
const variants = {
  primary: pill,
  secondary: `${rule} text-fg`,
  link: `${rule} text-link`,
} as const;

type Props = { href: string; variant?: keyof typeof variants; className?: string; children: React.ReactNode };

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none">
      <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Internal paths use next/link; absolute URLs open safely in a new tab; mailto stays in-tab. */
export function Button({ href, variant = "primary", className = "", children }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const external = /^https?:/.test(href);
  const inner = (
    <>
      {variant === "primary" && <span aria-hidden="true" className="absolute inset-0 -z-10 -translate-x-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:transition-none" />}
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
      {variant === "primary" && <Arrow />}
    </>
  );
  const link = href.startsWith("/")
    ? <Link href={href} className={cls}>{inner}</Link>
    : <a href={href} className={cls} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>{inner}</a>;
  return variant === "primary" ? <Magnetic>{link}</Magnetic> : link;
}
