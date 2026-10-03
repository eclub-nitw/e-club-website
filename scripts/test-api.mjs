// End-to-end test of POST /api/contact against a mock Google (token endpoint + Firestore REST). Usage: node scripts/test-api.mjs   (needs a production build)
// Starts its own `next start` twice: once configured (mock Firestore), once with no credentials (must answer 503). Exits 1 on any FAIL.
import { createServer } from "node:http";
import { generateKeyPairSync, createVerify } from "node:crypto";
import { spawn } from "node:child_process";
import { request } from "node:http";

let fails = 0;
const ok = (c, name, d = "") => { if (!c) fails++; console.log(`${c ? "PASS" : "FAIL"}  ${name}${d ? "  " + d : ""}`); };

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

// ---- mock Google
const docs = []; let tokens = 0, badAssertions = 0;
const mock = createServer((req, res) => {
  let body = ""; req.on("data", (c) => (body += c));
  req.on("end", () => {
    if (req.url === "/token") {
      const a = new URLSearchParams(body).get("assertion") ?? ""; const [h, c, s] = a.split(".");
      const good = createVerify("RSA-SHA256").update(`${h}.${c}`).verify(publicKey, Buffer.from(s ?? "", "base64url"));
      const claim = good ? JSON.parse(Buffer.from(c, "base64url").toString()) : {};
      if (!good || claim.iss !== "svc@test.iam" || !/datastore/.test(claim.scope)) { badAssertions++; res.writeHead(400).end("{}"); return; }
      tokens++; res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ access_token: "tok-123", expires_in: 3600 })); return;
    }
    if (req.url?.startsWith("/v1/projects/proj-test/databases/(default)/documents/submissions") && req.headers.authorization === "Bearer tok-123") {
      docs.push(JSON.parse(body)); res.writeHead(200, { "content-type": "application/json" }).end("{}"); return;
    }
    if (req.url === "/v1/projects/proj-test/databases/(default)/documents:runQuery" && req.headers.authorization === "Bearer tok-123") { res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify([{ readTime: "2026-01-01T00:00:00Z" }])); return; }
    res.writeHead(403).end("{}");
  });
});
await new Promise((r) => mock.listen(4555, r));

const start = (port, env) => new Promise((resolve) => {
  const p = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], { env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
  p.stdout.on("data", (d) => { if (/Ready|started server/.test(String(d))) resolve(p); });
  setTimeout(() => resolve(p), 8000);
});
const post = (port, body, headers = {}, raw = false) => fetch(`http://localhost:${port}/api/contact`, {
  method: "POST", headers: { "content-type": "application/json", origin: `http://localhost:${port}`, ...headers }, body: raw ? body : JSON.stringify(body),
});
const good = { type: "contact", name: "Test Person", email: "test@example.com", message: "Hello, a question about the club.", company: "" };

// ---- configured server
const s1 = await start(3101, { FIREBASE_PROJECT_ID: "proj-test", FIREBASE_CLIENT_EMAIL: "svc@test.iam", FIREBASE_PRIVATE_KEY: pem.replace(/\n/g, "\\n"), CRON_SECRET: "0123456789abcdef-secret", ALLOW_TEST_ENDPOINTS: "1", TEST_TOKEN_URL: "http://localhost:4555/token", TEST_FIRESTORE_URL: "http://localhost:4555" });
try {
  let r = await post(3101, good, { "x-forwarded-for": "10.0.0.1" });
  ok(r.status === 200 && (await r.json()).ok === true, "valid submission is accepted");
  ok(docs.length === 1 && tokens === 1 && badAssertions === 0, "one Firestore document written with a verified service-account JWT", `docs=${docs.length} tokens=${tokens}`);
  const f = docs[0]?.fields ?? {};
  ok(f.name?.stringValue === "Test Person" && f.email?.stringValue === "test@example.com" && f.type?.stringValue === "contact" && f.createdAt?.timestampValue && f.expiresAt?.timestampValue, "document has name, email, message, type, createdAt and the 12-month expiresAt");
  ok(!JSON.stringify(docs[0]).match(/10\.0\.0\.1|user-agent/i), "no IP address or user agent is stored");
  r = await post(3101, { ...good, type: "join", branch: "CSE", year: "2nd" }, { "x-forwarded-for": "10.0.0.2" });
  ok(r.status === 200 && docs.length === 2 && docs[1].fields.type.stringValue === "join" && docs[1].fields.branch?.stringValue === "CSE" && docs[1].fields.year?.stringValue === "2nd" && tokens === 1, "join type stored with branch and year; access token reused (cached)");
  r = await post(3101, { ...good, type: "query" }, { "x-forwarded-for": "10.0.0.20" });
  ok(r.status === 200 && docs.at(-1).fields.type.stringValue === "query" && !docs.at(-1).fields.branch, "query type stored, no optional fields");
  r = await post(3101, { ...good, type: "sponsor", organisation: "Acme Ltd", website: "https://acme.example", role: "Head of Partnerships", interest: "Sponsor an event" }, { "x-forwarded-for": "10.0.0.21" });
  ok(r.status === 200 && docs.at(-1).fields.type.stringValue === "sponsor" && docs.at(-1).fields.organisation?.stringValue === "Acme Ltd" && docs.at(-1).fields.website?.stringValue === "https://acme.example" && docs.at(-1).fields.role?.stringValue === "Head of Partnerships" && docs.at(-1).fields.interest?.stringValue === "Sponsor an event", "sponsor type stored with organisation and website");
  const before = docs.length;
  r = await post(3101, { ...good, type: "sponsor", interest: "Media" }, { "x-forwarded-for": "10.0.0.22" });
  ok(r.status === 400 && (await r.json()).fields?.organisation, "sponsor without an organisation is rejected");
  r = await post(3101, { ...good, type: "sponsor", organisation: "Acme", website: "javascript:alert(1)", interest: "Other" }, { "x-forwarded-for": "10.0.0.23" });
  ok(r.status === 400, "a non-http(s) website is rejected");
  r = await post(3101, { ...good, type: "bogus" }, { "x-forwarded-for": "10.0.0.24" });
  ok(r.status === 400, "an unknown type is rejected");
  r = await post(3101, { ...good, kind: "join" }, { "x-forwarded-for": "10.0.0.25" });
  ok(r.status === 400, "an unknown field (the retired kind) is rejected, not ignored");
  r = await post(3101, { ...good, age: true }, { "x-forwarded-for": "10.0.0.26" });
  ok(r.status === 400, "the retired age field is rejected");
  r = await post(3101, { ...good, branch: "CSE" }, { "x-forwarded-for": "10.0.0.27" });
  ok(r.status === 400, "a branch on a contact message is rejected (fields belong to their type)");
  r = await post(3101, { ...good, type: "join", branch: "x".repeat(70) }, { "x-forwarded-for": "10.0.0.28" });
  ok(r.status === 400, "an over-long branch is rejected");
  r = await post(3101, { ...good, type: "sponsor", interest: "Other", organisation: "x".repeat(130) }, { "x-forwarded-for": "10.0.0.29" });
  ok(r.status === 400, "an over-long organisation is rejected");
  r = await post(3101, { ...good, type: "sponsor", organisation: "Acme" }, { "x-forwarded-for": "10.0.0.30" });
  ok(r.status === 400 && (await r.json()).fields?.interest, "sponsor without an interest is rejected");
  r = await post(3101, { ...good, type: "sponsor", organisation: "Acme", interest: "Buy everything" }, { "x-forwarded-for": "10.0.0.31" });
  ok(r.status === 400, "an interest outside the four choices is rejected");
  r = await post(3101, { ...good, type: "sponsor", organisation: "Acme", interest: "Media", role: "x".repeat(90) }, { "x-forwarded-for": "10.0.0.32" });
  ok(r.status === 400, "an over-long role is rejected");
  r = await post(3101, { ...good, type: "query", role: "CEO" }, { "x-forwarded-for": "10.0.0.33" });
  ok(r.status === 400, "a role on a query is rejected (role and interest belong to sponsor)");
  r = await post(3101, { ...good, type: "sponsor", organisation: "Acme", interest: "Media", branch: "CSE" }, { "x-forwarded-for": "10.0.0.34" });
  ok(r.status === 400, "a branch on a sponsor message is rejected");
  ok(docs.length === before, "none of the rejected requests wrote a document");
  r = await post(3101, { ...good, company: "bot" }, { "x-forwarded-for": "10.0.0.3" });
  ok(r.status === 200 && docs.length === before, "honeypot answers 200 but stores nothing");
  r = await post(3101, { ...good, email: "nope" }, { "x-forwarded-for": "10.0.0.4" });
  const j = await r.json();
  ok(r.status === 400 && j.fields?.email, "invalid email is rejected with a field error");
  r = await post(3101, { ...good, message: "short" }, { "x-forwarded-for": "10.0.0.5" });
  const j2 = await r.json();
  ok(r.status === 400 && j2.fields?.message, "a short message is rejected");
  r = await post(3101, { ...good, message: "x".repeat(2100) }, { "x-forwarded-for": "10.0.0.6" });
  ok(r.status === 400, "over-long message is rejected");
  r = await post(3101, { ...good, name: ["a", "b"], email: { x: 1 } }, { "x-forwarded-for": "10.0.0.7" });
  ok(r.status === 400, "non-string fields are rejected (no type confusion)");
  r = await post(3101, "{not json", { "x-forwarded-for": "10.0.0.8" }, true);
  ok(r.status === 400, "malformed JSON is rejected");
  r = await post(3101, "[1,2]", { "x-forwarded-for": "10.0.0.8" }, true);
  ok(r.status === 400, "a JSON array is rejected");
  r = await post(3101, good, { origin: "https://evil.example", "x-forwarded-for": "10.0.0.9" });
  ok(r.status === 403, "foreign Origin is refused (CSRF)");
  r = await fetch("http://localhost:3101/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(good) });
  ok(r.status === 403, "missing Origin is refused");
  r = await post(3101, good, { origin: "https://e-club-nitw.vercel.app", "x-forwarded-for": "10.0.1.1" });
  ok(r.status === 200, "the legacy vercel.app origin is allowed");
  r = await post(3101, good, { origin: "https://e-club-nitw.vercel.app.evil.example", "x-forwarded-for": "10.0.1.2" });
  ok(r.status === 403, "a look-alike origin is refused");
  r = await post(3101, good, { origin: "null", "x-forwarded-for": "10.0.1.3" });
  ok(r.status === 403, "Origin: null (sandboxed frame) is refused");
  const forged = await new Promise((res) => { const q = request({ host: "localhost", port: 3101, path: "/api/contact", method: "POST", agent: false, headers: { host: "evil.example", origin: "https://evil.example", "content-type": "application/json" } }, (m) => { m.resume(); res(m.statusCode); }); q.on("error", () => res(0)); q.end(JSON.stringify(good)); });
  ok(forged === 403, "a forged Host header cannot vouch for a foreign Origin");
  r = await post(3101, JSON.stringify({ ...good, message: "é".repeat(5000) }), { "x-forwarded-for": "10.0.1.4" }, true);
  ok(r.status === 413, "the body cap counts bytes, not characters (5000 two-byte characters = 10 kB)");
  const cron = (auth) => fetch("http://localhost:3101/api/cron/purge", { headers: auth ? { authorization: auth } : {} });
  ok((await cron()).status === 401, "cron: no Authorization is refused");
  ok((await cron("Bearer wrong")).status === 401, "cron: wrong secret is refused");
  ok((await cron("Bearer 0123456789abcdef-secreX")).status === 401, "cron: same-length wrong secret is refused");
  ok((await cron("0123456789abcdef-secret")).status === 401, "cron: secret without the Bearer scheme is refused");
  r = await cron("Bearer 0123456789abcdef-secret");
  ok(r.status === 200 && (await r.json()).deleted === 0 && r.headers.get("cache-control") === "no-store", "cron: the right secret runs the purge (mock Firestore, nothing expired)");
  r = await fetch("http://localhost:3101/api/cron/purge", { method: "POST", headers: { authorization: "Bearer 0123456789abcdef-secret" } });
  ok(r.status === 405, "cron: POST is not allowed");
  r = await post(3101, "name=x", { "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": "10.0.0.10" }, true);
  ok(r.status === 415, "non-JSON content type is refused");
  r = await post(3101, JSON.stringify({ ...good, message: "y".repeat(20000) }), { "x-forwarded-for": "10.0.0.11" }, true);
  ok(r.status === 413, "oversized body is refused (413)");
  r = await fetch("http://localhost:3101/api/contact");
  ok(r.status === 405 && r.headers.get("allow") === "POST", "GET is 405");
  ok(r.headers.get("cache-control") === "no-store", "responses are no-store");
  let last;
  for (let i = 0; i < 7; i++) last = await post(3101, good, { "x-forwarded-for": "10.9.9.9" });
  ok(last.status === 429 && Number(last.headers.get("retry-after")) > 0, "per-client rate limit answers 429 with Retry-After", `status=${last.status}`);
  r = await post(3101, good, { "x-forwarded-for": "7.7.7.7, 10.9.9.9" });
  ok(r.status === 429, "rotating a spoofed first X-Forwarded-For entry does not escape the limit");
  r = await post(3101, good, { "x-forwarded-for": "10.8.8.8" });
  ok(r.status === 200, "a different client is not limited");
  ok(!JSON.stringify(docs).includes("evil"), "rejected requests wrote nothing");
} finally { s1.kill(); }

// ---- unconfigured server
// explicit empty values: a real .env.local must never leak into this test (process env wins over .env files)
const s2 = await start(3102, { FIREBASE_PROJECT_ID: "", FIREBASE_CLIENT_EMAIL: "", FIREBASE_PRIVATE_KEY: "", CRON_SECRET: "", ALLOW_TEST_ENDPOINTS: "1" });
try {
  const r = await post(3102, good, { "x-forwarded-for": "10.1.1.1" });
  ok(r.status === 503 && (await r.json()).error === "storage_unavailable", "no credentials: 503 so the form falls back to email");
  const c = await fetch("http://localhost:3102/api/cron/purge", { headers: { authorization: "Bearer " } });
  ok(c.status === 503 && (await c.json()).error === "disabled", "cron: with no CRON_SECRET the endpoint is disabled, not open");
} finally { s2.kill(); }

// ---- storage failure
const s3 = await start(3103, { FIREBASE_PROJECT_ID: "other", FIREBASE_CLIENT_EMAIL: "svc@test.iam", FIREBASE_PRIVATE_KEY: pem.replace(/\n/g, "\\n"), ALLOW_TEST_ENDPOINTS: "1", TEST_TOKEN_URL: "http://localhost:4555/token", TEST_FIRESTORE_URL: "http://localhost:4555" });
try {
  const r = await post(3103, good, { "x-forwarded-for": "10.2.2.2" });
  ok(r.status === 503, "storage error (403 from Firestore): 503, nothing leaked", String(r.status));
} finally { s3.kill(); }

mock.close();
console.log(fails ? `\n${fails} FAIL` : "\nall pass");
process.exit(fails ? 1 : 0);
