import type { ReactNode } from "react";

// Renders the small Markdown subset used in content/legal/*.md (#, ##, >, -, 1., **bold**, [text](url))
// as React elements. Nothing is injected as HTML, and link targets are restricted to safe schemes.
const SAFE_HREF = /^(https?:\/\/|mailto:|\/)/;

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link && SAFE_HREF.test(link[2])) return <a key={i} href={link[2]} className="text-link underline underline-offset-4">{link[1]}</a>;
    return part;
  });
}

export function LegalDoc({ source }: { source: string }) {
  const out: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    out.push(<Tag key={out.length} className={`my-5 space-y-3 pl-6 ${list.ordered ? "list-decimal" : "list-disc"}`}>{list.items.map((t, i) => <li key={i}>{inline(t)}</li>)}</Tag>);
    list = null;
  };

  for (const raw of source.split("\n")) {
    const line = raw.trimEnd();
    const ol = /^\d+\.\s+(.*)/.exec(line), ul = /^-\s+(.*)/.exec(line);
    if (ol || ul) {
      const ordered = !!ol;
      if (list && list.ordered !== ordered) flush();
      list ??= { ordered, items: [] };
      list.items.push((ol ?? ul)![1]);
      continue;
    }
    flush();
    if (!line.trim() || /^# /.test(line)) continue; // the page's h1 comes from PageHeader
    if (line.startsWith("## ")) out.push(<h2 key={out.length} className="mt-12 border-t border-line pt-4 font-display text-2xl font-semibold md:text-3xl">{line.slice(3)}</h2>);
    else if (line.startsWith("> ")) out.push(<p key={out.length} className="my-6 border-l-2 border-accent pl-4 font-mono text-sm text-muted">{inline(line.slice(2))}</p>);
    else out.push(<p key={out.length} className="my-4">{inline(line)}</p>);
  }
  flush();
  return <div className="max-w-[68ch] text-base leading-[1.7]">{out}</div>;
}
