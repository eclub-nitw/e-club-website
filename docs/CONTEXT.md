# E-Club NIT Warangal — official website: Project Context (paste to your AI first)

## What we are building
The official, public website of the **Entrepreneurship Club (E-Club), NIT Warangal**: who we are, what we run, our past events (photos and videos), the current team, our sponsors and partners, and how to contact or join us. It is the club's permanent home on the web, comparable in scope to the E-Cell sites of IIT Bombay (ecell.in), IIT Hyderabad (ecell.iith.ac.in), IIT Guwahati and IIT Madras. It also hosts the Venture Vortex 2026 page at `/venture-vortex` after the standalone landing page is merged in.

## Known facts
- Club: Entrepreneurship Club (E-Club), NIT Warangal. Email: e_club@nitw.ac.in. Instagram: @eclubnitw. LinkedIn: https://www.linkedin.com/company/entrepreneurship-club-nitw/ (page name teams tag: "Entrepreneurship Club-NIT Warangal").
- Flagship now: **Venture Vortex 2026**, all-India startup strategy competition, ₹50,000 prize pool, within Technozion (NIT Warangal's annual technical fest), final on campus 30–31 Oct 2026. Presented with Masters' Union, powered by Unstop, outreach partner School2Startup. Full facts: the Venture Vortex repo's `docs/CONTEXT.md`.
- General secretary: Bhavesh Vaishnav (public name only; his phone number must never appear on the site).
- Tech team: Wahid (head), Saad, Shroth Parek; freshers Satyam and Sumit work on the Venture Vortex landing page.
- Content still to come from the club (do NOT invent): year the club was founded, mission text, verticals/teams, list and dates of past events, stats (members, participants, sponsors, funds), team roster with photos, sponsor list and logos, gallery photos and videos (Google Drive folders: last year's assets received; this year's coming), alumni/startup stories, press mentions.

## Benchmark findings (real browser research, 28 Sep 2026 — full table in `docs/RESEARCH-E-CELLS.md`)
Opened and scrolled: IIT Guwahati (ecelliitg.in, a Framer site: floating conversion pill, orbiting initiative "stickers", stat grid beside a big photo, portrait cards, sponsor marquee), IIT Hyderabad (ecell.iith.ac.in, Next.js: wave-line canvas hero, floating pill nav, ticker, events as expanding vertical strips, sponsor block in the footer), IIT Bombay (ecell.in, Angular: proof-driven stat trio, double-hairline initiative tiles, "international reach" image accordion, social rail), IIT Madras (ecell.iitm.ac.in, Next.js: perspective-grid loader, ultra-tracked Oswald title). Common backbone: flagship-led hero → numbers → initiatives/events → speakers → sponsors → contact. Common weaknesses: card-and-carousel sameness, dark/grey/gold palettes, placeholder text ("updated soon"), content gated behind loaders.
Our opening: The Ledger (paper + deep teal + gold), proof-backed numbers, an events archive with a cursor-following preview, a growth line that draws itself, and a circular "fall into the vortex" transition when you enter the Venture Vortex page.

## Decisions and deadlines
- Venture Vortex is built first as its own site, then merged as `/venture-vortex`.
- **Confirm by Wed 30 Sep 2026** with the institute: (1) written permission to use the NIT Warangal name and emblem on the club's own domain, (2) whether the site can live on an institute subdomain (e.g. `eclub.nitw.ac.in`) instead of a purchased domain, (3) who at the institute is the faculty coordinator that reviews the legal pages.
- **WhatsApp group:** never public. Confirmed mechanism (29 Sep 2026) — for Venture Vortex, registered teams get the invite directly from Unstop after registering; E-Club does not send it separately. Apply the same rule to any other event's WhatsApp group unless told otherwise.
- **Prize split for Venture Vortex stays undisclosed for now** — a confirmed E-Club decision, not a missing fact. Don't add it without checking with Wahid.

## Non-goals (v1)
No login, no payments, no database, no CMS backend. Content lives in typed data files in the repo; the tech team edits them by pull request. Registration for events happens on Unstop or Google Forms.
