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

## Additional IITs checked (29 Sep 2026) — honest results
Tried to extend the sample beyond the original four. Results were mixed, and I'm reporting exactly what happened rather than filling gaps with guesses:
- **IIT Kharagpur** (`ecell-iitkgp.org`) — domain did not resolve (DNS failure) when I tried to render it. Could not audit. Search results describe it as one of the oldest E-Cells (est. 2005/2006, sources disagree), tied to IIT KGP's STEP incubator, running an annual E-Summit.
- **IIT Mandi** — no live rendered site found; only a GitHub organisation (`E-Cell-IITMandi`) with a repo literally named "The new E-Cell Website in Progress", i.e. their public site may not be live/stable right now. Not usable as a design reference.
- **A pattern worth naming, seen across several smaller-college E-Cells/IICs in search results (not personally rendered, so treat as a pattern to consider rather than a verified design source):** pairing a named annual flagship (e.g. a "Conclave") with a specific seed-grant figure aimed at prototype-stage founders, run jointly with the institute's Innovation Council. If E-Club NITW ever runs something similar, the events data model (`ClubEvent` in `src/data/events.ts`) already supports it (`stats`, `registerUrl`) without changes — no action needed now, just noting the model holds up.
- **Net effect on the plan:** the four fully-audited sites (Guwahati, Hyderabad, Bombay, Madras) remain the primary reference set. Nothing found in this pass changes the design direction in §"What none of the four does" above.

## Rules distilled
- One signature animation per section, all sharing one easing curve and one stagger.
- Real photography beats illustration; but do not depend on it.
- Numbers need proof or they are cut.
- Never gate content behind a loader. Never autoplay sound. One canvas maximum, only if it earns its bytes.

## Component/tooling stack chosen off the back of this research
See `docs/DESIGN.md` → "Component, motion and security stack" for the full list (shadcn/ui + its MCP server, Watermelon UI, Motion Primitives, Aceternity UI, Playwright for self-verification). None of the four audited sites publish their stack choices explicitly beyond what's detectable client-side (recorded in the table above); the component/tooling recommendations come from separate research into current (Sep 2026) component ecosystems, not from the E-Cell sites themselves.
