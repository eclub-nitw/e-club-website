# PARITY: E-Cell reference sites vs ours

Audited 30 Sep 2026 in real Chrome via Playwright (`scripts/parity-audit.mjs`, 1440 px wide, plus a 390 px top-of-page shot): each page was scrolled fully, top-level sections detected from the DOM and screenshotted, and stack, fonts, running animations, fixed/sticky elements and a hover probe recorded. Raw data: `docs/handoff/parity/<site>/audit.json`; per-section shots `NN.jpg`; `_overview.png` per site. Inspiration only. We do not copy layouts, text, imagery or fonts, and we do not use Space Grotesk, Poppins, Oswald or Inter (three of the four sites do).

**What this audit did not cover:** only the home page of each site (no inner pages, forms, or event pages); scroll-linked motion was inferred from sticky/fixed elements and the screenshots, not recorded as video or frame traces; the hover probe only compares computed colour/transform/border/underline of the first 8 links, so it can miss opacity or child-element effects; mobile was a single top-of-page screenshot; performance of the reference sites was not measured.

## Per-site findings

### IIT Guwahati (ecelliitg.in) — 7009 px, 7 sections
- **Stack:** Framer site with Lenis (`html.lenis`); no GSAP, no canvas/video; 82 images. Fonts: Inter Display, Urbanist, Space Grotesk, Inter, Instrument Sans.
- **Sections:** (1) hero: "Empowering the next wave of Entrepreneurs" with small logo "stickers" orbiting the headline; (2) photo wall in a dark rounded panel (bento); (3) "Hello! What we do / Our Initiatives" with floating initiative pills either side of a manifesto sentence that is part grey (looks like scroll-driven text lighting) and an "All initiatives will be UPDATED here soon" placeholder; (4) full-bleed photo with an initiative overlay (Campus Startup Initiative: 55+ startups, 8 months); (5) "Numbers that we hit" grid of 8 stats beside a big group photo; (6) "Guests we hosted" portrait cards on dark; (7) "Organisations that back Us" logo marquee.
- **Components/motion:** a fixed floating conversion pill ("Scavenger Hunt – Riddle") with an animated rainbow border, present on every screen; nav (Home, Initiatives, Achievements, Resources, About Us, Contact Us). Hover probe: no computed-style change on nav links or top button.
- **Weak points:** grey-on-grey low contrast, placeholder copy left live, no contact section reached in the section list.

### IIT Hyderabad (ecell.iith.ac.in) — 5018 px, 5 sections
- **Stack:** Next.js, Swiper, one `<canvas>` (hero wave lines), CSS `marquee` animation, a cursor element; DM Sans, a serif display italic, Geist Mono.
- **Sections:** (1) hero "Ideas That Ignite" over a wave-line canvas; (2) "Where founders begin" with 3 stats (12+ events, 100+ members, 14 years); (3) "Events & Programs": a ticker strip above six vertical expanding strips with rotated titles and a "View Event Info" button; (4) "Previous Speakers": coverflow carousel of portraits; (5) "Backed by": logo grid (a mix of well-known brands), then footer with partner CTA and contact emails.
- **Components/motion:** fixed floating pill nav (Home, About, Events, Team, Contact) at top-10; marquee ticker; event strip hover changes (probe true); dot-paginated carousel.
- **Weak points:** black-on-black, carousel dependence, few real sections.

### IIT Bombay (ecell.in) — 4537 px, 7 sections
- **Stack:** Angular + jQuery; no canvas; Poppins + Bebas Neue. Fixed social side-rail and fixed navbar; a `shake-vertical` animation on the scroll arrow.
- **Sections:** (1) hero with club emblem and "Know More"; (2) "What is E-Cell?" with three stats with line icons (1000+ cities, 60K+ startups, 500K+ students); (3) "Our Initiatives" as six double-hairline framed tiles with logos; (4) "Our international reach" image accordion (newspaper, Nasdaq screen, etc.); (5) "Inspirational Speakers" round portraits; (6) testimonial (single, with arrows); (7) footer with initiatives list and useful links.
- **Nav:** Home, About Us, Initiatives, Gallery, Contact, Blogs, Register, Login. Hover probe true on buttons/tiles, false on nav links.
- **Weak points:** dated Bootstrap-era look, gold-on-slate, login clutter, low-res speaker photos.

### IIT Madras (ecell.iitm.ac.in/home) — 14,515 px, 9 sections (audited after the intro cleared)
- **Stack:** Next.js; one `<video>`; CSS `shine` animation; cursor element; Oswald, Orbitron, mono. A first run at 5 s only showed the intro hero (647 px tall); after about 15 s the full page loaded. (The site also refused connections from one automated Chrome run and worked from another a minute later; the final audit ran clean.)
- **Sections:** (1) hero "E-CELL IIT MADRAS" over a monochrome wave image with tagline and scroll cue, above a running announcement ticker (two live event links, repeated); (2) "We believe in numbers" impact highlights, one big stat pill at a time (60+ Investors & Mentors), a pinned scroll sequence; (3) "About us" with a large ghost word behind; (4) "Our Baskets": four programme "baskets" in a sticky panel around a rotating ring; (5) "Cities we have reached": a sticky India map with a fixed phase label that changes as you scroll; (6) "Our events": six tiles; (7) "Our speakers": coverflow of portraits; (8) testimonials with a large portrait and arrows; (9) footer with three contact cards.
- **Components/motion:** fixed mono nav (Home, Initiatives, Blogs, Team…); sticky-scroll scenes (baskets, map); hover probe true on all nav items.
- **Weak points:** grey-scale sameness, long page (14.5k px), footer lists individuals' phone numbers (we never publish personal numbers), page height inflated by pinned scenes.

## Patterns across all four
Hero → numbers → initiatives/events → speakers → sponsors/partners → contact, in that order. Every site has a numbers block, a speakers block and a sponsors block; three have testimonials or a fixed floating element; two use a marquee/ticker; two use pinned/sticky scroll scenes; none has a working photo gallery on the home page beyond a bento wall (IITG); none has a countdown to its flagship.

## Component parity table

Status: `[x]` built and verified, `[~]` exists, V2 rebuild pending, `[>]` built in Phase 1 this session, `[ ]` not built, `[-]` data-gated or justified skip.

| # | Component (seen where) | Ours | Notes |
|---|---|---|---|
| 1 | Loader-free hero (all four; IITM has an intro before its content) | [>] | Phase 2: poster image is the LCP element; R3F "Rising Ledger" mounts after load + idle on desktop only; poster stays for reduced motion, touch, weak devices, no WebGL |
| 2 | Ticker/marquee (IITH, IITM) | [>] | `Ticker.tsx`, CSS-only, pause on hover, static under reduced motion. Currently on Home |
| 3 | Floating pill nav (IITH, IITG pill CTA) | [>] | Glass pill after scroll, section label, no motion lib |
| 4 | Mobile menu | [>] | Full-screen native dialog, staggered masked links, Esc, focus trap |
| 5 | Fixed conversion pill (IITG) | [ ] | Floating register pill with VV countdown, Phase 2 |
| 6 | Manifesto with scroll-lit text (IITG, apparent) | [>] | Phase 2: pinned on desktop, scrubbed on touch, contrast-safe two-layer words. Copy is built only from CONTEXT.md facts and flagged for club approval |
| 7 | Numbers block (all four) | [-] | Hidden until the club supplies verified numbers with a source |
| 8 | Initiatives/verticals (all four) | [-] | No club data; will be ledger rows |
| 9 | Events strips/tiles (IITH, IITM) | [>] | Phase 2: pinned horizontal rail (3+ events, desktop), native swipe on touch, ledger rows below 3 events, empty state with generated art. Rail verified only with a temporary 5-event fixture; the real data has 1 event. Archive filters and cursor preview still Phase 3 |
| 10 | Speakers (all four) | [-] | Data-gated; consent needed for portraits |
| 11 | Sponsors/partners (all four) | [~] | Footer block exists (data-gated, disclaimer link); page rebuild Phase 4 |
| 12 | Testimonials (IITB, IITM) | [-] | Data-gated, hidden when empty |
| 13 | Photo wall / gallery (IITG bento) | [~] | Empty state only; photos held back by owner |
| 14 | Sticky-scroll scenes (IITM baskets/map) | [>] | Pinned manifesto and pinned events rail (ScrollTrigger, lazy, armed only when reached) |
| 15 | Hero canvas (IITH wave lines) | [>] | R3F scene, lazy, desktop only, poster fallback |
| 16 | Custom cursor (IITH, IITM) | [>] | `Cursor.tsx`, additive ring, fine pointer only |
| 17 | Button hover motion | [>] | Fill sweep, arrow slide, magnetic offset, drawn underline |
| 18 | Contact / partner CTA in footer (IITH, IITM) | [~] | Footer done; contact page exists; sponsor brochure slot pending |
| 19 | Join/newsletter form, FAQ | [ ] | Phase 4 (zod, honeypot, rate limit) |
| 20 | 404, sitemap, robots, OG image, manifest, JSON-LD | [x] | Favicon is generic until the logo file arrives |
| 21 | Flagship countdown + portal | [>] | Countdown in the hero strip; flagship section has the vortex portal (particles, hover speed-up, 550 ms dive on click). None of the four has either |
| 22 | Cookieless analytics slot | [ ] | Phase 5 |

Tick count after Phase 2: 1 built and verified (row 20), 11 built in Phases 1-2 (`[>]`: rows 1, 2, 3, 4, 6, 9, 14, 15, 16, 17, 21), 3 exist and need rebuild (rows 11, 13, 18), 3 not built (rows 5, 19, 22), 4 data-gated (rows 7, 8, 10, 12) = 22. Row 7 (numbers) is implemented (CountUp, verified stats only) but hidden because no verified stats exist yet.

## Gaps and where we stand
- **We lack (must build):** floating register pill, scroll-lit manifesto, pinned events rail, hero 3D scene, forms, FAQ, analytics slot.
- **We cannot show yet (data):** stats, initiatives, speakers, testimonials, sponsors, gallery. Each renders a designed empty state or is hidden, never invented.
- **Where we go beyond them:** flagship countdown with registration CTA, a vortex portal transition into Venture Vortex, ledger-style events with a cursor preview, consent-gated photography, a11y and performance budgets none of the four appears to publish.
- **Do not repeat:** intros that gate content (IITM, first 5 s), placeholder copy live (IITG "UPDATED here Soon"), personal phone numbers in a footer (IITM), grey-on-grey contrast.
