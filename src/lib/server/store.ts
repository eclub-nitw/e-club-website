import { createSign } from "node:crypto";
import type { ContactData } from "@/lib/contact-schema";

// Writes one document per submission to Cloud Firestore through its REST API, authenticated as a service account (JWT bearer flow).
// No SDK, no dependency. Firestore security rules deny every client read and write (firestore.rules); only this server, holding the
// service account, can write. Nothing about the visitor except what they typed is stored: no IP address, no user agent.
// Env: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY (PEM, "\n" escapes allowed).
const SCOPE = "https://www.googleapis.com/auth/datastore";
const RETENTION_MS = 365 * 24 * 3600 * 1000; // expiresAt drives a Firestore TTL policy (see docs/BACKEND.md)

type Creds = { projectId: string; email: string; key: string };
const creds = (): Creds | null => {
  const projectId = process.env.FIREBASE_PROJECT_ID, email = process.env.FIREBASE_CLIENT_EMAIL, key = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  return projectId && email && key ? { projectId, email, key } : null;
};
export const isConfigured = () => creds() !== null;

// Test hooks, used by scripts/test-api.mjs against a mock server. Honoured only when ALLOW_TEST_ENDPOINTS=1, which no deployment sets.
const test = process.env.ALLOW_TEST_ENDPOINTS === "1";
const TOKEN_URL = (test && process.env.TEST_TOKEN_URL) || "https://oauth2.googleapis.com/token";
const FIRESTORE = (test && process.env.TEST_FIRESTORE_URL) || "https://firestore.googleapis.com";

const b64 = (v: object) => Buffer.from(JSON.stringify(v)).toString("base64url");
let cached: { token: string; exp: number } | null = null;

async function accessToken(c: Creds): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.exp - 60 > now) return cached.token;
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: c.email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(c.key);
  const res = await fetch(TOKEN_URL, {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, signal: AbortSignal.timeout(8000),
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature.toString("base64url")}` }),
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  const j = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!j.access_token) throw new Error("token missing");
  cached = { token: j.access_token, exp: now + (j.expires_in ?? 3600) };
  return cached.token;
}

/** Stores one submission. Throws on any failure (the route turns that into a 503 so the form can fall back to email). */
export async function saveSubmission(d: ContactData): Promise<void> {
  const c = creds();
  if (!c) throw new Error("not configured");
  const now = new Date();
  const res = await fetch(`${FIRESTORE}/v1/projects/${encodeURIComponent(c.projectId)}/databases/(default)/documents/submissions`, {
    method: "POST", signal: AbortSignal.timeout(8000),
    headers: { "content-type": "application/json", authorization: `Bearer ${await accessToken(c)}` },
    body: JSON.stringify({ fields: {
      kind: { stringValue: d.kind }, name: { stringValue: d.name }, email: { stringValue: d.email }, message: { stringValue: d.message },
      createdAt: { timestampValue: now.toISOString() }, expiresAt: { timestampValue: new Date(now.getTime() + RETENTION_MS).toISOString() },
    } }),
  });
  if (!res.ok) { if (res.status === 401) cached = null; throw new Error(`firestore ${res.status}`); }
}
