// One-time Firebase setup for the contact backend, using the service account in .env.local (no CLI login needed).
// Usage: node scripts/firebase-setup.mjs            -> checks the database, deploys firestore.rules, enables the 12-month TTL on submissions.expiresAt
//        node scripts/firebase-setup.mjs --smoke    -> also writes one test submission through the real API path and deletes it.
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(readFileSync(".env.local", "utf8").split("\n").filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]));
const pid = env.FIREBASE_PROJECT_ID, email = env.FIREBASE_CLIENT_EMAIL, key = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");

async function token(scope) {
  const now = Math.floor(Date.now() / 1000);
  const u = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: email, scope, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${u}.${createSign("RSA-SHA256").update(u).sign(key).toString("base64url")}` }) });
  const j = await r.json(); if (!j.access_token) throw new Error("token: " + JSON.stringify(j));
  return j.access_token;
}
const call = async (t, method, url, body) => {
  const r = await fetch(url, { method, headers: { authorization: `Bearer ${t}`, "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const text = await r.text(); let j; try { j = JSON.parse(text); } catch { j = text; }
  return { status: r.status, body: j };
};
const brief = (r) => `${r.status} ${r.status >= 400 ? JSON.stringify(r.body).slice(0, 300) : "ok"}`;

const t = await token("https://www.googleapis.com/auth/cloud-platform");

// 1. database
const db = await call(t, "GET", `https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)`);
console.log("database (default):", db.status === 200 ? `exists, ${db.body.locationId}, ${db.body.type}` : brief(db));

// 2. security rules
const rules = readFileSync("firestore.rules", "utf8");
const rs = await call(t, "POST", `https://firebaserules.googleapis.com/v1/projects/${pid}/rulesets`, { source: { files: [{ name: "firestore.rules", content: rules }] } });
console.log("create ruleset:", brief(rs));
if (rs.status === 200) {
  const name = `projects/${pid}/releases/cloud.firestore`;
  const body = { release: { name, rulesetName: rs.body.name } };
  let rel = await call(t, "PATCH", `https://firebaserules.googleapis.com/v1/${name}`, body);
  if (rel.status === 404) rel = await call(t, "POST", `https://firebaserules.googleapis.com/v1/projects/${pid}/releases`, body.release);
  console.log("release cloud.firestore:", brief(rel));
}

// 3. TTL on submissions.expiresAt
const ttl = await call(t, "PATCH", `https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/collectionGroups/submissions/fields/expiresAt?updateMask=ttlConfig`, { ttlConfig: {} });
console.log("TTL policy on submissions.expiresAt:", brief(ttl));

if (process.argv.includes("--smoke")) {
  const dt = await token("https://www.googleapis.com/auth/datastore");
  const w = await call(dt, "POST", `https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/documents/submissions`, { fields: { kind: { stringValue: "test" }, name: { stringValue: "setup smoke test" } } });
  console.log("write test doc:", brief(w));
  if (w.status === 200) console.log("delete test doc:", brief(await call(dt, "DELETE", `https://firestore.googleapis.com/v1/${w.body.name}`)));
  // a client (no credentials) must be denied by the rules
  const anon = await fetch(`https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/documents/submissions`);
  console.log("anonymous read (must be 403):", anon.status);
}

// --list: show what is stored (names and keys only, no message bodies); --purge-tests: delete documents whose message says "safe to delete".
if (process.argv.includes("--list") || process.argv.includes("--purge-tests")) {
  const dt = await token("https://www.googleapis.com/auth/datastore");
  const l = await call(dt, "GET", `https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/documents/submissions`);
  for (const d of l.body.documents ?? []) {
    const f = d.fields, test = /safe to delete/.test(f.message?.stringValue ?? "");
    console.log(`${d.name.split("/").pop()}  kind=${f.kind?.stringValue} name=${f.name?.stringValue} created=${f.createdAt?.timestampValue} expires=${f.expiresAt?.timestampValue} fields=${Object.keys(f).join(",")}${test ? "  [test]" : ""}`);
    if (test && process.argv.includes("--purge-tests")) console.log("  deleted:", (await call(dt, "DELETE", `https://firestore.googleapis.com/v1/${d.name}`)).status);
  }
  if (!(l.body.documents ?? []).length) console.log("no submissions stored");
}
