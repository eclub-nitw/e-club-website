# COPY REVIEW (V5): every public sentence the club must approve before launch

Rule: a public sentence is allowed without review only if it comes from `docs/CONTEXT.md`, `src/data/event.ts` (the verified Venture Vortex facts) or the club's own words in `docs/CONTENT-INTAKE.md` (still empty on 2 Oct 2026). Everything else is **CONFIRM**. Voice: short, first-person plural, dry, no clichés. Section titles follow the IIT E-Cell register (2 to 4 words plus one supporting line) but are our own wording.

| # | Public text | Where | Source | Status |
|---|---|---|---|---|
| 1 | "E-Club NIT Warangal" (title, h1, footer, JSON-LD name, OG) and sub-label "Entrepreneurship Club" | `site.ts`, `copy.hero` | Club name | Verified |
| 2 | Tagline "Bring the idea. We bring the questions." | `copy.hero.tagline` | Ours | CONFIRM |
| 3 | "Venture Vortex in numbers / Verified facts about this year's flagship. Not lifetime club figures." and the five figures (3 rounds, 50 startups, 2-4 per team, Rs 50,000, 30-31 Oct) | `Numbers.tsx`, `copy.numbers` | `event.ts`, `startups.ts` | Figures verified; title and line CONFIRM |
| 4 | About: "Who we are / The students who run entrepreneurship at NIT Warangal." and the lede "We run competitions and pitch sessions where ideas get presented, questioned and sharpened. Bring a startup you admire or one you have not built yet." | `copy.about` | Ours (replace with the club's own About text) | CONFIRM |
| 5 | About page lede (manifesto): "Entrepreneurship Club is the student community at NIT Warangal for people who build or want to. This year our flagship is Venture Vortex 2026..." | `about.manifesto` | First sentence ours; second verified | CONFIRM first sentence |
| 6 | "What we run / Competitions first. More as the club confirms them." and Venture Vortex rows | `copy.initiatives`, `Initiatives.tsx` | Rounds verified | CONFIRM wording |
| 7 | "Campus to India / Two rounds online, open across the country. The finale is on our campus." and the four phase labels | `CampusToIndia.tsx`, `copy.reach` | Dates and eligibility from `event.ts`; Warangal is public geography | CONFIRM wording. India map depiction reviewed and approved by the owner / faculty coordinator on 2 Oct 2026 (see ASSETS) |
| 8 | Flagship stage copy ("Total prize pool", eligibility sentence, rounds list) | `FlagshipStage.tsx` | `event.ts` | Verified |
| 9 | "Event posters / Our own flyers, newest first. Event photographs are in the Gallery." | `copy.posters` | Ours | CONFIRM |
| 10 | Poster text transcriptions (shown as HTML under each poster) | `posters.ts` | Read off the club's own posters | Verified against the images |
| 11 | Backed by: Master's Union, Unstop, School2Startup, Technozion, Uplearn by Upstox (knowledge partner) | `sponsors.ts`, `event.ts` | Official poster; Uplearn confirmed by the owner 2 Oct 2026 | Verified |
| 12 | Disclaimer line near names: "Names are trademarks of their respective owners; appearing here does not imply endorsement, partnership or sponsorship unless explicitly stated." | `Sections.tsx`, Footer | Wording taken from `content/legal/DISCLAIMER.md` (itself an unreviewed draft) | **Legal review needed** |
| 13 | "Join us / Come to an event, or write to us." and Contact "Before you write" paragraph | `copy.join`, `contact/page.tsx` | Ours | CONFIRM |
| 14 | Closing line "Every company starts as an argument in a room." | `copy.closing` | Ours | CONFIRM |
| 15 | Ticker lines (registration live, round dates, "Part of Technozion", prize pool) | `app/page.tsx` | `event.ts` | Verified |
| 16 | Floating pill wording: "Register on Unstop", "Round 1 closed · Round 2 opens 11 Oct", "Round 2 in progress", "Finale on campus, 30-31 Oct", "Finale on campus" | `register-state.ts` | Derived from the Unstop timeline; the in-between wordings are ours | CONFIRM wording |
| 17 | Photo-set names "Club event 01/02/03" and dates "Aug 2026", "Mar 2026" (Gallery filters) | `archive.ts` | Camera EXIF dates; names are neutral placeholders | CONFIRM |
| 18 | Alt text for 41 gallery photographs | `media.ts` | Written from looking at each image | CONFIRM |
| 19 | Sponsors page: three "Ways to partner" and descriptions | `sponsors/page.tsx` `TIERS` | **Drafted structure only; the club has not defined tiers** | CONFIRM or delete |
| 20 | Team "Roster coming"; Initiatives "Past events will be listed here when the club supplies them." | pages | Ours | CONFIRM |
| 21 | Contact form microcopy, 18+ confirmation, "Sending opens your email app." | `ContactForm.tsx` | Ours; behaviour is real (mailto hand-off, nothing stored) | CONFIRM; replace when the backend exists |
| 22 | Venture Vortex page: FAQ answers, Round 1/2/3 sections | `features/venture-vortex` | `event.ts` (official brief and Unstop panel) | Verified; the "WhatsApp group from Unstop" answer is the confirmed 29 Sep mechanism |
| 23 | 404 "Slide not found. That address is not in this deck." | `not-found.tsx` | Ours | CONFIRM tone |
| 25 | Forms: "We use your details only to reply to you."; success and fallback toasts | `ContactForm.tsx` | Ours; **the privacy policy (human-reviewed legal text, not edited by me) must be checked against docs/BACKEND.md before the backend is switched on** | Legal review |
| 24 | Page descriptions (metadata) for every route | each `page.tsx` | Ours | CONFIRM |

## Posters: consent records (`src/data/posters.ts`)
On 2 Oct 2026 the owner confirmed all four posters are the club's own, that their dates are correct, and that they may be shown. All four ship.
| Poster | Basis |
|---|---|
| `vv-announcement` (partner logos) | `"club-owned poster, owner confirmed 2026-10-02"` |
| `vv-tracks` (Decode, Craft, Defend; a woman's face) | same |
| `vv-timeline` (Timeline; a group of people) | same |
| `vv-why` (no faces, no logos) | `true` |

**Dates changed on 2 Oct 2026 (owner):** the timeline poster is the source. Registration 22 Sep to 3 Oct, Round 1 submissions 24 Sep to 9 Oct 08:00, result 10 Oct, Round 2 track lock 11 to 18 Oct, Round 3 30 to 31 Oct. The poster gives dates only; registration is treated as closing at the end of 3 Oct IST and the 08:00 submission cut-off is kept from Unstop (CONFIRM the exact times). The poster prints "Result Oct 10" under Round 2 as well; it is transcribed as printed in the poster text and not used anywhere else.

## Other items needing a human
- **Faculty mentor line** (Prof. Altaf Q. H. Badar, Electrical Engineering): from the public NITW student-welfare page; approved by the owner on 2 Oct 2026 and shown on /about.
- **Legal pages** (`content/legal/*.md`): untouched, still noindex drafts.
- Not attributed to the club: NITW E-Summit '25 and Technozion achievements. "Business Club NITW" (@bclubnitw) is a different club and is not used anywhere.

Not in this table on purpose: legal pages and any team or sponsor names beyond the poster's (none other published).
