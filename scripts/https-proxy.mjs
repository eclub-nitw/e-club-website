// Local HTTPS in front of `next start` (http://localhost:3000) so WebKit can be tested: the site's CSP has upgrade-insecure-requests, and WebKit
// then upgrades even http://localhost subresources, which fail. Usage: node scripts/https-proxy.mjs  ->  https://localhost:3443 (self-signed; Playwright ignores it).
import { createServer } from "node:https";
import { request } from "node:http";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "cert-"));
execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", join(dir, "k.pem"), "-out", join(dir, "c.pem"), "-days", "2", "-subj", "/CN=localhost", "-addext", "subjectAltName=DNS:localhost"], { stdio: "ignore" });
createServer({ key: readFileSync(join(dir, "k.pem")), cert: readFileSync(join(dir, "c.pem")) }, (req, res) => {
  const up = request({ host: "localhost", port: Number(process.env.UPSTREAM ?? 3000), path: req.url, method: req.method, headers: { ...req.headers, "x-forwarded-proto": "https" } }, (r) => { res.writeHead(r.statusCode ?? 502, r.headers); r.pipe(res); });
  up.on("error", () => { res.writeHead(502).end(); });
  req.pipe(up);
}).listen(3443, () => console.log("https://localhost:3443 -> http://localhost:3000"));
