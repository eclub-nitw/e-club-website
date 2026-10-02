import { createHash, timingSafeEqual } from "node:crypto";
import { isConfigured, purgeExpired } from "@/lib/server/store";

export const dynamic = "force-dynamic";
const headers = { "cache-control": "no-store", "x-content-type-options": "nosniff" };
const json = (body: object, status = 200) => Response.json(body, { status, headers });

// Hash first so the comparison is constant-time and does not reveal the secret's length either.
const digest = (s: string) => createHash("sha256").update(s).digest();
const same = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

/**
 * Daily retention job (vercel.json cron): deletes submissions older than 12 months.
 * Vercel sends `Authorization: Bearer $CRON_SECRET` itself when the CRON_SECRET env var is set; anything else is refused.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) return json({ error: "disabled" }, 503); // refuse to run without a strong secret
  if (!same(req.headers.get("authorization") ?? "", `Bearer ${secret}`)) return json({ error: "unauthorized" }, 401);
  if (!isConfigured()) return json({ error: "storage_unavailable" }, 503);
  try { return json({ deleted: await purgeExpired() }); } catch { return json({ error: "failed" }, 500); }
}
