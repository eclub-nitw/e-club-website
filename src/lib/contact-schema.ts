// Validation shared by the form (instant feedback) and the API route (the check that counts). Pure functions, no dependencies.
export type Kind = "contact" | "join";
export type Field = "name" | "email" | "message" | "age";
export type ContactData = { kind: Kind; name: string; email: string; message: string };
export const LIMITS = { name: 80, email: 254, message: 2000 } as const;

// Control characters other than tab and newline have no place in a name or a message.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\r\n?/g, "\n").replace(CONTROL, "").trim().slice(0, max + 1) : "");

export type Result = { ok: true; data: ContactData } | { ok: false; errors: Partial<Record<Field, string>> };

const EMAIL = /^[^\s@<>"',;:\\()[\]]+@[^\s@<>"',;:\\()[\]]+\.[^\s@<>"',;:\\()[\]]{2,}$/;

export function validateContact(v: { kind?: unknown; name?: unknown; email?: unknown; message?: unknown; age?: unknown }): Result {
  const name = clean(v.name, LIMITS.name), email = clean(v.email, LIMITS.email), message = clean(v.message, LIMITS.message);
  const errors: Partial<Record<Field, string>> = {};
  if (name.length < 2) errors.name = "Tell us your name.";
  else if (name.length > LIMITS.name) errors.name = `Keep your name under ${LIMITS.name} characters.`;
  if (!EMAIL.test(email) || email.length > LIMITS.email) errors.email = "Enter an email address we can reply to.";
  if (message.length < 10) errors.message = "A sentence or two, please (at least 10 characters).";
  else if (message.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters.`;
  if (v.age !== true && v.age !== "on") errors.age = "Please confirm you are 18 or older.";
  const kind: Kind = v.kind === "join" ? "join" : "contact";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: { kind, name, email, message } };
}
