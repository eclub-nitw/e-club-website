# Design system — E-Club NITW

## Concept: "The Ledger"
An entrepreneurship club is about turning ideas into numbers. The site reads like a beautifully printed founder's ledger: warm paper and deep-teal ink, hairline rules, numbered entries, and one gold line that "grows" as you scroll (echoing the rising bars in the E-Club logo). Distinct from Venture Vortex's violet event world, but sharing fonts and structure so the two can live in one codebase.

## Anti-slop rules
Same as Venture Vortex: no gradient blobs, no glassmorphism card grids, no icon-circles above headings, no emoji icons, no Inter/Poppins/Space Grotesk, no corporate clichés, no centred-everything, no lorem ipsum, no stock "diverse team high-fiving" photos. Use real club photography, cropped with intention. Prefer big type, hairlines, tables and numerals over boxes.

## Palette (from the E-Club logo in the poster; confirm against the official logo file)
| Token | Hex | Use | Contrast |
|---|---|---|---|
| club-ink | `#0b2226` | dark sections, footer | — |
| club-deep | `#123a40` | raised panels on dark | — |
| club-teal | `#3b8c96` | graphics, large text (≥24px) only | 4.2:1 on ink (fails small text) |
| club-teal-deep | `#1d5a63` | text/links on paper | 6.9:1 on paper |
| club-gold | `#f1c55b` | accent, buttons, the growth line | 10.1:1 on ink |
| club-paper | `#f5f1e6` | light sections, cards | ink on paper 14.6:1 |
| club-mist | `#9fb8ba` | muted text on dark | 7.9:1 on ink |
Rhythm: alternate ink and paper sections. Hero is ink. Content-heavy pages (events archive, team, legal) are paper. Gold button on ink; ink button on paper. Set `data-theme="club"` on `<html>` (default in `tokens.css`); the Venture Vortex route wraps itself in `data-theme="vortex"`.

## Typography
Shared with Venture Vortex. Display: **Bricolage Grotesque**; body: **Instrument Sans**; labels/dates/numbers: **JetBrains Mono** uppercase. Headline sizes clamp(2.5rem, 6vw, 6rem). Body 17–18px / 1.65. Legal pages: body 16px, max 68ch.

## Signature elements
1. **Growth line:** a 2px gold SVG polyline that draws itself down the left rail of the Home page as you scroll (stroke-dashoffset linked to scroll progress), ending at the CTA.
2. **Ledger tables:** events and team use hairline-ruled rows with mono year/date columns instead of cards; hover highlights the row.
3. **Numbered sections** ("02 — What we do").
4. **Photo treatment:** all photos same aspect ratios (4:5 portrait / 3:2 landscape), slight warm grade, `object-fit: cover`, no rounded corners beyond 2px. Team photos in greyscale, colour on hover.
5. Grain overlay at 4%.

## Motion
Same language as Venture Vortex (masked reveals, scroll-linked lines, hover lift, transform/opacity only, Lenis smooth scroll, full reduced-motion support). Page transitions: none (fast beats fancy). Event archive filters animate with layout transitions ≤ 250ms.

## Components to build (shared library in `src/components/ui/`)
Container, Section (with number label), Button (primary/secondary/link), Nav (sticky, mobile sheet), Footer, LedgerRow, EventRow, EventCard (only for featured), StatNumber, SponsorLogo (uniform 40px height, grayscale→colour), TeamMember (photo, name, role, LinkedIn), Timeline, Accordion (`<details>`), VideoEmbed (lite YouTube facade), Gallery (masonry + lightbox, keyboard accessible), FormField, Toast, Breadcrumbs, TornEdge (from VV), Marquee (pauses on hover/touch and reduced-motion).

## Signature moments (informed by the four reference sites; none of them does these)
1. **Growth line.** A 2px gold line draws itself down the left rail of Home as you scroll and ends at the CTA (echoes the rising bars in the E-Club logo).
2. **Event ledger with a live preview.** `/events` is a hairline-ruled table (year · title · type). Hovering a row makes a photo from that event follow the cursor in a small 3:2 window (desktop only; keyboard focus shows it in place; touch shows an inline thumbnail). Beats the vertical-strip accordions used by two of the reference sites because it scales to 30+ events and works with the keyboard.
3. **Proof numbers.** Stats only appear with a footnote naming the source (e.g. "participants: registration data, Unstop, 2025"). No number, no stat.
4. **Fall into the vortex.** The Home CTA "Venture Vortex 2026" plays a circular clip-path reveal from the button's position that swaps the theme from teal/gold to violet and lands on `/venture-vortex`. Reduced motion: normal navigation.
5. **Sponsor page as a ledger.** "Why partner with us" is a table of verified numbers plus a downloadable one-page summary later; a sponsor block also sits in the footer (borrowed from the IIT Hyderabad pattern).
6. **Team as index cards.** Greyscale portraits with colour on hover; role in mono; year archive via `/team/[year]`.
7. **Floating pill nav.** Small centred pill (the site's only blurred surface) on scroll-down; full header at the top.
