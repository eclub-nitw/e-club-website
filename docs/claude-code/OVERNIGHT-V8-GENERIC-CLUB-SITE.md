# OVERNIGHT V8: A CLUB SITE, NOT AN EVENT SITE (E-Club NIT Warangal)
Launch line (owner fills the three flags before pasting; a flag left as `no` or blank means keep that item hidden):
`OWNER FLAGS: PHOTO_CONSENT=<yes|no> INSTITUTE_EMBLEM_PERMISSION=<yes|no> PARTNER_LOGOS_APPROVED=<yes|no>. Read AGENTS.md, docs/handoff/SESSION-HANDOFF*.md, BUILD-LOG-V5/V6/V7, docs/claude-code/OVERNIGHT-V6 and V7, and this file fully. Branch claude/v8-<date> from main (V7 is merged, main = a16bdeb). Execute in order. Verify by running. Report with evidence.`

## 0. Why this run exists (owner feedback after V7, 3 Oct 2026)
The owner loves the design and the dive-in animations. His verdict: **the whole site reads as a Venture Vortex website. It must read as the website of an entrepreneurship club, like ecell.iith.ac.in, ecell.in (IIT Bombay) and ecell.iitm.ac.in, with Venture Vortex as one initiative that is featured while it runs and leaves when it is over.** Venture Vortex is a competition the club runs; the club is not the competition.

Diagnosis you must confirm in Phase A (from reading `src/data/copy.ts` and the live pages): five of nine Home sections are Venture Vortex (Numbers, Reach, Flagship dive, Posters, Backed by); the ticker, hero CTA, countdown, floating register pill and Home meta description are Venture Vortex; `about.manifesto` ends with a Venture Vortex sentence; the About page ties the four-word motto to Rounds 1 to 3 (that mapping came from the V7 brief and was wrong, remove it).

Also: the previous Claude chat fetched the live Home page and received an OLDER copy (hero line "Bring the idea. We bring the questions.", partners titled "Backed by", footer line "Every company starts as an argument in a room.") while `/venture-vortex` returned V7 content. Either that fetch was cached or the deployment is mixed. **Verify first (A1) that production serves main a16bdeb's content on every route.**

## 1. Owner requests (S1 to S14), each closed with evidence
| # | Request | Required outcome |
|---|---|---|
| S1 | Base the site on a generic E-Cell site (IITH, IITB, IITM); content similar; Venture Vortex present but not the whole site | New Home information architecture (B, C), club-generic copy everywhere, Venture Vortex confined to an allowlist (see 2). |
| S2 | Do not remove the dive-in animations; improvise the content | Dive stays; its content is reframed (D). |
| S3 | Contact: a different box for sponsorship/partnership and a different one for contact/queries | Two separate boxes, each with its own form (H). |
| S4 | Home topic 3 (About) is still empty on the right; analyse the live site first, then fix | Evidence-first diagnosis, then a filled right side (C3). |
| S5 | About: remove Round 1, Round 2 etc.; the club is generic; do not link generic content to the event | About has zero Venture Vortex content (E). |
| S6 | Keep the Initiatives tab; Venture Vortex must leave the events list after the event | Sunset logic (F). |
| S7 | Venture Vortex page has empty space at the start; put the poster in the hero, not below | Poster-in-hero layout (G). |
| S8 | Gallery: only the pictures from the three event folders | Gallery contains exactly the 18 event photos and nothing else (I). |
| S9 | Wire the E-Club and NITW logos; partner logos are in the same folder | Exact files below (J). The Canva link is robots-blocked: do not try it. |
| S10 | Increase sizes where the layout feels small; fill the site; make no mistake | Audits (L) plus reading every screenshot yourself. |

## 2. Rules for this run (additions; AGENTS.md and V5 to V7 rules still apply)
- **Venture Vortex allowlist.** The words "Venture Vortex", "Unstop", "Round 1/2/3", "₹50,000", "Technozion", "Masters' Union", "School2Startup", "Uplearn" may appear only in: the nav spotlight button (label from data), the Home spotlight block and ticker items, `/initiatives` (as one row), `/venture-vortex`, the event-partners block on `/sponsors`, and Event JSON-LD. Everywhere else (About, Team, Gallery, Contact, legal pages, footer, Organization JSON-LD, Home meta description, OG default) the club is generic. Enforce with a test (L2).
- No invented facts. Unknown event dates, venues, counts, names, quotes stay `null` and the UI omits the line. Sections whose data is empty do not render at all (no empty headings, no "coming soon" filler). Reword nothing the owner has not seen: new motto-interpretation lines are marked CONFIRM in `docs/COPY-REVIEW.md`.
- Owner flags decide visibility: `PHOTO_CONSENT=yes` → set `photoConsent` on the three events to the string `"Club owner (Abdul Wahid) confirmed consent of the people shown, 3 Oct 2026 launch brief"` (quote exactly; do not embellish); anything else → leave `null`. `INSTITUTE_EMBLEM_PERMISSION=yes` → `site.showInstituteLogo = true`. `PARTNER_LOGOS_APPROVED=yes` → partner `consent: true` with a note "owner-supplied 3 Oct 2026; written permission to be filed". List all three in `docs/LEGAL-REVIEW-NOTES.md` either way.
- No new runtime dependency; initial JS on `/` ≤ 195 KB gz; Lighthouse mobile ≥ 90; keep the tested animation language; reduced motion intact; no custom cursor; no pointer-follow UI.
- Do not touch CSP, `.github`, CI, env values. Never push to `main`. Do not rewrite legal text.

## 3. Phase A: verify and analyse before changing anything
A1. **Deployment parity.** `git rev-parse main origin/main`; compare production HTML (`curl -s -H "Cache-Control: no-cache" https://e-club-nitw.vercel.app/` plus `?v=<timestamp>`) against the local production build of main: hero line, partner section title, footer line. If production differs from main, find why (stale alias, wrong branch, failed build) and report; do not paper over it.
A2. **Screenshot production** (not localhost) for every route at 390, 768, 1366×768, 1440, 1920: save to `docs/handoff/v8/before/`. Look at each one yourself.
A3. **Topic 3 diagnosis** (Home About: text left, image right "looks empty on the right"). Test these hypotheses and record which is true: (a) the right-hand image does not reveal because the masked reveal never fires (IntersectionObserver threshold or `once` on a tall element), (b) the artwork (`network-city`) is mostly dark and reads as empty on ink, (c) the grid column is wider than the content, (d) the image is lazy and blank at first paint. Fix the cause, not the symptom.
A4. **VV-bleed inventory:** list every component, string and data field that mentions the competition, with route and line, into `docs/V8-ANALYSIS.md`.
A5. **Reference pass.** Re-open the Home pages of ecell.iith.ac.in, ecell.in and ecell.iitm.ac.in in Playwright (data from V5 research exists in `docs/PARITY-V5.md`; refresh only what you need). Output a table: section order, what each section contains (type of content, not copy), and our equivalent plus whether our data exists. Known pattern: hero → ticker → numbers → about/initiatives → events → speakers → testimonials → sponsors → contact; none of the three has a flagship countdown; IITB shows club-wide proof numbers; IITH has a "backed by" grid and a footer partner CTA. Do not copy layouts, text or assets.
A6. Write `docs/V8-ANALYSIS.md` (diagnosis, hypotheses result, inventory, reference table). Commit.

## 4. Phase B: information architecture (decisions already made)
**Nav:** Home, About, Initiatives, Team, Sponsors, Gallery, Contact + one spotlight button (label and target from `src/data/spotlight.ts`, currently "Venture Vortex" → `/venture-vortex`; it disappears when the spotlight ends). Brand = E-Club logo + "E-Club NITW".

**Spotlight data (`src/data/spotlight.ts`):** `{ slug: "venture-vortex-2026", from, until, hideFromListsAfter }`. `until` = finale end (31 Oct 2026 20:00 IST); `hideFromListsAfter` = 7 days later. The V6 `phase.ts` stays the single source of date states. While active: nav button, Home spotlight block, ticker items (max 3), floating register pill (only on `/`, `/initiatives`, `/venture-vortex`; **removed from About, Team, Sponsors, Gallery, Contact**), `/initiatives` "Upcoming" row. After `hideFromListsAfter`: all of those disappear automatically, the Initiatives list drops it, sitemap keeps `/venture-vortex`, which renders an "ended" banner and Event status `EventCompleted`. Build a fake-clock test for 1 Nov and 8 Nov.

**Home order (sections render only when they have data):**
1. Hero: h1 "E-Club NIT Warangal"; label "Entrepreneurship Club · Warangal, Telangana"; the official line "Think. Connect. Create. Lead." as the large supporting line; primary CTA "Explore initiatives", secondary "Get in touch"; under them one small spotlight chip (phase-aware, e.g. "Now: Venture Vortex 2026 · registration closes 3 Oct →"). No countdown in the hero and no "Register" as the primary button. Keep the hero art, light sweep and bars.
2. Ticker: club items first (name, motto, initiative names), spotlight items second; items come from `src/data/announcements.ts`.
3. About: see C3.
4. Initiatives ledger "What we run": four rows (Venture Vortex 2026 with an "Open" status chip while active; Valuation Wars; Pitch’er Perfect; The Pitch League with a cover photo once consent is set). Rows are equal citizens in size and style.
5. "From the floor": three-photo strip, one photo per past event, each linking to its event page. Hidden entirely if consent is not set.
6. The dive (kept, reframed, D).
7. Spotlight block: "Now open" Venture Vortex 2026, time-boxed: one block containing the poster (hero-size, not a thumbnail), key facts, countdown, Register button, the round timeline, the compact India map ("Campus to India", from the old Reach section, no pin, on-enter animation) and the event partners with logos. This is the only place on Home that is about the competition. The four-poster wall moves to `/venture-vortex`.
8. Optional, data-driven, hidden when empty: club numbers, team teaser, speakers, testimonials, club partners.
9. Join: closing ledger with three rows (Join the club → Contact box A; Ask a question → Contact box A; Partner with us → Contact box B), contact lines with icons, the small quote in the footer only.
Remove from Home: "Venture Vortex in numbers", the standalone "Backed by", the Posters section, the Home quote band.

## 5. Phase C: Home build details
C1. Keep the tested type scale, ledger style, hairlines, numbered sections (renumber sequentially after removals; no gaps), on-enter masked reveals, no pinned dead scroll. Section gaps use the V7 tokens; re-run the overlap and gap audits.
C2. Numbers: there are no verified club-wide statistics, so no numbers band renders. When the owner supplies founding year, member count, events held, participants (each with a source), render them as one ledger row of proof numbers like IIT Bombay. Never reuse the competition's numbers as club numbers.
C3. **About (Home) right side.** Left: heading "Who we are", the approved lede, link "More about the club". Right: a framed "At a glance" plate that is never empty: the E-Club logo large on a paper plate with the NITW logo only if the emblem flag is yes, then ledger rows with verified facts only: Institute (NIT Warangal, Warangal, Telangana), Faculty mentor (Prof. Altaf Q. H. Badar, Department of Electrical Engineering), Reach us (email), Follow (Instagram, LinkedIn handles). Equal height columns at ≥1024, stacked below. Screenshot at 1366×768, 1440, 1920 and check no dead area.
C4. Spotlight chip, ticker, pill and nav button read their state from `phase.ts` and `spotlight.ts` (single source). The spotlight block's Register button follows the same states as V6 (no "Register" after close).
C5. Copy: rewrite `src/data/copy.ts` so keys are club-generic (`initiatives`, `fromTheFloor`, `join`) and competition copy lives under `spotlight`. Home `<meta description>` and OG default become generic: "E-Club NIT Warangal, the Entrepreneurship Club of NIT Warangal. Think. Connect. Create. Lead." Organization JSON-LD gets `slogan` and no event content.

## 6. Phase D: the dive (keep it, improvise the content)
Keep the tunnel, ring expand, Skip link, reduced-motion and touch fallbacks, and the V7 GPU measures (do not regress frame stats). Reframe content only: the 14 panels are grouped into the four verbs of the motto (Think, Connect, Create, Lead), each group introduced by a caption in mono (verb + one neutral line marked CONFIRM). Heading becomes the motto, not the competition name. The final panel resolves into the spotlight block ("This season's spotlight") with a link, not into a competition hero. Keep the honesty caption "Generated artwork, not a photograph." Re-measure GPU frame time and long tasks as in V7 Phase F and report before/after.

## 7. Phase E: About page (generic, zero Venture Vortex)
Remove every round, date, prize and competition reference. Structure, with a layout that differs from Home:
1. Header: logo lockup (E-Club; NITW only if allowed) and the club line "Entrepreneurship Club - NITW" with "Think. Connect. Create. Lead.".
2. "Who we are": a generic manifesto from the club's own wording only (replace `about.manifesto`; the current one ends with a Venture Vortex sentence). Use: "Entrepreneurship Club is the student community at NIT Warangal for people who build or want to." plus any owner-supplied mission.
3. The four words as four large ledger rows with one short CONFIRM line each, written as a reading of the motto (not claims about activities). Draft, owner approves, e.g. Think: start with the question. Connect: meet the people who can answer it. Create: build the thing. Lead: carry it forward. Keep them short, human, not clichéd.
4. Faculty mentor (confirmed 2 Oct).
5. "What we run": one sentence and a link to `/initiatives`. No initiative names, no competition.
6. "Find us": email, Instagram, LinkedIn with icons; campus line only if verified.
7. Timeline, verticals, founding year: render only when supplied.
Left sticky index at ≥1024. Add `docs/CONTENT-MAP.md` update: each block has one home.

## 8. Phase F: Initiatives and events
- `/initiatives`: filter All / Upcoming / Past (accessible tabs, hash-driven). Rows as in Home but larger, with date and venue only when supplied. Add a short "How to take part" ledger **only** for items whose facts are verified (the Venture Vortex row carries its own link to Unstop).
- `/initiatives/[slug]` for the three events: photo-led as in V7; Event JSON-LD only with a real date. Venture Vortex keeps `/venture-vortex`.
- Implement the sunset rule from section 4 and test it.

## 9. Phase G: `/venture-vortex` landing page
1. **Hero with the poster inside it.** At ≥1024: two columns, left = label, h1, tagline, one-sentence description, prize numeral, countdown, Register and "See the rounds"; right = the official announcement poster at natural ratio, `max-height: 82vh`, hairline frame, `priority`, correct `sizes`, no crop. At <1024: poster directly under the CTAs, before the facts. Delete the poster that currently appears after the hero. Hero total height ≤ 100svh at 1366×768; no empty band above or beside the content.
2. Move the four-poster wall here (the V7 symmetric 2×2, equal frames, with the poster text kept as HTML), after the rounds.
3. Renumber sections sequentially with no gaps (the live page jumps from "Key facts" to 03, then 04, then 06, 07, 08 and Rounds 2 and 3 carry no numbers).
4. Copy fixes: "upstox courses" → "Upstox courses" (check the brand's own capitalisation); keep "Masters' Union"; times in IST in one format.
5. Add `BreadcrumbList`; keep Event JSON-LD tied to `phase.ts`; page meta unchanged except it must not claim registration after close.
6. Spot-check every state with the fake clock (V6 test) after the layout change.

## 10. Phase H: Contact page, two separate boxes
Layout: top row = contact ledger (email, Instagram, LinkedIn) with 20px inline icons beside each row (not above headings, not in circles), copy-email button with live-region confirmation. Below: **two boxes side by side at ≥1024, stacked below**, visually distinct, each with its own heading, fields, submit button, validation, success and error states:
- **Box A "Contact and queries"** (paper surface): `reason` radio (Ask a question / Join the club / Say hello), name, email, message. Anchors `#contact`, `#join`; `#join` pre-selects "Join the club".
- **Box B "Sponsorship and partnership"** (ink surface, orange accent): name, role (optional), organisation (required), website (optional), email, interest (Sponsor an event / Partner on an initiative / Media / Other), message. Anchor `#sponsor`. Shows the sponsorship brochure link only if `site.brochureUrl` is set.
No four-tab selector (replace the V7 tabs). API: `POST /api/contact` keeps the `type` enum; Box A sends `query`, `join` or `contact`; Box B sends `sponsor`. Same origin allowlist, size cap, honeypot, rate limit, no IP storage, mailto fallback. Update tests (types, bad type, long fields, honeypot, rate limit, fallback), `docs/DATA-INVENTORY.md` (fields: role, interest) and `LEGAL-REVIEW-NOTES.md`. The "Under 18" notice stays hidden until `noticeApproved`.
Test keyboard flow, screen-reader labels (`aria-describedby` errors), success live region, 360 to 1920, and a live-mock submission for each box.

## 11. Phase I: Gallery
The gallery contains **only** the 18 photos from `raw-media/Valuation Wars`, `raw-media/Pitcher perfect`, `raw-media/The pitch league` (six each) and nothing else: no generated art, no posters, no old media. Verify `src/data`, `public/` and the build output for leftover old gallery assets and remove them (git history keeps them). Photos render only when `photoConsent` is set (flag in the launch line); with it unset, the existing honest empty-state shows. Pipeline: `scripts/build-events.mjs` already produced `src/data/event-photos.ts`; re-run it, and **check source dimensions**: the files are WhatsApp exports around 60 to 150 KB; never upscale (a 1600px output from a ~1000px source is upscaling: cap at native width and fix the recorded `w/h`). File-name oddities in the folders ("WhatsAp Image", "WhatsAppImage") must not break the script; if two files are duplicates (check "WhatsAp Image 22.11.19" vs "WhatsApp Image 22.11.19"), say so and ask rather than guess. Strip EXIF. Keep alt text descriptive (view each image again and correct any alt that is wrong). Layout: grouped by event, accessible filter, native `<dialog>` lightbox, consistent frames, no empty cells for 6 photos per group (use a 3×2 or 2-1-3 arrangement that fills the row at every width).

## 12. Phase J: logos (exact files, all in `raw-media/logos/`)
`eclub-logo.jpeg` (E-Club, JPEG: no transparency), `nitw-logo.webp` (41 KB) and `nitwlogo.jpeg` (12 KB) (NITW: choose the sharper, say which), `masters union logo.png`, `school2startup logo.jpeg`, `unstop logo.jpeg`. View every file first.
- **E-Club logo:** the owner's file. Remove the flat background cleanly if the background is a solid colour (flood-fill from the corners with tolerance, feather 1px, check at 4× on ink and paper for halos); if the result is not clean, place the logo as-is on a paper plate and list "send a PNG/SVG with transparency" under Needs the owner. Output WebP/PNG, ≤ 400px for nav, ≤ 800px for lockups, with width/height and alt "E-Club NIT Warangal logo". Replace the site's bar glyph in nav and footer. Favicon and OG image use it if legible at 32px.
- **NITW emblem:** processed the same way; shown only when `site.showInstituteLogo` is true (flag). Placement: footer lockup, About header lockup, Home About plate.
- **Partner logos:** to `public/images/partners/<slug>.webp`, set `logo` and `consent` per the flag. Render every partner logo in an equal white plate cell (this hides JPEG backgrounds), logo `object-fit: contain`, role in mono above, wordmark fallback for Uplearn by Upstox and Technozion (no logos supplied). Equal cell size, hairline frame, trademark disclaimer line kept, shown in the Home spotlight block and on `/sponsors` event-partners block only.
- Do not use any logo outside `raw-media/logos` (a `LOGO.png` found earlier in a Downloads folder is the owner's other business: never use it).

## 13. Phase K: filling the site honestly
The site fills from data the owner supplies. Make that cheap:
- Create/refresh `docs/CONTENT-INTAKE.md` section "V8: ten answers that fill the site": founding year; one-line mission; number of members; number of events held and typical participation (with a source for each number); the three events' dates, venues, one-line format, names of speakers/judges the club may publish; team roster (name, public role, batch) and which people agree to a portrait; testimonials with permission; club-wide sponsors/partners; recruitment form link; what happens after someone writes to the club.
- Every section that depends on these is built, data-driven and hidden until filled; list them in `docs/CONTENT-GAPS.md` with the data field that unlocks each.
- Do not pad with generic marketing prose. Prefer structure, ledgers and verified facts.

## 14. Phase L: verification (report each with how it was run)
L1. tsc, lint, build, `npm audit`, all API tests, existing `type-audit`, `qa-v5` (update its photo rule: photos only on `/gallery`, `/initiatives/*`, Home "From the floor"), contrast/axe, `overlap-audit`, `gap-audit`, V6 fake-clock tests (add 1 Nov and 8 Nov), vortex frame stats.
L2. **`scripts/qa-v8-generic.mjs`**: render every route with `next start`; strip `<header>` (nav button is allowed) and the allowlisted blocks; fail if any banned term from section 2 appears in the remaining HTML or in JSON-LD of non-allowlisted routes. Run it and show the output.
L3. Playwright on Chromium, Firefox, WebKit at 360, 768, 1024, 1366×768, 1440, 1920; keyboard-only run through the two contact boxes, the Initiatives filter, the gallery dialog; reduced motion; no-JS render.
L4. Lighthouse mobile median of 3 for `/`, `/about`, `/initiatives`, an event page, `/gallery`, `/contact`, `/sponsors`, `/venture-vortex`: ≥ 90 performance, ≥ 95 accessibility, 100 SEO. Initial JS ≤ 195 KB gz.
L5. After merge-ready push, compare the Preview and, once the owner merges, production HTML against the local build (A1 method).
L6. Read every after-screenshot yourself in `docs/handoff/v8/after/`. Any overlap, empty band, clipped text, misaligned poster or half-empty column is a failure even if scripts pass.

## 15. Deliverables and report
Commits per phase; push after A, C, G, H and the last phase. `docs/handoff/BUILD-LOG-V8-<date>.md` (what changed, evidence table, decisions, Not tested, Needs the owner, rules bent). Updated `docs/V8-ANALYSIS.md`, `CONTENT-MAP.md`, `CONTENT-GAPS.md`, `CONTENT-INTAKE.md`, `LEGAL-REVIEW-NOTES.md`, `DATA-INVENTORY.md`. Chat reply under 25 lines: top three findings first, then `NEXT ACTION` and `FOLLOW-UP PRIORITY`; at most two blocking questions, only if the answer changes work you cannot otherwise do.

## 16. Order of execution
A → B (data model: spotlight, announcements, sunset) → J (logos, quick visible win) → C → D → E → F → G → H → I → K → L.
