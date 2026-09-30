import Link from "next/link";

const base = "inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px] px-5 font-medium text-sm transition duration-200 ease-out hover:-translate-y-0.5 motion-reduce:hover:translate-y-0";
const variants = {
  primary: "bg-accent text-accent-fg hover:brightness-110",
  secondary: "border border-line text-fg hover:border-fg",
  link: "min-h-11 px-0 text-link underline decoration-1 underline-offset-4 hover:no-underline",
} as const;

type Props = { href: string; variant?: keyof typeof variants; className?: string; children: React.ReactNode };

/** Internal paths use next/link; absolute URLs open safely in a new tab; mailto stays in-tab. */
export function Button({ href, variant = "primary", className = "", children }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href.startsWith("/")) return <Link href={href} className={cls}>{children}</Link>;
  const external = /^https?:/.test(href);
  return (
    <a href={href} className={cls} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
      {children}{external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
