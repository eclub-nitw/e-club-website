import { readFile } from "node:fs/promises";
import path from "node:path";

export const legalPages = {
  privacy: { file: "PRIVACY.md", title: "Privacy Policy" },
  terms: { file: "TERMS.md", title: "Terms of Use" },
  cookies: { file: "COOKIES.md", title: "Cookie Policy" },
  disclaimer: { file: "DISCLAIMER.md", title: "Disclaimer" },
  accessibility: { file: "ACCESSIBILITY.md", title: "Accessibility Statement" },
} as const;

export type LegalSlug = keyof typeof legalPages;
export const isLegalSlug = (s: string): s is LegalSlug => Object.hasOwn(legalPages, s);

// Legal text is rendered verbatim and never edited here. The slug is checked against the
// fixed map above, so no user input ever reaches the filesystem path.
export const readLegal = (slug: LegalSlug) =>
  readFile(path.join(process.cwd(), "content", "legal", legalPages[slug].file), "utf8");
