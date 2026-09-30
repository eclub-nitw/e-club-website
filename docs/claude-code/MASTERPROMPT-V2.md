# CLAUDE CODE MASTER PROMPT V2: "THE LEDGER, IMMERSIVE" (E-Club NIT Warangal)
Start Claude Code with:
`Read AGENTS.md, docs/CONTEXT.md, docs/DESIGN.md and docs/claude-code/MASTERPROMPT-V2.md fully. Then execute Phase 0.`

## 0. Why V2 exists
The overnight build passed lint/Lighthouse but the owner judged the design "boring": CSS-fake 3D, no photos, no cinematic scroll, generic buttons. V2 replaces "clean and compliant" with "memorable and fast". Rules in AGENTS.md still hold (no invented facts, tokens only, no personal phone numbers, consent for photos, static generation, a11y, security). **Where V2 conflicts with AGENTS.md, V2 wins only on the items in section 1.**

## 1. Approved changes to AGENTS.md (owner-approved, 30 Sep 2026)
1. New dependencies are pre-approved: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap` (+ `ScrollTrigger`), `sharp` (dev), `@gltf-transform/cli` (dev). Anything else: ask. Record the measured bundle cost of each in the build log.
2. Motion: GSAP/ScrollTrigger and R3F frame loops are allowed. Still only transform/opacity/WebGL (no layout-property animation), one easing family (`cubic-bezier(.16,1,.3,1)` for DOM; `power4.out` in GSAP), full `prefers-reduced-motion` fallback, no page-transition animations, never gate primary content behind animation or a loader.
3. Glass is allowed only on surfaces floating above scrolling content (nav pill, modals, toasts). Never static card grids.
4. Performance budget revised: Lighthouse mobile >= 90 (target 95), LCP <= 2.5 s, CLS <= 0.1, INP <= 200 ms, **initial JS <= 180 KB gz; WebGL chunk loads only after first paint/idle and never blocks LCP.** If a 3D feature breaks the budget, degrade it; never ship a slow page.

## 2. Honest constraints (do not fight them)
- "Hyper-realistic 3D + 95 Lighthouse" only coexist through discipline: poster image is the LCP element; the 3D scene hydrates after `requestIdleCallback`; models are Draco/Meshopt-compressed (<= 300 KB each), textures KTX2/WebP, <= 1 HDRI (<= 200 KB, from Poly Haven CC0), DPR capped at 1.5 mobile / 2 desktop, `frameloop="demand"` when off-screen, pause when tab hidden.
- Low-end/mobile/reduced-motion/no-WebGL: render the static poster (a pre-rendered image of the same scene). Detect with `matchMedia`, `navigator.hardwareConcurrency <= 4`, and a WebGL context test.
- "Black box, zero security issues" does not exist. The target is: strict CSP tightened (nonce or hashes, no `unsafe-inline` for scripts if achievable), all headers, honeypot + rate-limited forms, zod validation on server, no secrets in client, `npm audit` clean, Dependabot on, no user-data storage. Document residual risk honestly.
- Never claim "bulletproof/flawless". Report measured results only.

## 3. Design concept: "The Ledger, Immersive"
One idea carried everywhere: **money as physical matter**. Ink-dark world, paper-cream reading sections, orange `#ed9038` as the single signal colour, cyan `#36afaa` as secondary light. Ledger hairlines remain the typographic spine; 3D and photography supply depth and life.

**Signature 3D (build in this order, each behind the fallback rule):**
1. **Hero: "Rising Ledger".** Real-lit scene of extruded bar columns (growth chart) with a subtle orange rim light, dark reflective floor (drei `MeshReflectorMaterial`, low res), floating coin-like discs with physical material (metalness, roughness, HDRI env), pointer-parallax camera (damped), scroll-linked camera dolly into the next section. Title in DOM (not WebGL) above it, masked-reveal.
2. **Vortex portal (link to Venture Vortex):** particle spiral (instanced points, <= 4k) that swirls into a ring; scroll or hover accelerates it; clicking runs the "fall into the vortex" transition (camera zoom + fade, <= 600 ms), then routes. Reduced-motion: plain crossfade.
3. **Section transitions:** pinned ScrollTrigger scenes: (a) manifesto text lines highlight as you scroll, (b) horizontal-scroll events rail (pinned, mobile falls back to native swipe), (c) numbers counting only for verified stats.
4. **Team/sponsors:** magnetic hover, image tilt (<= 4 deg), cursor-following preview on the events ledger.
5. **Optional model:** if a glTF trophy/coin is produced (Blender MCP or CC0 source with licence recorded in `docs/ASSETS.md`), use it in the Sponsors/Prize moment.
Do not use Spline embeds (heavy runtime).

**Buttons/UI kit (rebuild `components/ui`):** primary = ink pill with orange fill sweep on hover (clip-path, transform only), arrow that slides 4 px, magnetic offset <= 6 px on desktop only, 44 px min height, visible focus ring in orange, pressed state scale .98. Secondary = hairline underline that draws. Custom cursor (small ring, grows on interactive) desktop only, never hides the system cursor for keyboard users. Nav = floating pill with glass (allowed by 1.3), section-aware active state, mobile full-screen menu with staggered masked links, Esc closes, focus trapped.
Type: Bricolage Grotesque (display, use large: clamp up to ~14vw hero), Instrument Sans, JetBrains Mono labels. Grain overlay 3-4 % (CSS, static).

## 4. Component parity checklist (compare against IIT Guwahati, Hyderabad, Bombay, Madras E-Cells; inspiration only, never copy)
Claude Code must open each site in the real browser (Playwright/Chrome DevTools MCP), list every section/component, and tick against ours in `docs/PARITY.md`. Minimum set; anything missing gets built or explicitly justified:
- Loader-free hero with video/3D/poster, tagline, dual CTA (Register / Explore), scrolling ticker/marquee
- Sticky/floating nav, mobile menu, floating register pill (VV countdown)
- About/mission block + proof stats (only verified numbers; else labelled TODO in data, hidden in UI)
- Verticals/what-we-do (as ledger rows, not 3-up cards)
- Flagship banner (Venture Vortex) with countdown and Unstop CTA
- Events: upcoming + past archive, filters, event detail pages, photo galleries, YouTube facade
- Gallery: masonry/rail with lightbox (keyboard, swipe, focus trap, alt text)
- Past speakers/guests, alumni/startups incubated (only if the club supplies data)
- Team: core/coordinators/tech, year grouping, socials (no phone numbers)
- Sponsors/partners with tiers + disclaimer, "Become a sponsor" CTA + downloadable brochure slot
- Testimonials/press (data-gated, hidden when empty)
- Newsletter/join form (honeypot, rate limit, 18+ note), contact page with map embed replacement (link, not tracker iframe)
- FAQ (native details), footer with sponsor block, socials, legal links, back-to-top
- 404, sitemap, robots, OG image, manifest, favicon set, JSON-LD, cookieless analytics slot
- Dark/light? Not required. Skip unless owner asks.

## 5. Imagery pipeline
Sources (owner-shared Drive folders, past events):
1 https://drive.google.com/drive/folders/14fD4q2Y1QYNtmcyDfSbfFqJMcpbSZh4w
2 https://drive.google.com/drive/folders/1uhHN7Gm8Bcu42zVKrOy_nVx3iT07jlUr
3 https://drive.google.com/drive/folders/1JozKrX9MeBajFJgIMBejBHn9g-xgclvo
Claude Code cannot assume access. Step: ask the owner to download all three to `C:\Users\tipty\E-club-website\raw-media\` (never committed; add to `.gitignore`). Do NOT hotlink Drive.
Then a script `scripts/optimize-images.mjs` (sharp): max 1600 px long edge, AVIF + WebP, `-blur` 24 px placeholders (base64 in data), strip EXIF/GPS, kebab-case names to `public/images/events/<event-slug>/`. Auto-rank with a contact sheet screenshot, pick the sharpest/best-lit per event for hero/covers, then have the owner approve.
Rules: identify every photo with recognisable faces; `consent` field in `src/data/media.ts` must be `true` (owner-confirmed, event-level is acceptable if the owner states it) before display; otherwise use the photo only if faces are not identifiable, or hold it back. Write alt text from what is visible; never guess names. Unknown event names/dates stay TODO in data.
Gaps (abstract textures, hero poster, section art): use the prompts in section 9, saved into `public/images/generated/` with a note in `docs/ASSETS.md` that they are AI-generated. No stock photos of people. Web-sourced images only if licence is CC0/CC-BY, recorded with URL and licence.

## 6. Engineering rules
- Server Components by default. R3F scenes in `components/three/*` as client components loaded with `next/dynamic({ ssr:false })` inside an intersection/idle wrapper. One shared `<Canvas>` per page max.
- Dispose geometries/materials/textures on unmount; no per-frame allocations; memoize; instancing for repeats; `useFrame` work minimal.
- GSAP: register plugins once in a client module; `gsap.context()` + cleanup; `ScrollTrigger.refresh()` after fonts/images load; use `matchMedia` for reduced-motion and mobile variants. Lenis integrated with ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`); disable Lenis on reduced-motion and touch if it hurts INP.
- Fix refresh/hydration issues: no `window` access at render, stable IDs, no random values in SSR output, tested with hard reload and back/forward navigation on every route.
- Images: `next/image`, explicit sizes, `priority` only on LCP, fixed aspect boxes, blur placeholders.
- No `any`, no dead code, named exports, small components, data in `src/data`.
- Security: keep headers from `next.config.ts`; tighten CSP with a reviewed PR (do not loosen); `zod` on all inputs; forms via Route Handlers with origin check + rate limit; `rel="noopener noreferrer"`; env vars only.

## 7. Verification loop (per page and per 3D feature; no exceptions)
plan -> build -> `tsc --noEmit` -> lint -> build -> run prod server (`next start`, never judge perf on dev) -> screenshots 360/768/1440 in a real browser (look at them and fix visible defects) -> scroll the full page recording frame timing (Chrome DevTools trace: no long tasks > 50 ms during scroll, 3D >= 55 fps on desktop, >= 30 fps on throttled 4x CPU mobile) -> reduced-motion pass -> keyboard pass -> hard-reload + back/forward test -> Lighthouse mobile (3 runs, median) -> `npm audit` -> commit on branch.
If LCP > 2.5 s: analyse the trace, fix the real cause (JS weight, font loading, image priority), re-measure. Report before/after numbers. Never say "done" without the numbers.
Before the first commit run `npm config get registry`; it must be `https://registry.npmjs.org/`, otherwise `npm audit` results are invalid.
Playwright: install `@playwright/test` (approved) and use it for screenshots and a small smoke suite (routes 200, one h1, no console errors, menu open/close, form validation).

## 8. Phases and order
- **Phase 0 (30 min):** read docs, run parity research on the four E-Cell sites (real browser, note stack, fonts, motion patterns, sections), write `docs/PARITY.md` and `docs/PLAN-V2.md`. Ask <= 3 blocking questions, then continue.
- **Phase 1:** tokens, fonts, UI kit (buttons, cursor, nav pill, mobile menu, footer), smooth-scroll + GSAP foundation, image pipeline script.
- **Phase 2:** Home with Rising Ledger hero, ticker, manifesto scroll, flagship section with vortex portal, events rail, proof stats, sponsors band.
- **Phase 3:** Events archive + detail pages, Gallery + lightbox (using real optimised photos), Venture Vortex teaser page.
- **Phase 4:** About, Team, Sponsors, Contact, Join, legal (drafts, noindex), 404, OG image generation, JSON-LD, sitemap.
- **Phase 5:** perf/security/a11y pass, PARITY.md fully ticked, `docs/handoff/BUILD-LOG-<date>.md`, PR-ready branch (attended: open PR; unattended: never open a PR, never push to `main`).
Work on branch `feat/immersive-v2`, commit per feature, time-box each page (2 h), log judgment calls.

## 9. Image-generation prompts (owner runs in Gemini/ChatGPT; save outputs to `raw-media/generated/`)
Global suffix for all: "no text, no logos, no people, no watermark, cinematic lighting, shallow depth of field, photoreal, dark ink-teal (#0b2226) background with warm orange (#ed9038) rim light and faint cyan (#36afaa) accents, 16:9, high resolution."
1. Hero poster (LCP fallback): "Rows of polished dark-glass bar columns of increasing height on a glossy black reflective floor, orange edge lighting, floating brass coins mid-air, soft volumetric haze, camera slightly low, macro product-photography look."
2. Vortex texture: "A swirling spiral tunnel of fine orange and cyan light particles converging to a bright centre, deep space-like ink background, long-exposure feel."
3. Manifesto background: "Macro shot of a ledger book page with faint ruled hairlines and embossed numerals, warm paper, extremely shallow depth of field, moody side light."
4. Pitch-stage abstract: "Empty modern auditorium stage with a single spotlight cone and a lectern, seats in silhouette, orange spotlight, no people."
5. Sponsors band: "Stack of matte black and brushed brass geometric blocks forming a stepped podium, studio lighting."
6. Startup-ecosystem abstract: "Constellation of glowing nodes connected by thin lines forming a network, orange nodes, cyan links, dark background."
7. Workshop/ideas: "Top-down desk with blank notebooks, sticky notes with no legible writing, pen and coffee, warm tungsten light, no hands, no faces."
8. Paper texture tile: "Seamless cream paper with subtle fibres, neutral, 2048 px." (light sections)
Claude Code: convert with sharp, add alt text, record in `docs/ASSETS.md`.

## 10. Tools to add (verify each exists and its current install command before installing; report if unverifiable)
**Claude Code (MCP):** (1) shadcn MCP (`pnpm dlx shadcn@latest mcp init --client claude`), restyle everything with our tokens; (2) Playwright MCP (Microsoft) for real-browser screenshots/interaction; (3) Chrome DevTools MCP for traces, Lighthouse and console inspection; (4) Context7 for current library docs (three, R3F, GSAP, Next); (5) optional Blender MCP if the owner has Blender installed, to make one custom glTF; (6) Figma MCP only if a Figma design exists (already connected in Desktop).
**Skills/plugins:** Anthropic `frontend-design` skill (already available), `web-artifacts-builder` not needed. Use `gltf-transform` CLI and `sharp` (packages, not plugins).
**Claude Desktop:** keep Filesystem and Figma; add nothing else. Use Desktop only for planning, asset review and copywriting; Claude Code does the build.
Component sources (inspiration/base, always restyled): Watermelon UI, Motion Primitives, Aceternity (max one hero effect), Magic UI for marquee/number ticker. Record each in `docs/ASSETS.md`.

## 11. Never
Invent facts; show Bhavesh's number; embed Drive; ship 3D without a fallback; loosen CSP; touch CI/env without asking; declare done without measured numbers; use gradient blobs, emoji icons, Inter/Poppins/Space Grotesk, clichés, lorem ipsum.

## 12. Final report format
Numbers table (Lighthouse x3 pages, LCP, CLS, INP, JS gz, fps), PARITY.md tick count, list of TODO content, list of judgment calls, exact review commands.
