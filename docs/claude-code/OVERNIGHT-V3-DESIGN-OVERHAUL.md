# OVERNIGHT V3: DESIGN OVERHAUL (unattended, auto mode)
Start with: `Read AGENTS.md, docs/CONTEXT.md, docs/DESIGN.md, docs/PARITY.md, docs/claude-code/MASTERPROMPT-V2.md, docs/claude-code/BACKEND-ADDENDUM.md and this file fully. Confirm the Blender MCP status, then execute. Do not stop to ask questions; log every judgment call.`
Owner decisions dated 1 Oct 2026. Where this file conflicts with V2 or AGENTS.md, this file wins on the items listed in section 2 only.

## 0. Diagnosis (why the current build feels pale)
Owner's review of the pushed build: "not good enough", 3D hero looks pale next to F1 driver sites and IIT E-Cell sites. Screenshot review of the manifesto section: a giant low-contrast grey-teal paragraph on cream, thin orange rule, ring cursor, teal glass nav. Clean, but it is text on a background with nothing to look at. Root causes, in order of weight:
1. **No real photography or video.** The site has zero event photos. The F1/E-Cell sites that impress are photo-led.
2. **No single bespoke interaction concept.** Generic scroll reveals and a procedural bar chart are not memorable.
3. **Typography is polite.** Headline scale, weight and width are timid. No mega wordmark, no condensed impact type, no caption system.
4. **Flat colour use.** Everything is ink/teal/cream; the orange is a line and a button. No lit, high-contrast moments.
5. **Procedural 3D (plain discs, bars) looks cheap** next to photographic or pre-rendered content. Poster-quality renders beat primitive meshes.
6. **Copy is placeholder-grade** and unsourced from the club's own voice.
The fix is photography + one concept + type + contrast + personality copy. More particles will not fix it.

## 1. Research (what was verified, what Claude Code must do tonight)
VERIFIED by the planning session (fetched landonorris.com, 1 Oct 2026; Webflow-built, not Next.js, so replicate the effects, not the stack):
- Opens with an interactive "vertical drive" intro (rotate-device prompt, "Load Norris" button, "tap to lock", "Back to scroll"): a playable intro, then scroll resumes.
- Giant wordmark graphic, handwritten signature SVG overlays, one acid-lime accent on dark green/black, "mclaren f1 since 2019" mono micro-labels repeated as a ticker/label system.
- Photo-first horizontal strips, each photo captioned with place + year ("Qatar, 2024"), short first-person pull-quotes between them.
- Hover-swap image pairs (every helmet has a base and a hover image), 360 product rotation, partner-logo marquee, big closing statement ("Always bringing the fight."), Rive animations for small interactive graphics.
- Clear page split ("On Track", "Off Track"), calendar page, store link, sign-up.
Lessons to apply: a playable/interactive intro that never blocks content, captions as a design element, hover-swap pairs, one accent colour used decisively, a big emotional closing line, personality in copy.
NOT VERIFIED: other F1 driver sites, Awwwards 2026 lists. **Task 1 tonight (time-box 60 min):** in the real browser (Playwright/DevTools MCP), audit landonorris.com fully (scroll every section, record network for heavy assets, note the intro mechanics, cursor behaviour, scroll-linked effects, type sizes via computed styles), then find and audit 3 more premium sites via web search (an F1 driver or team site, one Awwwards/FWA "site of the month" from 2026, one automotive/product 3D site). List every URL you actually opened in `docs/RESEARCH-V3.md` with: stack detected, fonts, palette (sampled), techniques, weight of assets, and what we adopt or reject. Do not write findings for sites you could not open. Re-read `docs/PARITY.md` for IIT Guwahati/Hyderabad/Bombay/Madras.
Never copy layouts, text, assets, fonts or code. Adopt principles only.

## 2. Approved overrides (owner)
1. **Photos and videos are ON.** This reverses the earlier "keep raw-media aside" call. The club has confirmed consent to show people in these photos (owner statement, 30 Sep 2026). Record `consent: true, basis: "club-confirmed 2026-09-30"` per photo in `src/data/media.ts`. Process `raw-media/` (see section 6). Anything that looks private, embarrassing, blurry, or shows what appears to be a minor in a close-up: exclude and list in the morning summary.
2. **Decorative self-hosted video loops allowed:** max 3 on the whole site, each muted, `playsinline`, <= 1.5 MB, poster image, lazy, never on Save-Data/reduced-motion. Full event videos still go through the YouTube-nocookie facade.
3. **Initial JS budget:** baseline Next+React is ~172 KB gz, so the budget becomes **<= 195 KB gz initial, everything else lazy**. Report it per route.
4. **LCP levers approved:** `images.qualities`, `experimental.inlineCss`, replacing the JetBrains Mono file with a system mono stack if it measurably helps, and measuring on a Vercel preview deploy (push the branch; if no preview exists, say so). Do not loosen CSP. `next.config.ts` edits limited to these levers; log each.
5. **3D models without decoders:** CSP forbids `wasm-unsafe-eval`, so no Draco/Meshopt wasm. Use `gltf-transform` weld + simplify + quantize (KHR_mesh_quantization) + WebP textures, needing no decoder. Models <= 300 KB each.
6. **New dependencies pre-approved:** none beyond installed. `ffmpeg` is a system tool; if missing, log it and skip video loops.
7. Blender MCP: if connected, use it (section 7). If not, do everything else and note it.

## 3. The concept: "THE VORTEX DRIVE"
One idea: **you travel into the vortex through the club's real moments.** Real event photography becomes the 3D world.
Scene order on Home (each scene must have a mobile/low-end version using the same photos as a 2D sequence):
1. **Hero.** Full-bleed best photograph (curated), treated with ink-teal duotone-lite grade (CSS/AVIF pre-graded, not runtime filters), a **mega wordmark "E-CLUB"** at ~20vw in Bricolage Grotesque at `wdth 75, wght 800`, uppercase, tight tracking, image revealed *through* the letters by a pointer-following mask (clip/mask with transform only; touch: auto-sweep once). Mono micro-labels system ("NIT WARANGAL / ENTREPRENEURSHIP CLUB / EST. [TODO from club]") repeated as thin rules. Primary CTA + secondary CTA. A "Hold to dive" control (press-and-hold ring fills, then triggers scene 2). It is optional: scrolling works at all times and nothing is gated.
2. **The Dive (pinned, ~350vh).** A WebGL tunnel: 10-14 photo planes (1024 px textures, WebP, KTX2 not required) on staggered rings; camera flies forward with scroll, slight roll, depth fog in ink, orange light streaks at the edges, each photo gets a mono caption (event, year, only from data). DPR cap 1.5. Reduced-motion/touch/low-end: a vertical stack of the same photos with clip-path reveals and captions.
3. **Manifesto.** Rebuild for contrast >= 7:1: near-white on ink (not grey on cream), line-by-line scroll highlight, 2-3 key words in orange, big numerals for the facts. The copy comes from section 5.
4. **Proof strip.** Only verified numbers; count-up; hidden when absent.
5. **Moments rail** (Lando-style): horizontal pinned strip of photos with place+year captions and first-person pull-quotes between them; drag cursor label. Mobile: native swipe.
6. **Events ledger with hover-swap.** Each row shows two images (base/hover) that cross-fade and lift; cursor label "VIEW". Empty state stays.
7. **Venture Vortex flagship.** Dark full-bleed with the vortex particle ring (already built), live countdown, the ₹50,000 pool and the Unstop button; the dive transition to `/venture-vortex` kept.
8. **Partners/sponsors marquee** (consent-only), velocity-linked speed, pause button.
9. **Join/Contact CTA** oversized.
10. **Closing statement + footer.** Giant line across the footer (from section 5), big wordmark, back-to-top, socials, sponsor block.
Other pages (About, Events, Team, Sponsors, Gallery, Contact, Join): give each a photo-led hero, the mono label system, hover-swap where images exist, and the same type scale. Gallery: masonry with lightbox, keyboard + swipe + focus trap, captions, blur-up.

## 4. Design system upgrades
- **Type:** Bricolage Grotesque variable axes `wdth` 75-100, `wght` 300-800 (verify the axes are exposed by the installed font package/subset; if not, say so and use weight/size only). Scale: mega `clamp(6rem, 20vw, 22rem)` for wordmark; h1 `clamp(3rem, 9vw, 9rem)`; body 18-20px/1.55; mono labels 11-12px, +0.12em tracking, uppercase. Headlines uppercase condensed-heavy in dark sections, sentence case in paper sections. No italic-serif tricks, no Inter/Poppins/Space Grotesk/Oswald.
- **Colour:** ink `#0b2226` dominant, paper `#f5f1e6` for reading sections only, orange `#ed9038` is THE accent (ratio ~8-10% of pixels), cyan `#36afaa` only for light effects and data, never small text. Add a **hot state** `#ff6a1a`-range only if it passes contrast where used; record any new token in `tokens.css` via a reviewed change. Text contrast >= 4.5:1, large >= 3:1, manifesto >= 7:1.
- **Buttons:** keep the pill + fill sweep; add a "hold" button variant (hero), a square arrow-only icon button, and a label-cursor system (`VIEW`, `DRAG`, `PLAY`, `OPEN`) following the pointer with spring (critically damped, no bounce).
- **Motion vocabulary:** (a) masked line reveals, (b) image clip-path reveals (inset 100% to 0), (c) parallax on photos <= 12% travel, (d) velocity-linked marquee, (e) scroll-linked SVG path draw for ledger lines, (f) magnetic buttons, (g) hover-swap, (h) the Dive. Only transform/opacity/clip-path/WebGL. One easing family. No page transitions other than the vortex dive link. Reduced-motion: everything static, content visible.
- **Texture:** static grain 3-4%, hairline rules, corner crop-marks on photos, mono captions. Radius <= 2px.
- Glass only on floating UI (nav pill, menus).

## 5. Content and copy
**Research limits (verified tonight):** LinkedIn blocks automated access (robots) and Instagram requires login, so neither could be read by the planning session. The search engine returned no E-Club-authored text. Do NOT invent E-Club history.
Procedure:
1. Create `docs/CONTENT-INTAKE.md` with clearly labelled empty sections for the owner: LinkedIn About text (paste), tagline, founding year, mission/vision, verticals (with one line each), 6-10 recent Instagram captions (paste), past events (name, date, what happened, real numbers), speakers/guests, team roster (name, role, year, optional handle), sponsors/partners, testimonials, press. Commit it.
2. If `CONTENT-INTAKE.md` already contains owner text (check first), write all copy from it only. Otherwise write copy ONLY from verified facts in `docs/CONTEXT.md` and `src/data/event.ts`, plus these publicly sourced facts about Technozion: NIT Warangal's annual technical festival, established 2006 (source: NITW Technozion '23 brochure PDF on nitw.ac.in). Mark each such line `CONFIRM` in data. Do not attribute E-Summit '25 (an NITW event, found on Unstop) to E-Club unless the owner confirms.
3. **Voice:** short, confident, first-person plural, concrete, numbers first, no clichés ("Unleash", "Elevate", "Empower", "Seamless", "Revolutionary", "Cutting-edge", "Ecosystem" as filler). Write 3 candidate closing lines and pull-quotes as `CONFIRM` options in `src/data/copy.ts`; the UI uses the first. Example tone to adopt, not to copy: declarative fragments, a dry edge, one idea per line.
4. Every page gets unique title/description (<= 160 chars), real headings, alt text from what is visible, no names guessed from photos.
5. Produce `docs/COPY-REVIEW.md`: a table of every public sentence that is not from an owner-supplied or verified source, with status CONFIRM, for the club to approve before launch.

## 6. Media pipeline
- Inventory `raw-media/` into `docs/MEDIA-INVENTORY.md` (counts by type, resolution, size). Generate contact sheets (sharp), look at them, rank by sharpness/exposure/composition/emotion. Select 40-60 photos: 12-14 for the Dive, 8-10 for the Moments rail, event covers and hover pairs, gallery. Extract no GPS/EXIF.
- Output: `public/images/events/<slug>/` AVIF + WebP at 640/1024/1600, plus 24px blur placeholders in `src/data/media.ts`. Hero image gets an LCP-optimised 1600 variant + portrait crop via `<picture>`. Dive textures 1024 WebP.
- Videos: ffmpeg to <= 1.5 MB muted H.264 loops (max 3) and posters; original/long videos are listed in `docs/MEDIA-INVENTORY.md` for the owner to upload to YouTube; event data takes a `youtubeId` later.
- Event names/dates are unknown: use neutral captions ("Club event", TODO in data) and flag in `docs/COPY-REVIEW.md`; never guess an event name from a photo.
- AI-generated images stay in `public/images/generated/` for abstract backgrounds only, never presented as real photos.

## 7. 3D specifics
- One main scene (the Dive). The vortex portal keeps its own small scene; pause both off-screen; never more than two contexts alive, dispose on leave.
- Replace the procedural bars/coins from the old hero. The hero is now photographic.
- If the Blender MCP is connected: model one hero object (a brass "ledger" coin or a trophy) for the Venture Vortex section with PBR, <= 15k tris, bake AO, export .glb, optimise per 2.5, <= 300 KB, render a matching poster. If not connected, skip with a log entry.
- Poster fallbacks for every 3D scene are pre-rendered stills from the real scene.
- FPS targets: >= 55 desktop, >= 30 at 4x CPU throttle; adaptive DPR; `frameloop` demand when off-screen.

## 8. Overnight protocol (unattended)
- Work on `feat/immersive-v2` (continue) or branch `claude/overnight-v3-<date>` from it; commit often; push the branch; NEVER push to `main`; NEVER open a PR; NEVER touch CI, security headers, CSP, env files, `.github/*`; no backend work tonight (Firebase is planned next).
- Never invent a fact. Missing data => TODO in data + CONFIRM in COPY-REVIEW.
- Time-box each scene to ~90 minutes; if it fails budgets after two honest fixes, ship the simpler fallback and log why.
- Keep a timestamped `docs/handoff/BUILD-LOG-V3-<date>.md`, updated after every commit. No conversational reporting.
- Order: (1) RESEARCH-V3 audit, (2) media pipeline + media.ts, (3) type/colour/UI kit upgrades + label cursor + hover-swap, (4) Hero, (5) Dive, (6) Manifesto + proof + Moments rail, (7) Events ledger + flagship + marquee + footer statement, (8) inner pages photo-led, (9) gallery + lightbox, (10) content/copy + COPY-REVIEW, (11) perf/a11y/security pass, (12) final QA.
- If something is impossible, do not silently swap scope: log it under BLOCKED with the reason.

## 9. Quality gates (must be measured, not asserted)
Per scene and final: `tsc --noEmit`, lint, production build, `npm audit` (registry check), the existing `scripts/qa.mjs` harness (extend it to cover new routes/scenes; must pass), Lighthouse mobile median of 5 via `scripts/lh.mjs` (reject slow-machine runs): perf >= 90, a11y >= 95, SEO 100 on indexable pages; LCP <= 2.5 s or documented remaining causes with a trace; CLS <= 0.1; TBT; initial JS per route; fps desktop and throttled; long tasks during a full scroll; reduced-motion, keyboard, hard-reload and back/forward, 360/768/1440 screenshots that you look at and fix (no cropped text, wrap bugs, overflow, unreadable contrast). Also test a slow 4G profile and a Save-Data profile. Screenshots to `docs/handoff/v3/`.
Visual acceptance checklist (answer each yes/no with evidence): a stranger sees real people and places within 1 second; the hero has a focal point and a hierarchy; the Dive works and degrades; every section has a reason to exist; no section is text-only on a flat background for more than one viewport; captions and labels follow one system; the orange appears in a deliberate rhythm; nothing looks like a template.

## 10. Morning summary (top of the build log)
Done / blocked / measured numbers table / every judgment call / list of excluded photos / COPY-REVIEW count / what the owner must supply (CONTENT-INTAKE) / exact commands to review (`git log`, `npm run build && npm start`, `node scripts/qa.mjs`). Be candid about what still looks weak.

## 11. Never
Invent facts or event names; show a personal phone number; ship without fallbacks; loosen CSP; use Drive embeds; use gradient blobs, emoji icons, glass card grids, banned fonts or clichés; claim "flawless". Backend is out of scope tonight.
