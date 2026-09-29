# Reference-site research: four E-Cell sites, opened in a real browser

Method: each site was loaded in headless Chrome (1440×900), scrolled top to bottom with screenshots, and inspected for stack, fonts, colours and components (captured 28 Sep 2026). Some sections lazy-load or animate on scroll, so treat this as a strong sample, not a full audit. Screenshots are for internal study only.

| | IIT Guwahati (ecelliitg.in) | IIT Hyderabad (ecell.iith.ac.in) | IIT Bombay (ecell.in) | IIT Madras (ecell.iitm.ac.in) |
|---|---|---|---|---|
| **Stack (detected)** | Framer-built site | Next.js (Turbopack) + shadcn tokens, Swiper, one `<canvas>` | Angular + jQuery + Bootstrap | Next.js (webpack), Google Analytics |
| **Type** | Inter Display 300 at 100px, −6px tracking; Instrument Serif/Sans; Urbanist | DM Sans 600 at 96px + serif italic display; Geist Mono for labels | Bebas Neue (h1), Poppins | Oswald 800, 12px letter-spacing, all caps |
| **Palette** | soft grey gradient, black type, dark rounded cards, green CTA | pure black, white type, single accent (blue links) | dark slate `#243137` + gold `#bd9f67` | pure black, white, thin grey grid lines |
| **Structure** | hero → who we are → initiatives → numbers → guests → backers → contact | hero → about + 3 stats → events → speakers → backed by → footer with sponsorship contacts | hero → what is E-Cell → stats → initiatives → international reach → speakers → testimonials → footer | cinematic preloader/hero (the only screen my capture reached) |
| **Standout components** | small initiative "sticker" pills floating around the headline; a fixed floating pill CTA with animated border ("Scavenger Hunt – Riddle") that follows scroll; bento gallery; stat grid beside a big photo with pixel-block corner cut; portrait cards for guests; sponsor logo marquee | wave-line canvas hero; small floating pill nav; horizontal ticker "IDEATE · PITCH · BUILD · LAUNCH · NETWORK"; Events shown as expanding vertical strips with rotated titles; coverflow speaker carousel; blur-in sponsor logos; sponsor CTA block in the footer | double-hairline framed initiative tiles; "our international reach" as a vertical image accordion (GCC, Forbes, Nasdaq, Shibuya); stat trio with line icons; fixed social rail on the right edge | perspective wire-grid "room", ultra-tracked title, odometer-style percent counter as the loader |
| **What we take** | the floating conversion pill; stats beside real photography | one cheap hero canvas idea; floating pill nav; the ticker; sponsor block in footer | proof-driven numbers; iconic-imagery storytelling; hairline frames | the *feeling* of a designed intro, but only as a sub-second moment, never a gate |
| **What we avoid** | grey-on-grey sameness; "updated soon" placeholders | black-on-black monotony; carousel dependence | dated Bootstrap look; testimonial carousels; login clutter | hiding all content behind a loader (hurts LCP and SEO) |

## What none of the four does (our opening)
1. **The page is a descent.** Scrolling pulls you into the vortex: the hero spiral scales up and its centre opens (circular clip-path) into the next section. One idea, one scroll-linked animation, zero libraries beyond `motion`.
2. **The 50 startups are a galaxy, not a logo marquee.** Eight sector arms of a spiral; nodes drift; filter dims arms; picking a node writes its name in the vortex core. (Built: `sections/Startups.tsx` in the Venture Vortex repo.)
3. **Rounds are orbits, not a timeline.** Understand (outer ring) → Build & Sell (middle) → Defend (core). The scroll-linked dot spirals inward.
4. **Round 1 is a dossier reader.** A sticky index of the seven teardown areas beside long-form panels, instead of accordions or cards.
5. **A torn paper edge** (from the poster) into a cream "boardroom" band for the partners.
6. **Violet + chrome + mono** where the others are black, grey or gold. On the E-Club site: teal + gold + paper — "The Ledger" — for the same reason: unlike any of the four.

## Rules distilled
- One signature animation per section, all sharing one easing curve and one stagger.
- Real photography beats illustration; but do not depend on it.
- Numbers need proof or they are cut.
- Never gate content behind a loader. Never autoplay sound. One canvas maximum, only if it earns its bytes.
