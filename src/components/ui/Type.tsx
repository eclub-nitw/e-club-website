import type { ElementType, HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & { as?: ElementType };

function Voice({ base, tag = "p", as, className = "", ...rest }: Props & { base: string; tag?: ElementType }) {
  const Tag = (as ?? tag) as ElementType<HTMLAttributes<HTMLElement>>;
  return <Tag className={`${base} ${className}`.trim()} {...rest} />;
}
function make(base: string, tag: ElementType) {
  const Component = (props: Props) => <Voice base={base} tag={tag} {...props} />;
  Component.displayName = `Voice(${base})`;
  return Component;
}

/** Impact voice: wordmark, giant numerals, one hero stat. Max one per viewport. Never a paragraph. */
export const Display = make("t-impact", "p");
/** Headline voice: sentence case. Exactly one H1 per page. */
export const H1 = make("t-h1", "h1");
export const H2 = make("t-h2", "h2");
export const H3 = make("t-h3", "h3");
/** Serif roman: pull-quotes, chapter ledes, the closing line. */
export const Lede = make("t-lede", "p");
export const Body = make("t-body", "p");
/** Mono label: chapter numbers, captions, metadata. Muted by default (mist on ink); pass a text-* class to recolour. */
export function Label({ className = "", ...rest }: Props) {
  return <Voice base={/text-/.test(className) ? "t-label" : "t-label text-muted"} className={className} {...rest} />;
}
