# OVERNIGHT V7: POLISH, CONTENT DEPTH, EVENTS, BRAND (E-Club NIT Warangal)

Launch line: `Read AGENTS.md, docs/handoff/SESSION-HANDOFF*.md, BUILD-LOG-V5 and V6, and this file fully. Check whether claude/v6-2026-10-02 is merged into main (git branch --contains). Branch claude/v7-<date> from main if merged, otherwise from the v6 branch (V6 owns src/lib/phase.ts and must not be lost). Execute in order. Verify by running. Report with evidence.`

## 0. Context
V5 design approved. V6 (security, deadline state machine, partner spelling "Masters' Union", Firefox/WebKit tests) is pushed; owner merges it. V7 = owner review feedback from the live site after V6: fix defects, remove what lags, fill emptiness with real content, restructure partners, add three events with photos, wire logos and club quote. **Nothing is redesigned from scratch**: keep palette, fonts, ledger language, hero, nav pill, floating register pill. Today is 3 Oct 2026 (registration closes end of today IST). Do not break `phase.ts`.

## 1. Owner requests R1..R20 (each closed with evidence)
R1 Mouse circle lags: remove all custom cursor UI (Phase C).
R2 Plant growth on left odd: new hanging vine (Phase E) or removal.
R3 Topic 2: on-enter animation not scroll; "50,000" overlaps "Prize pool"; many overlaps: fix + automated overlap audit.
R4 Empty space between topics: tighten rhythm, no pinned dead scroll.
R5 Topic 5 (map) too small; time-based playback.
R6 Topic 6 (vortex) GPU diet, measured.
R7 Topic 7: 4 posters symmetric; remove "Open" cursor.
R8 Topics 8, 9 empty: rebuild with real content.
R9 Inner pages repeat Home: content-ownership map, zero duplicated blocks.
R10 Site looks empty: fill with verified material only.
R11 Six photos per event for three events.
R12 Event names: Valuation Wars; Pitch'er Perfect; The Pitch League.
R13 Wire in E-Club logo PNG and NITW logo PNG.
R14 Remove long "ECLUB----- nit warang..." text from nav; "ECLUB NITW" fine.
R15 Get in touch: interactive and full; Instagram, LinkedIn, Gmail icons beside contacts.
R16 Remove the "18 or older" checkbox.
R17 Contact boxes: Join the club, Query, Contact, Sponsor/Partnership.
R18 Unstop, Masters' Union, School2Startup are only Venture Vortex partners; club may partner with others later: event-scoped model.
R19 Club quote: "Entrepreneurship Club - NITW / Think. Connect. Create. Lead."
R20 Increase sizes where required; look filled; gap, overlap and fill audits.

## 2. Rules for this run (delta; AGENTS.md still applies)
- No invented facts. Event dates, venues, counts, winners, descriptions unknown unless in `docs/CONTENT-INTAKE.md`. Missing = data `null` + `TODO(owner)`; UI omits the line.
- Owner decision overrides V5 "raw photos only in Gallery": raw event photos may appear on `/gallery`, `/initiatives/[slug]`, and one cover per event in the Home events ledger. Not hero, vortex, posters. Update qa-v5/audit scripts deliberately and say so in log.
- No new runtime dependency without stating gzip cost; initial JS <= 195 KB gz on `/`. No cursor libs, no animation libs.
- Motion: one easing cubic-bezier(.16,1,.3,1); transform/opacity/clip-path; small-SVG stroke-dashoffset the only allowed paint-property animation. "Spontaneous" = time-based playback once on entering viewport (IntersectionObserver), not scroll-scrubbed. Full prefers-reduced-motion (final state).
- Still banned: gradient blobs, glass card grids, icon-in-circle above headings, emoji icons, identical 3-up grids, cliches, stock people, particle fields as star, personal phones, WhatsApp link, Drive embeds.
- Do not touch CSP, .github, CI, env unless required; show exact diff in log first. Never loosen CSP.
- Do not write/alter legal text. Update DATA-INVENTORY.md and LEGAL-REVIEW-NOTES.md for reviewer.
- Never push to main. Push branch after each phase. Tests run on local production build (`next start`), never `next dev`.

## 3. Phase A baseline
A1 Build prod locally; screenshot every route at 360/768/1024/1440/1920 into docs/handoff/v7/before/.
A2 scripts/overlap-audit.mjs (Playwright): per route+width, rects of text-bearing elements and images inside each section; report pairs intersecting > 2px unless both `data-overlap-ok`. Run, record failures.
A3 scripts/gap-audit.mjs: per section vertical blank gap between last content box and next first; % blank height. Fail: gap > 160px at >=1024 or > 96px at 360-768; any section > 35% blank. Run, record.
A4 GPU baseline for vortex: CDP tracing while scrolling 10 s: avg/p95 frame time, GPU busy %, draw calls, texture memory, canvas size x DPR. Log WEBGL_debug_renderer_info; report Intel/integrated vs NVIDIA.
A5 Inventory pointer-following elements.

## 4. Phase B overlap and spacing
B1 Fix overlaps at root: stat numerals/labels in CSS grid with explicit rows, line-height >= 1, no negative margins, no absolute labels over numerals. clamp() + container-query units so "₹50,000", "30–31 Oct", "2–4" never overrun 360..1920. Prize numeral on own row above "Total prize pool".
B2 tokens.css: `--section-y: clamp(56px,7vw,104px)`; heading-to-content gap clamp(24px,3vw,40px). Apply to all sections. Remove min-height:100vh, spacer divs, pin-spacers creating dead scroll.
B3 Re-run A2, A3 until pass. Keep scripts.

## 5. Phase C remove custom cursor
Remove follower circle and every pointer-following UI (incl. "Open" label on posters). Native cursors, clear :hover/:focus-visible (underline slide, 2px offset, <=4px lift). Log reason (follower trails native cursor by a frame; removing it removes per-frame main-thread task). Verify no pointermove listeners remain except required (list).

## 6. Phase D Home sections (keep numbering/order)
D1 Hero: keep. Replace tagline with "Think. Connect. Create. Lead." Countdown must not flash "–": server-render value from phase.ts.
D2 02 Numbers: no scroll-linked animation; on enter numerals count up (<=900ms) and hairlines draw once. Keep label "Verified facts about this year's flagship. Not lifetime club figures." Overlap-free. Tight: five stats in one ledger row at >=1024, two columns below.
D3 03 About teaser: keep masked reveal. Home carries one paragraph, quote band (G3), a link.
D4 04 Initiatives: ledger: Venture Vortex 2026 (flagship, poster) + three events as rows with cover photo, name, date if known. Row hover: in-place image reveal. No 3-up cards.
D5 05 Reach map: non-pinned block; map SVG >= 88% content width desktop, >= 92vw mobile; two-column (map left, round ledger right) >=1024, map above on mobile. Time-based on enter: Round 1 and 2 regions glow in sequence (~2.5s), contract to Warangal pin (~1.5s), no loop, "Replay" text button. Reduced motion: final state. Keep map outline source and faculty-review note in log.
D6 06 Flagship vortex: keep look; GPU diet (F). Facts block no overlap, no dead gap.
D7 07 Posters: exactly four, symmetric 2x2 at >=768 (centered, equal gaps clamp(16px,2vw,32px)), 1 col <600 or 2 col 600-767. One identical frame ratio (e.g. 4:5) object-fit: contain on ink mat. Keep "Poster text" HTML. No cursor effects.
D8 08 Partners: see H.
D9 09 Join: closing section: quote large, three ledger rows (Join the club / Ask a query / Partner with us) deep-linking to Contact tabs, plus three contact lines with icons (K1). Fill the width.
D10 Footer: remove invented line "Every company starts as an argument in a room." -> the quote; logo lockup (G2); remove duplicate partner list.

## 7. Phase E hanging vine (replaces sapling rail)
Vine hangs from top-left corner of viewport, fixed, pointer-events none, aria-hidden, behind content, >=1100px only. One SVG, <=40 nodes; tapering stem, gentle S-curve, mirrored alternating leaf pairs at constant interval, 8-12 leaves, one orange (accent) bud at tip. Teal strokes, orange only on bud. Grows with page progress (animation-timeline: scroll() where supported; fallback IntersectionObserver class steps, no per-frame JS). Idle sway +-2deg via transform (disabled reduced motion). One-time unfurl on load. Budget: one compositing layer, no layout reads, zero long tasks. Three candidates (A vine, B plumb-line, C pennant), screenshot at 1440, pick best, record why. If budget not met or not clearly better than nothing: remove rail entirely (pre-approved); say which.

## 8. Phase F vortex GPU diet (keep look)
Measure before/after with A4. In order, keep only what helps: 1 render only in view, demand-driven, no idle rAF; 2 DPR cap 1.25 (1 on low-power), smaller tunnel buffer, fps cap 45-60 adaptive (30 if >20ms for 30 frames); 3 textures <=1024 long side WebP, mipmaps off for non-minified, lazy upload in idle, dispose off-screen; 4 reuse quad geometry and material per texture, cull outside depth window (<=5 drawn), avoid large alpha-blended layers, powerPreference high-performance, antialias false; 5 no post-processing, no per-frame allocation, no shadows/lights; 6 capability gate: hardwareConcurrency<=4, deviceMemory<=4, Save-Data, reduced motion, integrated-GPU renderer -> stacked static version; 7 context loss re-test. Report p95 frame time, GPU busy %, long tasks in 10 s scroll at 1x and 4x CPU throttle, before vs after. State what remains uncertain on owner's machine.

## 9. Phase G brand
G1 Nav: E-Club logo mark + text "E-Club NITW" (single line, no truncation) 360..1920. Pill, Venture Vortex button, menu stay.
G2 Logos: locate owner's E-Club logo PNG and NITW logo PNG (raw-media, public, docs, repo root; report paths; if missing stop and list under Needs the owner). Optimise (<=400px nav, <=800px lockups), width/height, alt "E-Club NIT Warangal logo"/"NIT Warangal logo". Check legibility on ink and paper; dark-on-transparent -> paper plate, do not recolour. Placement: nav (E-Club mark only), footer lockup (E-Club x NITW with "Entrepreneurship Club, NIT Warangal"), About hero lockup, favicon if legible at 32px. NITW emblem behind data flag `site.showInstituteLogo`; list in LEGAL-REVIEW-NOTES.md.
G3 Quote: "Entrepreneurship Club - NITW" and "Think. Connect. Create. Lead." (owner-supplied 3 Oct 2026; record source in data file). Place: hero line, full-width Home typographic band (four words revealed in sequence on enter, 700ms, 120ms stagger), About hero, footer, Organization JSON-LD `slogan`. Not meta description.

## 10. Phase H partners vs sponsors
`src/data/partners.ts`: scope 'venture-vortex-2026' | 'club', role, name, href?, logo?, consent. Unstop (Powered by), Masters' Union (In collaboration with), School2Startup (Outreach partner), Uplearn by Upstox (Knowledge partner), Technozion (festival) all scope venture-vortex-2026. club scope empty.
Home 08: heading "Venture Vortex 2026 partners", subline "Partners of this competition. Club-wide sponsors are listed on the Sponsors page." Large hairline-framed equal logo cells; logo if file exists else wordmark in display type; role in mono above. Pick up from public/images/partners/<slug>.png|webp without code changes. Keep trademark disclaimer.
/sponsors: "Club sponsors and partners" (honest empty state + Sponsor/Partnership CTA) and "Venture Vortex 2026 partners". Remove footer partner list. Organization JSON-LD must not list event partners as club sponsors; Event JSON-LD for Venture Vortex may reference them accurately. Home must not repeat partner block elsewhere.

## 11. Phase I content ownership
docs/CONTENT-MAP.md: every block has exactly one home. Home = teaser + deep link; inner page = full treatment with different layout.
About: quote manifesto; Think/Connect/Create/Lead four-row ledger via verified activities (Think = Round 1 startup teardown; Connect = live pitch to founders/experts in Round 3 plus partners; Create = Round 2 strategy build; Lead = boardroom defence) labelled "how we read our quote"; faculty mentor line (Prof. Altaf Q. H. Badar); logo lockup; campus facts with cited source (nitw.ac.in). Layout: long-form two-column editorial, sticky index left.
Initiatives: Venture Vortex flagship + three events; ledger with filters (All/Flagship/Events). `/initiatives/[slug]`: photo-led (one large photo, thumbnail strip, facts ledger). Venture Vortex page: rounds, rules, judging, FAQ, 50 startups (existing). Team: roster owner-supplied; if empty, "who runs this" with known roles. Sponsors: H. Gallery: J4. Contact: K.
Fill rules: no paragraph unless every fact is in a data file with source. Prefer ledgers/timelines/FAQs. Add "How to take part" ledger and short FAQ on /initiatives from verified Venture Vortex rules. docs/CONTENT-GAPS.md lists what owner must supply.

## 12. Phase J events and photos
J1 Names/slugs: "Valuation Wars" (valuation-wars), "Pitch’er Perfect" (typographic apostrophe in display; slug pitcher-perfect; plain apostrophe where needed), "The Pitch League" (the-pitch-league). `src/data/events.ts`: name, slug, date(null), venue(null), summary(null), photos[] (6 each), status. Use only CONTENT-INTAKE facts.
J2 Photos: folders in raw-media per event. View every image. Strip EXIF, resize <=1600, WebP, 640/960/1600 variants, blur placeholder, fixed aspect classes (3:2, 4:5) object-cover with focal point, descriptive alt, `consent: 'club-confirmed'` only if owner confirmed for this batch (Q1) otherwise not rendered, list under Needs the owner. Reject blurry/duplicate/sensitive, say which. Remove old photo references from media.ts and delete old optimised files from public/.
J3 Event pages: static via generateStaticParams; one h1, metadata, BreadcrumbList; Event JSON-LD only with real date; sitemap. Keyboard-operable thumbnails.
J4 Gallery grouped by event with accessible filter (All + 3), 18 photos, native <dialog> lightbox with focus return/Escape, lazy below fold, correct sizes. LCP not a gallery image.
J5 Home events ledger uses one cover per event.

## 13. Phase K contact
K1 Left: contact ledger with icons beside rows: email e_club@nitw.ac.in, Instagram @eclubnitw, LinkedIn "Entrepreneurship Club-NIT Warangal" (inline SVG glyphs 20px aria-hidden; not above headings, not in circles). Neutral envelope glyph for email. "Copy email" button with live-region confirmation. Right: form. Campus line "NIT Warangal, Telangana" only with address verified from nitw.ac.in (cite).
K2 Four tabs (accessible tablist, hash #join #query #contact #sponsor): Join the club, Query, Contact, Sponsor/Partnership. Fields: name, email, message; Join adds optional branch and year; Sponsor adds organisation (required) and optional website. No phone. Honeypot + rate limit stay. Inline errors via aria-describedby; success live region; mailto fallback.
K3 18+ checkbox removed (owner decision). Replace with single quiet line under submit linking to Privacy Policy, shipped as data `forms.noticeLine`, flagged in LEGAL-REVIEW-NOTES.md as owner-requested removal of an explicit consent control, to be reviewed against DPDP Act 2023. No age field. Do not claim compliance.
K4 API: POST /api/contact adds `type` enum + optional fields; explicit allowlist; reject unknown fields; max lengths; store type in Firestore; same origin allowlist, body cap, rate limit, no IP storage. Tests per type, bad type, over-long, honeypot, rate limit, fallback. Update DATA-INVENTORY and LEGAL-REVIEW-NOTES. No email notifications.
K5 "What happens next" ledger only if owner supplies the process; hash preselects tab; keyboard test.

## 14. Owner questions
Q1 (blocking for publishing photos): consent for everyone visible in the 18 photos; per event date, venue, one-line format. Until answered: photos render only if `consent` set; facts omitted. Build so one data edit publishes.
Q2 (blocking for NITW logo): written institute permission. Build behind `site.showInstituteLogo`.
Decided: cursor removed; hero tagline = quote; email glyph not Gmail logo; 18+ checkbox replaced by reviewed-notice line; event photos allowed on Gallery, event pages, Home cover; partners scoped to Venture Vortex.

## 15. Phase L verification
tsc, lint, build, npm audit; type-audit, qa-v5 (updated), overlap-audit, gap-audit, contrast/axe 360/768/1440, phase fake-clock tests, API tests; Playwright Chromium/Firefox/WebKit at 360/768/1024/1440/1920; keyboard walkthrough; reduced-motion; no-JS; Lighthouse mobile median of 3 on /, /about, /initiatives, an event page, /gallery, /contact, /sponsors, /venture-vortex (>=90 perf, >=95 a11y, SEO 100); initial JS <=195 KB gz; vortex frame stats; broken-link crawl. Screenshots to docs/handoff/v7/after/ and LOOK at them. List what was not tested.

## 16. Deliverables
Commits per phase; push after B, D, G, J, K. docs/handoff/BUILD-LOG-V7-<date>.md (changes, evidence table, before/after, decisions, Not tested, Needs the owner, rules bent). docs/CONTENT-MAP.md, docs/CONTENT-GAPS.md, updated DATA-INVENTORY, LEGAL-REVIEW-NOTES, CONTENT-INTAKE template. Chat reply < 25 lines: top 3 findings, NEXT ACTION, FOLLOW-UP PRIORITY; at most two blocking questions.

## 17. Execution order
A → B → C → G → D → H → E → F → I → J → K → L. If cut short, the branch must still build; push after each phase.
