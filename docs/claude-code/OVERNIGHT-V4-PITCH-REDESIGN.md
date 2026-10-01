# OVERNIGHT V4: "THE PITCH" REDESIGN (typography, concept, art direction, every page)
Start with: `Read AGENTS.md, docs/CONTEXT.md, docs/DESIGN.md, docs/PARITY.md, docs/RESEARCH-V3.md, docs/claude-code/OVERNIGHT-V3-DESIGN-OVERHAUL.md, BACKEND-ADDENDUM.md and this file fully. Continue from branch claude/overnight-v3-2026-10-01 (create claude/overnight-v4-<date> from it). Execute unattended; log every judgment call.`
Owner review of V3 (1 Oct 2026): liked the animations and the overall direction; says it is still not close to the F1 / IIT E-Cell level, typography is "all one font, big and flat, like a pale PPT", the event photos look unprofessional everywhere, wants the earlier 3D (rising bars) back, wants the AI-generated art used, wants every tab designed properly. This file wins over V3 where they conflict.

## 0. Diagnosis from the owner's three screenshots (fix all)
1. **One voice everywhere.** Every heading is the same condensed uppercase face at the same weight, so nothing is more important than anything else. The manifesto is five lines of identical shouting. Fix: a real type system (section 3) with 4 voices and a rule of ONE mega-uppercase moment per viewport.
2. **Nav pill is see-through.** In shots 2 and 3 the headline text shows through the nav and collides with the labels. Fix: nav surface = ink at 88-92% opacity, `backdrop-filter: blur(18px) saturate(1.2)`, 1px hairline border, solid enough that no text underneath is legible; hide on scroll-down, reveal on scroll-up; never overlap content (use `scroll-padding-top` and top padding).
3. **Hero.** Classroom-photo letters read as documentation, not premium. Fix: replace with generated art + 3D (section 5).
4. **Flagship block.** The heading is clipped by the nav, the coin floats in a thin ring with no staging, the body copy is small and mid-grey on dark. Fix with staging, hierarchy, lighting.
5. **Event photos** are flat beige classroom phone shots. Policy in section 6.
6. **Generic particles** are a loser in 2026 awards commentary (see research note). Keep the vortex particles only as a supporting layer under real objects, not as the show.

## 1. Research (do first, 60 min, real browser, record in docs/RESEARCH-V4.md; list only URLs you opened)
Planning-session findings (medium confidence, blog sources, not first-hand): 2026 award-winning sites commit to ONE strong visual concept rather than stacking effects; scroll-driven narrative dominates; generic particle backgrounds, templates and ignoring mobile/accessibility lose. A June 2026 roundup (utsubo.com) lists Three.js/R3F winners, including Cartier Watches & Wonders 2026 (scrollable 3D alcoves by Immersive Garden), a Hubtown real-estate site (glowing 3D monolith over water), Sleep Well Creative (scroll-driven illustrated 3D narrative). Verified first-hand earlier: landonorris.com (playable intro, giant wordmark, captioned photography, hover-swap pairs, single accent, big closing line).
Your job: open and audit landonorris.com again for TYPE (computed font sizes/weights/tracking per element, line-height, case), COLOUR (sampled), and MOTION; then find and open at least 4 of the 2026 winners above or similar (search for them), plus IIT Madras / Bombay / Hyderabad / Guwahati E-Cells. For each: type scale actually used, number of typefaces, hero concept, scroll mechanic, cursor behaviour, image treatment, what a student visitor feels in 5 seconds. Extract principles, never assets or code. End with a one-page "what we adopt / reject".

## 2. The concept: THE SITE IS A PITCH DECK
An entrepreneurship club's site that scrolls like a founder's pitch, chapter by chapter, each chapter a distinct visual scene. Slide counter in the nav ("04 / 09"), numeral + mono title per chapter, thin progress rail. It is on-brand (Venture Vortex's Round 1 is literally a deck), original, and gives each section a different 3D/visual idea instead of repeating one trick.
Chapters on Home (names are working titles; copy is CONFIRM until the owner approves):
- **01 Cover:** hero. Wordmark + the Rising Ledger 3D (bars rise, brass coin, reflective floor, orange rim light; this restores the earlier 3D the owner liked, now with studio lighting and the generated poster as fallback). Mega E-CLUB wordmark sits in front at low opacity edge, bars behind/around it. Pointer parallax; "Hold to dive" optional.
- **02 The Problem:** manifesto, split layout: big question line (serif) + three small mono-labelled statements; generated "Manifesto background" art as a low-contrast backdrop; text contrast >= 7:1.
- **03 The Solution (who we are):** club description (CONFIRM), verticals as ledger rows, hairlines draw on scroll.
- **04 Traction:** verified numbers only. If none are supplied, render the Rising Ledger bars as an explicit decorative illustration with no axis or numbers, labelled "Illustration" in mono; never imply fake growth.
- **05 Product (Events):** events ledger, hover-swap using generated art covers until real cover art exists; real event photos only per section 6.
- **06 Flagship:** Venture Vortex. Full-bleed dark stage using the "Pitch-stage abstract" art, the Blender coin on a lit pedestal, countdown, prize figure, Unstop CTA.
- **07 Moments:** the curated Dive/rail (section 6), reduced to <= 8 frames.
- **08 Investors (Partners):** sponsor marquee (consent only) over the "Sponsors band" art.
- **09 The Ask:** two big cards-as-rows: Join the club / Partner with us. Footer: huge closing line (3 CONFIRM options in `src/data/copy.ts`) + "Thank you / Questions?" mono tag.
Each chapter has its own composition; no two adjacent chapters use the same layout. Keep the Dive tunnel as an optional transition between 06 and 07 only if it still reads premium with the curated frames; otherwise cut it and say so.

## 3. Typography system (the main fix)
Fonts: Bricolage Grotesque (variable: verify `wdth` 75-100 and `wght` 200-800 axes are actually loaded; if the self-hosted subset dropped an axis, restore it), Instrument Sans (body), JetBrains Mono (labels), plus **Instrument Serif regular (roman)** via `next/font` for pull-quotes/ledes only (approved new font; roman only; the banned trick is one italic word inside a sans headline). Subset, `display: swap`, preload only the hero-critical weights.
Four voices and strict rules:
| Voice | Spec | Use |
|---|---|---|
| Impact | Bricolage wdth 75, wght 800, UPPERCASE, tracking -0.02em, line-height 0.86, `clamp(5rem, 18vw, 20rem)` | wordmark, giant numerals, one hero stat. **Max one per viewport.** |
| Headline | Bricolage wdth 100, wght 600, sentence case, tracking -0.025em, line-height 1.02, h1 `clamp(2.75rem, 6.5vw, 6rem)`, h2 `clamp(2rem, 4.2vw, 3.75rem)`, h3 `clamp(1.5rem, 2.4vw, 2.25rem)` | all section headings |
| Lede/quote | Instrument Serif regular, 1.15 line-height, `clamp(1.5rem, 2.6vw, 2.5rem)` | pull-quotes, chapter ledes, closing line |
| Body | Instrument Sans 400, 17-19px / 1.6, measure <= 62ch | paragraphs |
| Label | JetBrains Mono 500, 11-12px, UPPERCASE, +0.14em | chapter numbers, captions, nav section label, metadata |
Hierarchy rule: per section exactly one dominant element, one secondary, one supporting. Size contrast between levels >= 1.6x. Never set paragraphs in uppercase or in the Impact voice. Mix weights inside a block deliberately (e.g. a 300-weight line followed by a 700-weight key phrase) to create rhythm. Left-aligned, asymmetric, generous whitespace; text blocks anchored to a 12-col grid with 8-10% outer margins.
Colour roles for text: on ink, headings paper `#f5f1e6`, body paper at 78% (verify >= 7:1 large / 4.5:1 small), labels mist `#9fb8ba`, accent orange `#ed9038` on <= 2 words per viewport and large text only. On paper, text ink `#0b2226`; orange never as small text on paper (fails contrast); introduce an "orange-ink" token (darkened, passes 4.5:1) for small accent text on paper. Cyan only for light effects/data lines, never text. Update `tokens.css` via a clearly logged change. Add `docs/TYPE-SYSTEM.md` with the table and screenshots of each voice in context.
Implement as utility classes/components (`<Display/>`, `<H1..H3/>`, `<Lede/>`, `<Label/>`) so pages cannot drift; grep and remove ad-hoc font sizes.

## 4. UI components to rebuild or add
Nav (opaque-enough, hide/show, slide counter, progress rail); chapter header component (numeral + label + rule); caption component; ledger row; hover-swap tile; label cursor (VIEW/DRAG/PLAY); hold button; marquee; stat block; pull-quote; footer with giant statement; toast; form fields (floating labels, visible focus, 44px, inline errors). Buttons keep pill + orange sweep but add size scale (L/M/S) and an icon-only square. Check every interactive state (hover, focus-visible, active, disabled, loading) for every component and screenshot a "states sheet".

## 5. 3D and art direction
- **Restore the Rising Ledger** (bars, coins, reflective floor) as the hero 3D, upgraded: PBR materials, proper HDRI lighting (<= 200 KB, CC0 from Poly Haven, licence logged), soft contact shadows, orange rim + cyan fill, subtle bloom only if it costs < 2 ms/frame, DPR cap, lazy after LCP. Use the Blender MCP for the bars and coin with bevels, brushed-brass and matte-ink materials; export .glb quantized (no decoder), <= 300 KB each; render a matching hero poster from the same scene (the poster IS the LCP image).
- **Generated art** in `raw-media/generated/` (7 files now; more coming from `docs/art/ART-AND-COWORK-PROMPTS.md`) must be used, converted to AVIF/WebP at 1600/2400 widths with blur placeholders, and mapped: Hero poster -> hero fallback/backdrop; Manifesto background -> chapter 02; Pitch-stage abstract -> chapter 06 + Events page header; Vortex texture -> flagship and the vortex portal; Sponsors band -> chapter 08 + Sponsors page; Workshop/ideas -> About and Join; Paper texture tile -> paper sections. View each image before use; if one is weak, log it and tell the owner which prompt to rerun. Add a consistent grade: same ink-teal shadows, warm highlights, 3-4% grain via CSS overlay.
- Particles: keep the vortex ring but slimmer; it must not be the star of any scene.
- A section may use at most one WebGL canvas alive at a time; others are posters until in view.

## 6. Event photo policy (owner: they look unprofessional)
- Remove event photos from: hero, manifesto, team page (do NOT show a session photo under "The people behind the club"), event covers, ledger, partner sections.
- Keep only: (a) Gallery page and individual event pages, shown properly as a documentary archive; (b) one **Moments** chapter limited to the <= 8 best frames, chosen by technical quality (sharpness, exposure, composition), all given one unified treatment (monochrome or duotone ink-teal + grain, orange caption), displayed large with place/date captions only where known.
- Exclude the frame with the student in the checked dress and any close-up that could embarrass someone; list exclusions in the log. No faces guessed or named.
- Team page: until the roster and portraits exist, show a typographic roster layout with TODO rows hidden, plus a clear "Roster coming" state; no substitute photos.
- Event cards: use generated art or typographic covers until real cover art exists.

## 7. Per-page spec (apply the type system, nav, grade, states; each page: unique h1, one dominant visual, mono label system, empty states)
- **Home:** chapters 01-09 above.
- **About:** header with workshop art, "Who we are" Lede in serif, verticals as ledger rows, timeline only with club-supplied dates, "How to join" block. No invented history.
- **Events:** header with pitch-stage art, filters (year/type) as mono chips, ledger rows with hover-swap, event detail template (hero, facts strip, description, gallery, video facade, related).
- **Venture Vortex page:** keep `data-theme="vortex"` scoped; do not restyle it with club tokens.
- **Team:** typographic roster, role groups, hover reveal of a handle link; portraits only with consent and quality.
- **Sponsors:** tiers as ledger rows, logos with disclaimer, "Partner with us" panel with a mailto/brochure slot (no phone numbers).
- **Gallery:** masonry, filters by event, lightbox (keyboard, swipe, focus trap), captions.
- **Contact / Join:** big Lede, form UI (backend later), 18+ consent, success/error states, email link.
- **Legal:** plain readable template, noindex until reviewed.
- **404:** on-concept ("Slide not found") with link home.
Verify every internal link, every button, every form state, every heading level.

## 8. Content
Copy only from verified facts and owner-supplied text in `docs/CONTENT-INTAKE.md` (still empty as of V3). Write in the club voice: short, specific, first-person plural, dry confidence, no clichés. Draft 3 options per key line (CONFIRM) and use the first. Update `docs/COPY-REVIEW.md`. Do not invent founding year, numbers, events, quotes.

## 9. Overnight protocol and gates
Same protocol as V3 sections 8-10 (single branch, never push to main, never open a PR, no CI/CSP/env/.github changes, time-box 90 min per chapter, running BUILD-LOG-V4, morning summary). Backend stays out of scope. Gates as V3 section 9 PLUS: type audit (script that lists every distinct font-size/weight/family used in the built CSS and fails if more than the token set), contrast audit (axe + computed contrast on every text node in screenshots), nav-overlap test at 360/768/1440 (no content under the nav at rest), reduced-motion and mobile screenshots of every chapter, and a before/after screenshot sheet for each page. Initial JS <= 195 KB gz/route; LCP target 2.5 s with a deployed-preview measurement if the push works (if not, say so). Be candid in the summary about anything still weak. Never claim flawless.

## 10. Never
Invent facts; use banned fonts (Inter, Poppins, Space Grotesk, Oswald) or the italic-serif-word trick; gradient blobs or aurora; glass card grids; emoji icons; stock people; show a phone number; loosen CSP; ship a canvas without a poster fallback; use event photos outside section 6.
