# Deletion-request runbook (internal)

Use when someone emails `e_club@nitw.ac.in` asking to see, correct or delete what they sent through the site's forms. Reply within the period the faculty-approved privacy policy states.

1. **Verify the requester.** Reply to the address they wrote from and ask them to confirm the email address they used in the form. Do not act on a request from a different address without the faculty advisor's say-so.
2. **Open Firestore.** Firebase console → project `eclub-nitw` → Firestore Database → Data → collection `submissions`. (Needs a project member's login; do not share the service-account key.)
3. **Find their documents.** Use "Filter" (or Query builder): field `email`, operator `==`, value their address. Also try the lower-case version, and search by `name` if they used another address. Open each hit and check `message` to be sure it is theirs.
4. **If they asked for a copy:** export the matching fields (name, email, message, kind, createdAt) into an email to them.
5. **Delete.** Open each document → ⋮ → Delete document. Confirm the filter now returns nothing.
6. **Reply** that it is done, with the date. Do not keep their request email longer than needed to prove you answered it (follow the faculty advisor's rule).
7. **Log it** (date, "deletion done", no personal details) in the club's own records.

Notes: backups are not kept by the site. The email fallback path (`mailto`) lands in the club mailbox, so also delete or redact those emails if the person used it. Documents delete themselves 12 months after creation (daily job).
