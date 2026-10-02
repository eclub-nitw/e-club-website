import { createHash } from "node:crypto";

// Best-effort limiter held in the memory of one server instance (serverless instances do not share it). It stops casual floods; the
// honeypot, strict validation, the same-origin check and the body cap do the rest. For hard guarantees put the host's WAF in front.
const hits = new Map<string, number[]>();
const PER_CLIENT = { max: 5, windowMs: 10 * 60_000 };
const GLOBAL = { max: 120, windowMs: 60 * 60_000 };
const MAX_KEYS = 5000;

const take = (key: string, max: number, windowMs: number, now: number) => {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) { hits.set(key, recent); return Math.ceil((windowMs - (now - recent[0])) / 1000); }
  recent.push(now); hits.set(key, recent);
  return 0;
};

/** Returns 0 if allowed, otherwise the number of seconds to wait. The client address is hashed first and never stored anywhere. */
export function limit(clientAddress: string, now = Date.now()): number {
  if (hits.size > MAX_KEYS) for (const k of hits.keys()) { if (hits.size <= MAX_KEYS / 2) break; hits.delete(k); }
  const key = createHash("sha256").update(`client:${clientAddress}`).digest("hex").slice(0, 24);
  const wait = take(key, PER_CLIENT.max, PER_CLIENT.windowMs, now);
  return wait > 0 ? wait : take("global", GLOBAL.max, GLOBAL.windowMs, now);
}
