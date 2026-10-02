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
5. Retention: Firestore > Time-to-live > create a policy on collection group `submissions`, field `expiresAt`. Documents then delete themselves after 12 months.
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

### Two things only a person can do
1. **TTL policy** (auto-delete after 12 months). The service account is not allowed to create it. In the Firebase console: Firestore Database > Indexes > Single field (or "Time-to-live") > Add TTL policy: collection group `submissions`, timestamp field `expiresAt`. Without it, messages are kept until deleted by hand.
2. **Production env vars on the host** (Vercel > Project > Settings > Environment Variables, Production + Preview): `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (copy the three lines from `.env.local`, the key stays on one line with `\n`), plus `NEXT_PUBLIC_SITE_URL`. Redeploy. Until then, production forms fall back to the visitor's email app.

Rotate the key (Firebase console > Project settings > Service accounts) if the JSON file was ever shared or synced anywhere. Delete the downloaded JSON once the env vars are set on the host.
