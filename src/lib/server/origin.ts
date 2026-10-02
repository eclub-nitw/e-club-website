import { site } from "@/data/site";

// Browsers always send Origin on a cross-site POST, so refusing every origin that is not ours is the CSRF defence. Ours means exactly:
// the configured site (apex and www), the legacy vercel.app address (kept alive for links already shared), and this deployment's own
// preview hosts. The request's Host header is deliberately NOT trusted: a forged Host must not be able to vouch for a foreign Origin.
const LEGACY_HOST = "e-club-nitw.vercel.app";

function allowedHosts(): Set<string> {
  const site_ = new URL(site.url).host;
  const hosts = new Set([site_, site_.startsWith("www.") ? site_.slice(4) : `www.${site_}`, LEGACY_HOST]);
  for (const own of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) if (own) hosts.add(own);
  if (process.env.ALLOW_TEST_ENDPOINTS === "1") for (const p of [3101, 3102, 3103, 3104]) hosts.add(`localhost:${p}`);
  if (process.env.NODE_ENV !== "production") hosts.add(`localhost:${process.env.PORT ?? 3000}`);
  return hosts;
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false; // our own form always sends it
  try { return allowedHosts().has(new URL(origin).host); } catch { return false; }
}
