// Pushes the backend variables from .env.local (and the site URL) to the linked Vercel project, for Production and Preview. Values are piped, never printed.
// Usage: node scripts/vercel-env.mjs https://your-site-url
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const siteUrl = process.argv[2];
if (!/^https:\/\/[^\s/]+$/.test(siteUrl ?? "")) throw new Error("usage: node scripts/vercel-env.mjs https://site.example (no trailing slash)");
const local = Object.fromEntries(readFileSync(".env.local", "utf8").split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]));
const vars = { FIREBASE_PROJECT_ID: local.FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL: local.FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY: local.FIREBASE_PRIVATE_KEY, CRON_SECRET: local.CRON_SECRET, NEXT_PUBLIC_SITE_URL: siteUrl };

for (const [name, value] of Object.entries(vars)) {
  if (!value) throw new Error(`${name} is empty in .env.local`);
  for (const target of ["production", "preview"]) {
    const sensitive = name === "FIREBASE_PRIVATE_KEY" || name === "CRON_SECRET";
    const args = ["env", "add", name, target, "--force", ...(sensitive ? ["--sensitive"] : [])];
    const r = spawnSync("vercel", args, { input: value, encoding: "utf8", shell: true });
    const out = (r.stdout + r.stderr).replace(/[│╭╰─╮╯]/g, "");
    console.log(`${name} -> ${target}: ${r.status === 0 ? "ok" : out.split("\n").filter((l) => /rror|denied|branch/i.test(l)).join(" ").slice(0, 200)}`);
  }
}
