# COPY REVIEW (V4): every public sentence the club must approve before launch

Rule: a public sentence is allowed without review only if it comes from `docs/CONTEXT.md`, `src/data/events.ts` or the club's own words in `docs/CONTENT-INTAKE.md` (still empty). Everything else is **CONFIRM**. The UI uses option 0 of every option list in `src/data/copy.ts`; pick or rewrite. Voice: short, first-person plural, dry, no clichés.

| # | Public text | Where | Source | Status |
|---|---|---|---|---|
| 1 | Cover h1 "The Entrepreneurship Club of NIT Warangal" and kicker | `Cover.tsx`, `copy.cover.kicker` | Club name, verified | Verified |
| 2 | Cover lede "Where ideas get argued with." (alternatives: "Bring the idea. We bring the questions." / "A room for people who would rather build it.") | `copy.cover.lede` | Ours | CONFIRM |
| 3 | Problem question "Where does a good idea go to be argued with?" (2 alternatives) | `copy.problem.question` | Ours | CONFIRM |
| 4 | Problem statements: "Everyone has one. Few get tested." / "A lectern, a slide, and people who ask the rude question." / "We build that room." | `copy.problem.statements` | Ours; the second line describes what the photo archive shows | CONFIRM |
| 5 | Solution lede "We are the student entrepreneurship community of NIT Warangal. We run competitions and pitch sessions where ideas get presented, questioned and sharpened." (2 alternatives) | `copy.solution.lede` | Ours (replace with the club's own About text) | CONFIRM |
| 6 | Areas: "Competitions: Venture Vortex 2026 is our flagship..." / "Pitch sessions: On-campus sessions where students present an idea to their peers." / "Community: A room for student founders, and for the curious." | `copy.solution.areas` (also the About page until the club supplies `about.verticals`) | Row 1 verified (CONTEXT.md); rows 2-3 inferred from the photo archive and ours | CONFIRM rows 2-3 |
| 7 | Traction heading "We only print numbers we can source." and note "Each figure below carries its source. Growth figures appear here when the club supplies them." | `copy.traction` | Ours | CONFIRM |
| 8 | The bars on Home 04, labelled "Illustration. Not data." | `Traction.tsx` | Decorative, deliberately without axis or values | Verified as non-data |
| 9 | Figures: ₹50,000 prize pool; 30-31 Oct finale | `copy.facts[0..1]` | CONTEXT.md | Verified |
| 10 | "2006: Year Technozion, our host festival, was established" | `copy.facts[2]` | NITW Technozion '23 brochure PDF on nitw.ac.in (public), not from the club | CONFIRM fact |
| 11 | Chapter headings "Things we run.", "The room, mid-argument.", "The ask." and labels (Cover, The problem, The solution, Traction, Product, Flagship, Moments, Investors, The ask) | `copy.ts`, `Section` titles | Ours (navigation language) | CONFIRM tone |
| 12 | Investors: "Your name could be the first on this slide." (2 alternatives) and "No partners are listed yet. If you would like to back student founders at NIT Warangal, the partner page has what you need." | `copy.investors` | Ours; the second sentence states a fact about the current data (no consented partners) | CONFIRM; remove when partners exist |
| 13 | Ask rows: "Join the club / Recruitment details and how to apply." and "Partner with us / Back a competition, a session, or a student founder." | `Ask.tsx` | Ours | CONFIRM |
| 14 | Closing line (used): "Bring the idea. We'll bring the questions." + "Thank you / Questions?" (2 alternatives for the line) | `copy.closing`, `copy.thanks` | Ours | CONFIRM |
| 15 | Photo-set names "Club event 01/02/03" and dates "Aug 2026", "Mar 2026"; Moments captions use them | `src/data/archive.ts` | Dates are camera EXIF dates; names are neutral placeholders | CONFIRM names and dates |
| 16 | Alt text for 41 photographs (what is visible; no names) | `src/data/media.ts` | Written from looking at each image | CONFIRM; a few alts quote slide/board text without calling it an E-Club event |
| 17 | Sponsors page: three "Ways to partner" (Flagship, Event, Community partner) and their one-line descriptions | `sponsors/page.tsx` `TIERS` | **Ours, drafted structure only; the club has not defined tiers** | CONFIRM or delete |
| 18 | Team page "Roster coming" state; Events page labels "Calendar", "Sessions we have photographed" | `team/page.tsx`, `events/page.tsx` | Ours | CONFIRM tone |
| 19 | Contact form microcopy ("We do not store what you type here. Sending opens your email app.", validation messages, toast text) and the 18+ confirmation | `ContactForm.tsx` | Ours; the behaviour is real (mailto handoff, nothing stored) | CONFIRM, and replace when the backend exists |
| 20 | Join page states ("Recruitment is closed for now" etc.) | `join/page.tsx` | Driven by `site.recruitmentUrl`; wording ours | CONFIRM |
| 21 | 404 "Slide not found. That address is not in this deck." | `not-found.tsx` | Ours | CONFIRM tone |
| 22 | Page descriptions (metadata) for every route | each `page.tsx` | Ours | CONFIRM |
| 23 | Venture Vortex summary and venue | `src/data/events.ts` | CONTEXT.md | Verified |

Not in this table on purpose: legal pages (`content/legal/*.md`, human review required; still noindex) and any team or sponsor names (none published).

Count: 23 rows. Verified without review: rows 1, 8, 9, 23. Row 10 is a verified public fact the club has not confirmed. Rows 6 and 12 are half verified. All other rows need the club.
