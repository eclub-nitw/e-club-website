// Validation shared by the form (instant feedback) and the API route (the check that counts). Pure functions, no dependencies.
export const TYPES = ["join", "query", "contact", "sponsor"] as const;
export type Type = (typeof TYPES)[number];
export type Field = "name" | "email" | "message" | "branch" | "year" | "organisation" | "website" | "_";
export type ContactData = { type: Type; name: string; email: string; message: string; branch?: string; year?: string; organisation?: string; website?: string };
export const LIMITS = { name: 80, email: 254, message: 2000, branch: 60, year: 20, organisation: 120, website: 200 } as const;

/** The only fields each type may carry, on top of name, email and message. Anything else in a request is refused, not ignored. */
export const EXTRA: Record<Type, readonly Field[]> = { join: ["branch", "year"], query: [], contact: [], sponsor: ["organisation", "website"] };
const COMMON = ["type", "name", "email", "message", "company"]; // company is the honeypot

// Control characters other than tab and newline have no place in a name or a message.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\r\n?/g, "\n").replace(CONTROL, "").trim().slice(0, max + 1) : "");

export type Result = { ok: true; data: ContactData } | { ok: false; errors: Partial<Record<Field, string>> };

const EMAIL = /^[^\s@<>"',;:\\()[\]]+@[^\s@<>"',;:\\()[\]]+\.[^\s@<>"',;:\\()[\]]{2,}$/;
const isUrl = (s: string) => { try { return /^https?:$/.test(new URL(s).protocol); } catch { return false; } };

export function validateContact(v: Record<string, unknown>): Result {
  const type = TYPES.find((t) => t === v.type);
  if (!type) return { ok: false, errors: { _: "Choose what you are writing about." } };
  const errors: Partial<Record<Field, string>> = {};
  const allowed = new Set<string>([...COMMON, ...EXTRA[type]]);
  if (Object.keys(v).some((k) => !allowed.has(k))) return { ok: false, errors: { _: "Unexpected field." } };

  const name = clean(v.name, LIMITS.name), email = clean(v.email, LIMITS.email), message = clean(v.message, LIMITS.message);
  if (name.length < 2) errors.name = "Tell us your name.";
  else if (name.length > LIMITS.name) errors.name = `Keep your name under ${LIMITS.name} characters.`;
  if (!EMAIL.test(email) || email.length > LIMITS.email) errors.email = "Enter an email address we can reply to.";
  if (message.length < 10) errors.message = "A sentence or two, please (at least 10 characters).";
  else if (message.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters.`;

  const data: ContactData = { type, name, email, message };
  for (const f of EXTRA[type]) {
    const val = clean(v[f], LIMITS[f as keyof typeof LIMITS]);
    if (val.length > LIMITS[f as keyof typeof LIMITS]) errors[f] = `Keep this under ${LIMITS[f as keyof typeof LIMITS]} characters.`;
    else if (f === "organisation" && val.length < 2) errors.organisation = "Tell us which organisation you write for.";
    else if (f === "website" && val && !isUrl(val)) errors.website = "Enter a full address starting with https://";
    else if (val) data[f as "branch" | "year" | "organisation" | "website"] = val;
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
