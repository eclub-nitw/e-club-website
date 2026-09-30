# PARITY: E-Cell reference sites vs ours

Measured 30 Sep 2026 in a real browser (Playwright, 1440 wide, homepage only). Section lists come from DOM headings, so image-only sections may be missed. IITM's homepage rendered only its hero within 5 s (0 images, page height 647 px), so it is a loader/intro screen, not a full audit. Inspiration only, never copied.

| Site | Height | Canvas | Video | Imgs | Fonts | Sections (h1-h3) |
|---|---|---|---|---|---|---|
| IIT Guwahati | 6566 | 0 | 0 | 81 | Inter Display, Urbanist, Space Grotesk, Instrument Sans | hero, Our Initiatives, Numbers, Guests hosted, Backers, Reach out (form) |
| IIT Hyderabad | 4839 | 1 | 0 | 19 | DM Sans, serif, Geist Mono | hero, Where founders begin, Events & Programs (6), Speakers, Backed by, footer/partner CTA |
| IIT Bombay | 4435 | 0 | 0 | 42 | Poppins, Bebas Neue | hero, 3 stats (1000+/60K+/500K+), Initiatives, International reach, Speakers, Testimonial; nav has Register/Login/Blogs |
| IIT Madras | 647 | 0 | 0 | 0 | Oswald | intro hero only |

Status key: `[x]` built and verified, `[~]` exists but needs V2 rebuild, `[ ]` not built, `[-]` justified skip / data-gated.

| # | Component | Ours | Notes |
|---|---|---|---|
| 1 | Loader-free hero (3D/poster), tagline, dual CTA | [~] | CSS-3D today; V2 = R3F Rising Ledger + poster LCP. Tagline is TODO in data |
| 2 | Scrolling ticker/marquee | [ ] | Hyderabad has one. Build with reduced-motion pause |
| 3 | Floating pill nav + mobile menu | [~] | Exists; add section-aware state, focus trap, staggered links |
| 4 | Floating register pill (VV countdown) | [ ] | Guwahati has one. `Countdown.tsx` exists |
| 5 | About/mission + proof stats | [-] | Hidden until club supplies verified numbers |
| 6 | Verticals as ledger rows | [-] | No data yet |
| 7 | Flagship banner (VV, countdown, Unstop CTA) | [~] | Card exists; rebuild with vortex portal |
| 8 | Events upcoming + archive, filters, detail, YouTube facade | [~] | Only VV 2026 in data |
| 9 | Gallery + lightbox | [~] | Empty until photos processed and consent recorded |
| 10 | Past speakers/guests | [-] | Data-gated. All four reference sites have it |
| 11 | Alumni/startups incubated | [-] | Data-gated |
| 12 | Team (core/coordinators/tech, year, socials) | [~] | Empty data |
| 13 | Sponsors with tiers, disclaimer, brochure slot | [~] | Empty data; footer sponsor block (Hyderabad pattern) |
| 14 | Testimonials/press | [-] | Data-gated, hidden when empty (Bombay has testimonials) |
| 15 | Join/newsletter form (honeypot, rate limit, 18+) | [ ] | Needs Route Handler + zod |
| 16 | Contact page (map link, no tracker iframe) | [~] | Exists |
| 17 | FAQ (native details) | [ ] | |
| 18 | Footer: sponsor block, socials, legal, back-to-top | [~] | |
| 19 | 404, sitemap, robots, OG image, manifest, favicon, JSON-LD | [x] | Favicon is a generic glyph until the logo file arrives |
| 20 | Cookieless analytics slot | [ ] | |
| 21 | Custom cursor, magnetic buttons, tilt | [ ] | V2 section 3 |
| 22 | Pinned scroll scenes (manifesto, events rail) | [ ] | GSAP ScrollTrigger |

Tick count: 1 built, 9 rebuild, 7 not built, 5 data-gated (of 22).
