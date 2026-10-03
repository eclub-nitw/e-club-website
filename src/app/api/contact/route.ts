import { validateContact } from "@/lib/contact-schema";
import { limit } from "@/lib/server/rate-limit";
import { isConfigured, saveSubmission } from "@/lib/server/store";
import { isAllowedOrigin } from "@/lib/server/origin";

export const dynamic = "force-dynamic";
const MAX_BODY = 8 * 1024;
const base = { "cache-control": "no-store", "x-content-type-options": "nosniff" };
const json = (body: object, status = 200, extra: Record<string, string> = {}) => Response.json(body, { status, headers: { ...base, ...extra } });

/**
 * The address of the client as seen by our own proxy. Vercel sets x-vercel-forwarded-for itself; failing that x-real-ip; failing that the LAST
 * x-forwarded-for entry (the one our nearest proxy appended). The first entry is client-supplied and trivially spoofed, so it is never used.
 */
function clientAddress(req: Request): string {
  const own = req.headers.get("x-vercel-forwarded-for") ?? req.headers.get("x-real-ip");
  if (own) return own.split(",")[0].trim();
  const xff = req.headers.get("x-forwarded-for")?.split(",");
  return xff?.[xff.length - 1]?.trim() || "unknown";
}

/**
 * POST /api/contact  { type: "join" | "query" | "contact" | "sponsor", name, email, message, company: "" } plus branch, year (join) or organisation, website (sponsor)
 * Any other field is refused (400). There is no age field: the 18+ checkbox was removed by the owner (docs/LEGAL-REVIEW-NOTES.md).
 * 200 stored · 400 invalid · 403 wrong origin · 413 too large · 415 wrong type · 429 slow down · 503 storage not configured or down
 * (the form then falls back to the visitor's own email app, so nothing is ever lost silently).
 */
export async function POST(req: Request) {
  if (!isAllowedOrigin(req.headers.get("origin"))) return json({ error: "forbidden" }, 403);
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) return json({ error: "unsupported" }, 415);
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return json({ error: "too_large" }, 413);

  const text = await req.text();
  if (Buffer.byteLength(text) > MAX_BODY) return json({ error: "too_large" }, 413);
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("shape");
    body = parsed as Record<string, unknown>;
  } catch { return json({ error: "bad_json" }, 400); }

  // Honeypot: a real visitor never sees this field. Answer like a success so bots learn nothing, and store nothing.
  if (typeof body.company === "string" && body.company !== "") return json({ ok: true });

  const wait = limit(clientAddress(req));
  if (wait > 0) return json({ error: "rate_limited" }, 429, { "retry-after": String(wait) });

  const result = validateContact(body);
  if (!result.ok) return json({ error: "invalid", fields: result.errors }, 400);

  if (!isConfigured()) return json({ error: "storage_unavailable" }, 503);
  try { await saveSubmission(result.data); } catch { return json({ error: "storage_unavailable" }, 503); } // nothing from the submission is logged
  return json({ ok: true });
}

export const GET = () => json({ error: "method_not_allowed" }, 405, { allow: "POST" });
