// Writes the three FIREBASE_* variables into .env.local from a downloaded service-account JSON (kept on one line with \n escapes).
// Usage: node scripts/write-env-local.mjs <service-account.json>   (.env.local is gitignored; other lines in it are kept)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
const j = JSON.parse(readFileSync(process.argv[2], "utf8"));
if (j.type !== "service_account" || !j.private_key) throw new Error("not a service account file");
const keep = existsSync(".env.local") ? readFileSync(".env.local", "utf8").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("FIREBASE_")) : [];
const lines = [...keep, `FIREBASE_PROJECT_ID=${j.project_id}`, `FIREBASE_CLIENT_EMAIL=${j.client_email}`, `FIREBASE_PRIVATE_KEY=${j.private_key.replace(/\n/g, "\\n")}`];
writeFileSync(".env.local", lines.join("\n") + "\n");
console.log(`.env.local written for ${j.project_id} (${j.client_email})`);
