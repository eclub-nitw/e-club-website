import Link from "next/link";

export function Breadcrumbs({ trail }: { trail: { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="t-label text-muted">
      <ol className="flex flex-wrap items-center gap-x-2">
        {trail.map((t, i) => (
          <li key={t.name} className="flex items-center gap-2">
            {t.path ? <Link href={t.path} className="inline-flex min-h-11 items-center underline-offset-4 hover:text-fg hover:underline">{t.name}</Link> : <span aria-current="page" className="text-fg">{t.name}</span>}
            {i < trail.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
