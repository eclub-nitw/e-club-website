// End-to-end test of POST /api/contact against a mock Google (token endpoint + Firestore REST). Usage: node scripts/test-api.mjs   (needs a production build)
// Starts its own `next start` twice: once configured (mock Firestore), once with no credentials (must answer 503). Exits 1 on any FAIL.
import { createServer } from "node:http";
import { generateKeyPairSync, createVerify } from "node:crypto";
import { spawn } from "node:child_process";

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
const good = { kind: "contact", name: "Test Person", email: "test@example.com", message: "Hello, a question about the club.", age: true, company: "" };

// ---- configured server
const s1 = await start(3101, { FIREBASE_PROJECT_ID: "proj-test", FIREBASE_CLIENT_EMAIL: "svc@test.iam", FIREBASE_PRIVATE_KEY: pem.replace(/\n/g, "\\n"), ALLOW_TEST_ENDPOINTS: "1", TEST_TOKEN_URL: "http://localhost:4555/token", TEST_FIRESTORE_URL: "http://localhost:4555" });
try {
  let r = await post(3101, good, { "x-forwarded-for": "10.0.0.1" });
  ok(r.status === 200 && (await r.json()).ok === true, "valid submission is accepted");
  ok(docs.length === 1 && tokens === 1 && badAssertions === 0, "one Firestore document written with a verified service-account JWT", `docs=${docs.length} tokens=${tokens}`);
  const f = docs[0]?.fields ?? {};
  ok(f.name?.stringValue === "Test Person" && f.email?.stringValue === "test@example.com" && f.kind?.stringValue === "contact" && f.createdAt?.timestampValue && f.expiresAt?.timestampValue, "document has name, email, message, kind, createdAt and the 12-month expiresAt");
  ok(!JSON.stringify(docs[0]).match(/10\.0\.0\.1|user-agent/i), "no IP address or user agent is stored");
  r = await post(3101, { ...good, kind: "join" }, { "x-forwarded-for": "10.0.0.2" });
  ok(r.status === 200 && docs.length === 2 && docs[1].fields.kind.stringValue === "join" && tokens === 1, "join kind stored; access token reused (cached)");
  r = await post(3101, { ...good, company: "bot" }, { "x-forwarded-for": "10.0.0.3" });
  ok(r.status === 200 && docs.length === 2, "honeypot answers 200 but stores nothing");
  r = await post(3101, { ...good, email: "nope" }, { "x-forwarded-for": "10.0.0.4" });
  const j = await r.json();
  ok(r.status === 400 && j.fields?.email, "invalid email is rejected with a field error");
  r = await post(3101, { ...good, age: false, message: "short" }, { "x-forwarded-for": "10.0.0.5" });
  const j2 = await r.json();
  ok(r.status === 400 && j2.fields?.age && j2.fields?.message, "missing 18+ and a short message are rejected");
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
  r = await post(3101, good, { "x-forwarded-for": "10.8.8.8" });
  ok(r.status === 200, "a different client is not limited");
  ok(!JSON.stringify(docs).includes("evil"), "rejected requests wrote nothing");
} finally { s1.kill(); }

// ---- unconfigured server
const s2 = await start(3102, {});
try {
  const r = await post(3102, good, { "x-forwarded-for": "10.1.1.1" });
  ok(r.status === 503 && (await r.json()).error === "storage_unavailable", "no credentials: 503 so the form falls back to email");
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
