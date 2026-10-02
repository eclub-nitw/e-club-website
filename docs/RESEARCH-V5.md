# RESEARCH V5 (2 Oct 2026)
Real Chromium via Playwright, desktop 1440x900. Only URLs listed here were opened this session. No asset, text, font or code is copied. Screenshots: `docs/handoff/v5/research/`.

## URLs opened
`ecell.iitm.ac.in/home`, `/team`, `/event/sponsors`, `/blog`; `ecell.iith.ac.in` (home), `/team` (200), `/about` (404), `/events` (403), `/contact` (404); `ecell.in` (home), `/about`, `/initiatives`, `/gallery`, `/contact`; `ecelliitg.in` (home; `/initiatives`, `/about-us`, `/contact-us` are 404, it is a Framer one-pager).
**Not re-opened this session:** landonorris.com and the three extra premium sites (V4 research in `RESEARCH-V4.md` stands; no new claims made). IIT Guwahati and IIT Hyderabad could not be audited beyond home: their inner routes 404/403 to automation.

## IIT Madras E-Cell (first-hand, deeper)
- **Home order (rendered h1/h2):** intro (~15 s) -> hero "E-CELL / IIT MADRAS" (Orbitron 96/48 px) + tagline (Oswald 30) -> "WE BELIEVE IN NUMBERS" (72 px, pinned numbers) -> "ABOUT US" (96 px) + "baskets" ring (4 baskets, 30 px) -> **"CITIES WE HAVE REACHED"** map -> "OUR EVENTS" (6 tiles) -> "OUR SPEAKERS" (~14 portraits) -> "TESTIMONIALS" -> footer. Page height 14,514 px. Background loop video `bg_vid.mp4`. No canvas; 34 inline SVGs.
- **India map section:** `<section aria-label="Map scroll phases" style="height:400vh">`. Heading 96 px with a 24 px-wide rule that scales in. Inside, a `position: sticky; top:140px` wrapper holds a 400 px-wide **PNG** (`IndiaMap.png`, white silhouette on near-black), an SVG overlay of **connector lines** (stroke ~2.2) and **140 px photo label cards** (2 px border, 6 px radius, shadow) placed left and right of the map. A **fixed** phase label (right edge, vertically centred, 58 px/800 weight, wide tracking, white with text shadow) swaps by scroll phase with a 500 ms translateY slide (initiative names "EDUCATION-21", "Startup Meetups", ...). Cards appear per phase and disappear on the next; between phases the map is bare. Mobile: a 24 px label above the map instead.
- **Sapling:** it is a **dotLottie "Growing Plant"** (`/home/plant.lottie`, 200x200 px, rendered as inline SVG by the dotlottie player) centred in the baskets/impact scene with a 400 px white blur glow behind (opacity 5%). It is a looping/scrubbed illustration in one section, not a persistent rail.
- **Nav (white bar, mono):** Home, Initiatives, Blogs, [logo], Team, Contacts, Past Sponsors, ESummit. Sub-pages: Our Sponsors (`/event/sponsors`, tiers: Title / Co-title / Legal / Travel / Accommodation partner, 50 px headings), Team (`H1` 96/60/36 px, faculty advisors, executive heads, verticals), Blog (60 px). Footer lists personal phone numbers (we never do).
- **Type sizes:** 96 (section titles, Orbitron/Oswald), 72, 60, 48, 30, 24, 17.6-20 (names). Titles are ALL-CAPS 2-4 words ("OUR EVENTS", "OUR SPEAKERS", "TESTIMONIALS").

## IIT Bombay (`ecell.in`)
Nav: Home, About Us, Initiatives, Gallery, Contact, Blogs, Register, Login. Pages: About (Origins, Our Vision, Our Reach with 444K+/80K+/68K+, In the Spotlight, Our History, Patronages), Initiatives (54 px h1), Gallery ("E-Cell Moments", "Celebrating Success"), Contact (team, previous teams, message form). Headings 54 px. Not present: Sponsors page, Team tab (team is inside Contact).

## IIT Hyderabad (`ecell.iith.ac.in`)
Floating pill (Home, About, Events, Team, Contact) is client-routed from the home; direct `/about`, `/events`, `/contact` return 404/403. `/team` exists: "The people who lead." 64 px, names 43 px. No separate Sponsors page (Backed-by is a home/footer block).

## IIT Guwahati (`ecelliitg.in`)
Framer one-pager; inner paths 404. Floating conversion pill, initiative "stickers", stat grid, marquee (V3 audit).

## What we adopt / reject
| Adopt | Reject |
|---|---|
| Home order hero, ticker, numbers, about, initiatives, reach map, events, speakers, testimonials, sponsors, contact | Intro loaders (content must never be gated), 15 s loader |
| 400vh sticky map with a fixed phase label, labels swapping with scroll (our own wording and style) | Photo-card labels on the map (no invented cities; raw photos banned), PNG map (we use one small SVG) |
| Short 2-4 word section titles + one supporting line | ALL-CAPS 96 px titles (our caps are 40-60 px) |
| A growing-plant illustration | A one-section looping Lottie; ours is a persistent scroll-scrubbed rail drawn in SVG |
| Sponsors tiers page; Team with faculty/verticals; Gallery (Bombay); floating register pill (Guwahati) | Login, Blogs, Past-Sponsors tab, personal phone numbers |
