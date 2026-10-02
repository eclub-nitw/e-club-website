# BACKEND (contact and join forms)

The site is statically generated. The only server code is one Route Handler, `POST /api/contact` (`src/app/api/contact/route.ts`), which stores a message in Cloud Firestore. Nothing else is stored; there is no login, no payments, no tracking.

## What it does, in order
1. **Same-origin check.** The `Origin` header must be our own host (CSRF defence). Missing or foreign: 403.
2. **Content type and size.** JSON only, 8 KB maximum (415 / 413).
3. **Honeypot.** A filled `company` field gets a fake 200 and nothing is stored.
4. **Rate limit.** 5 per client per 10 minutes and 300 per hour overall (429 with `Retry-After`). The client address is hashed in memory for the counter and never stored. The counter is per server instance; for a hard guarantee also enable the host's WAF/rate limiting.
5. **Validation** (`src/lib/contact-schema.ts`, the same code the form runs): name 2-80, email, message 10-2000, 18+ confirmation, strings only, control characters stripped. 400 with per-field messages.
6. **Store** (`src/lib/server/store.ts`): one `submissions` document with `kind` (`contact` | `join`), `name`, `email`, `message`, `createdAt`, `expiresAt` (12 months later). No IP, no user agent. Failure or missing credentials: 503, and the form opens the visitor's own email app with the message pre-filled, so nothing is lost silently.

Firestore security rules (`firestore.rules`) deny all client access. Only the server, holding a service account, can write (the REST call is authenticated with a signed JWT; no SDK, no dependency).

## One-time setup (about 10 minutes, needs the club's Google account)
1. Firebase console: create a project for the club (for example `eclub-nitw`), Build > Firestore Database > Create (production mode, region `asia-south1` Mumbai).
2. Project settings > Service accounts > Generate new private key. Keep the JSON file private.
3. Set three environment variables on the host (see `.env.example`): `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` (`client_email`), `FIREBASE_PRIVATE_KEY` (`private_key`, one line, `\n` escapes). Also set `NEXT_PUBLIC_SITE_URL`. Redeploy.
4. Deploy the rules: `firebase deploy --only firestore:rules --project <id>`.
5. Retention: handled by the daily purge job (see "Retention" below), not Firestore TTL.
6. Read messages in the Firestore console (`submissions`). Give access only to the people who answer them.

Do **not** use the unrelated `idle-eras-rebuild-humanity` project that is logged in on the owner's CLI.

## Privacy points for the legal review
Stored: what the visitor typed (name, email, message, which form), plus timestamps. Purpose: replying. Retention: 12 months by TTL. 18+ only. The privacy policy (`content/legal/PRIVACY.md`) is a human-reviewed document and was **not edited**: it must be checked against this description before the backend is switched on.

## Tests
`node scripts/test-api.mjs` starts the built site against a mock Google (token endpoint verifying the RS256 JWT + Firestore REST) and checks 25 cases: accepted, document shape, no IP stored, honeypot, validation, type confusion, bad JSON, CSRF, content type, size, 405, caching, rate limit, 503 without credentials, 503 on a storage failure. Needs `npm run build` first.

## Status (2 Oct 2026): connected to `eclub-nitw`
- Project `eclub-nitw` (number 1078092355263, org nitw.ac.in), Firestore `(default)` in `asia-south1` (Mumbai, native mode) exists.
- Service account `firebase-adminsdk-fbsvc@eclub-nitw.iam.gserviceaccount.com`; its key is in `.env.local` (gitignored, never committed; the downloaded JSON is also gitignored by `*-firebase-adminsdk-*.json`). Rewrite it any time with `node scripts/write-env-local.mjs <key.json>`.
- `firestore.rules` (deny all clients) are **deployed** to the project, and an anonymous read returns 403.
- Verified live: the real `/api/contact` route stored a `join` submission with name, email, message, kind, `createdAt` and `expiresAt` (+12 months), no IP; the test document was deleted.
- `.firebaserc` sets the default project to `eclub-nitw`. The Firebase CLI on this laptop is logged in as another account that cannot see this project, so setup used the service account over REST: `node scripts/firebase-setup.mjs` (checks the database, redeploys the rules, tries the TTL policy), `--smoke` (write/delete test, anonymous-read check), `--list` (show stored submissions), `--purge-tests`.

### Retention (12 months): done in the app, not by Firestore TTL
Firestore's native TTL needs the Blaze (billing) plan; `eclub-nitw` has billing disabled, so `src/app/api/cron/purge/route.ts` does it: `vercel.json` runs it daily at 03:00 UTC, it deletes submissions whose `expiresAt` has passed. It refuses to run without `CRON_SECRET` (16+ characters) and answers 401 to anyone without `Authorization: Bearer $CRON_SECRET` (Vercel adds that header itself when the env var exists). Verified on the real database: an expired test document was deleted, a fresh one kept, no/incorrect auth got 401. If billing is ever enabled you can switch to a native TTL policy (`firestore.indexes.json` field override) and delete the route.

### Firebase CLI
The CLI now has access: `firebase deploy --only firestore --project eclub-nitw` deploys `firestore.rules` (and the empty indexes file); `firebase.json` and `.firebaserc` are committed. Scripts: `node scripts/firebase-setup.mjs` (check + redeploy rules), `--smoke`, `--list`, `--purge-tests`, `--seed-expired`.

### The one thing left: production env vars on the host
Vercel > Project > Settings > Environment Variables (Production and Preview): `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (copy the three lines from `.env.local`, key on one line with `
`), **`CRON_SECRET`** (copy from `.env.local`), `NEXT_PUBLIC_SITE_URL`. Redeploy. Until then production forms fall back to the visitor's email app and the purge job stays disabled.

Rotate the key (Firebase console > Project settings > Service accounts) if the JSON was ever shared or synced; delete the downloaded JSON once the env vars are on the host.

## Deployment (Vercel), 2 Oct 2026
- Team `e-club-3868`, project **`e-club-nitw`** (`.vercel/` is local and gitignored). Production: **https://e-club-nitw.vercel.app** (deployed from the V5 branch with `vercel deploy --prod`).
- All five variables are set for Production and Preview (`FIREBASE_*`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`); the key and secret are stored as sensitive. Re-push from `.env.local` any time with `node scripts/vercel-env.mjs https://<site-url>` (for example after the real domain exists, then redeploy).
- `.vercelignore` keeps `raw-media`, `docs`, `.next`, `.env*` and key files out of the upload (without it the CLI uploaded 1.4 GB).
- Verified on the live URL: every route 200, console clean, security headers present, a message from the live site landed in Firestore (then deleted), foreign origin 403, cron 401 without the secret and `{"deleted":0}` with it.
- **Not yet done**: the GitHub connection (no auto-deploys on push). Vercel says the account has no GitHub login connection: Vercel > Account Settings > Authentication > connect GitHub, install the Vercel GitHub App on the `eclub-nitw` org (an org owner must approve), then `vercel git connect https://github.com/eclub-nitw/e-club-website`. Git deploys build the branch you push; `main` still holds the old V4 code until V5 is merged.
