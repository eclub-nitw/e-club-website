# OVERNIGHT V6: PRODUCTION HARDENING AND LAUNCH (condensed copy of the owner's brief, 2 Oct 2026)

Launch line: `Read AGENTS.md, docs/handoff/SESSION-HANDOFF*.md, docs/handoff/BUILD-LOG-V5-2026-10-02.md and this file fully. Branch from main as claude/v6-<date>. Execute in order. Report with evidence.`

Inheriting: V5 live at https://e-club-nitw.vercel.app (main = 8b041fb). **Do not redesign.** V6 = security, correctness, domain, post-deadline behaviour, performance, content gaps, handover.

Rules: never push to `main`; no invented facts; never write or alter legal text; no CSP/.github/CI/env changes without stating the exact diff in the build log, never loosen CSP; claim "tested" only for what was run (list tested / not tested separately); no phone numbers, WhatsApp, unconsented photos or logos. Reply: compact, tables, end with `NEXT ACTION` and `FOLLOW-UP PRIORITY`; at most two blocking questions.

Order:
- **A** security: key, Firestore rules/region, secrets scan, endpoint review, headers, audit/deps.
- **B** deadline states: registration closes end of 3 Oct IST; Round 1 closes 9 Oct 08:00 IST; state table, no "Register" after close, no stale server text, fake-clock Playwright proof.
- **D2** quick content fixes: partner spelling, duplicate Backed-by, Technozion transcription, one Round 1 end format.
- **C** custom domain: cutover doc, `NEXT_PUBLIC_SITE_URL` everywhere, legacy host redirect, HSTS after stable, human-only steps.
- **E** performance, honestly: measure the deployed site, LCP levers one at a time, shader stall, low-end gate.
- **F** QA matrix: existing scripts, Chromium/Firefox/WebKit at 360/768/1440, keyboard/reduced motion/zoom/no-JS, forms, error surfaces, real-phone checklist.
- **G** privacy handover: data inventory, legal conflicts, 18+, deletion runbook.
- **H** hygiene: trim old screenshots, README, TASKS, branch protection suggestions, old venture-vortex folder.

Deliverable: `docs/handoff/BUILD-LOG-V6-<date>.md` (what changed, evidence, check table, Not tested, Needs the owner, rules bent) and a chat reply under 25 lines.
