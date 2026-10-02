# Rotating the Firebase service-account key (do this once, tonight if possible)

Why: the key file `eclub-nitw-firebase-adminsdk-*.json` lived in the project folder. V6 checked that it was never committed on any branch and the folder is not under OneDrive, so there is no known leak. Rotating is still cheap insurance, because anyone who ever had the file could read and delete every stored message.

1. Google Cloud console (or Firebase console → Project settings → Service accounts) → project `eclub-nitw` → IAM & Admin → Service Accounts → `firebase-adminsdk-fbsvc@…` → **Keys** → **Add key → Create new key → JSON**. Save it outside the repo folder.
2. Put the new values in Vercel (Project → Settings → Environment Variables, **Production and Preview**): `FIREBASE_PRIVATE_KEY` (the `private_key` value, one line with `\n` escapes), `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID`. Fast path from the new file: `node scripts/write-env-local.mjs <file>` then `node scripts/vercel-env.mjs https://<site url>`.
3. Redeploy production (Deployments → ⋯ → Redeploy).
4. Prove it works: submit the contact form once on the live site (expect "Thanks. We have your message"), and check the document appears in Firestore. Delete that test document.
5. Only then, in the same Keys list, **delete the old key** (match the key ID `a14dc3caf4…`).
6. Delete the old JSON file from the project folder and the new one from Downloads (empty the recycle bin).
