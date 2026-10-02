# Data inventory (facts from the code, 2 Oct 2026)

For the faculty reviewer and for answering deletion requests. Every line below can be checked in the file named. Nothing here is legal text.

## What the site collects
| Item | Where it comes from | Stored where | Code |
|---|---|---|---|
| Name (2 to 80 chars) | contact / join form | Firestore `submissions` | `src/lib/contact-schema.ts`, `src/lib/server/store.ts` |
| Email (up to 254 chars) | same | same | same |
| Message (10 to 2000 chars) | same | same | same |
| `kind` (`contact` or `join`) | which form | same | same |
| `createdAt`, `expiresAt` (= createdAt + 365 days) | server clock | same | `store.ts` |
| 18+ confirmation | checkbox; **required**, enforced by the API (400 if missing) | **not stored** (only gates sending) | `contact-schema.ts` |

**Not collected or stored:** IP address, user agent, cookies, localStorage/sessionStorage, analytics identifiers, phone numbers. There is no analytics script (`package.json` and `src/` contain none). The site writes nothing to the console or logs (`grep console src` is empty).

## Where it lives
- **Database:** Cloud Firestore, project `eclub-nitw`, database `(default)`, location `asia-south1` (Mumbai) per `firebase.json` and `docs/BACKEND.md`. *Live region not re-verified in V6* (see BUILD-LOG, owner step). One collection: `submissions`.
- **Client access:** none. `firestore.rules` denies every client read and write. Only the site's server, using a service account, can read or write.
- **Server:** Vercel (serverless functions, region chosen by Vercel; the production response header showed `bom1`, Mumbai, for the edge).
- **Processors:** Google (Firebase/Firestore), Vercel (hosting, CDN, standard request logs). Unstop for registrations (outside this site). YouTube-nocookie only when a visitor clicks a video (if any are embedded).

## Rate limiting
`src/lib/server/rate-limit.ts` keeps, in the memory of one running server instance, a SHA-256 hash (24 hex chars) of the visitor address and a list of timestamps, for at most 10 minutes (limit 5 submissions per 10 minutes per client, 300 per hour overall). It is never written to disk or to Firestore, vanishes when the instance recycles, and is not shared between instances (so it is best-effort, not a hard guarantee).

## Retention and deletion
- Each document carries `expiresAt` (12 months). `GET /api/cron/purge`, scheduled daily at 03:00 UTC in `vercel.json`, deletes up to 200 expired documents per run and needs `Authorization: Bearer $CRON_SECRET`.
- Firestore's own TTL is not used (needs a billing plan the project does not have).
- Deletion on request: see `docs/DELETION-RUNBOOK.md`.

## Who can access it
Anyone with the Firebase project's IAM roles (owner: the account that created `eclub-nitw`, org `nitw.ac.in`), anyone with the Vercel project's team access (can read env vars including the service-account key), and holders of the service-account key file. **Owner action:** list these people by role and keep the list with the faculty advisor.

## Other data surfaces
- `mailto:` fallback: if storage fails the form opens the visitor's own email app with the message pre-filled; the club then receives it as ordinary email at `e_club@nitw.ac.in` (the institute's mail system).
- Server logs by Vercel: standard request metadata (including IP) held by Vercel under its own retention. The site adds nothing to it.
- Photos: 41 event photos, each recorded in `src/data/media.ts` with `consent: true` and basis "club-confirmed 2026-09-30" (a blanket club statement, not per-person records).
