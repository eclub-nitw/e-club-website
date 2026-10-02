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
| 7 | "Campus to India / Two rounds online, open across the country. The finale is on our campus." and the four phase labels | `CampusToIndia.tsx`, `copy.reach` | Dates and eligibility from `event.ts`; Warangal is public geography | CONFIRM wording; **the faculty coordinator must review the India map depiction** (see ASSETS) |
| 8 | Flagship stage copy ("Total prize pool", eligibility sentence, rounds list) | `FlagshipStage.tsx` | `event.ts` | Verified |
| 9 | "Event posters / Our own flyers, newest first. Event photographs are in the Gallery." | `copy.posters` | Ours | CONFIRM |
| 10 | Poster text transcriptions (shown as HTML under each poster) | `posters.ts` | Read off the club's own posters | Verified against the images |
| 11 | Backed by: Master's Union (in collaboration with), Unstop (powered by), School2Startup (outreach partner), Technozion (part of), **Uplearn by Upstox (knowledge partner)** | `sponsors.ts` | First four from `event.ts`. **Uplearn is on the official poster but not in `event.ts`; owner to confirm.** | CONFIRM Uplearn |
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
| 24 | Page descriptions (metadata) for every route | each `page.tsx` | Ours | CONFIRM |

## Posters: consent records (`src/data/posters.ts`)
| Poster | Shown | Basis |
|---|---|---|
| `vv-announcement` (Technozion, E-Club, Master's Union, Unstop, Uplearn, S2S logos) | yes | `consent: "club-owned poster, confirm"` (partner logos appear as part of the club's own poster) |
| `vv-why` ("Why participate", no faces, no logos) | yes | `consent: true` |
| `venture_vortex2` ("Decode, Craft, Defend": a woman's face in a stock-style photograph) | **no** (not built, not shipped) | Owner to confirm it is club material and may be shown |
| `venture_vortex3` ("Timeline": a group of identifiable people; dates 22 Sep to 3 Oct registration differ from the Unstop timeline the owner declared authoritative) | **no** | Owner to confirm the people's consent and which dates are right |

## Other items needing a human
- **India map** (`src/data/india-map.ts`): outline from Natural Earth's India point-of-view dataset, which follows the boundary as recognised by India. Map depiction is legally sensitive in India: the faculty coordinator should review it before launch.
- **Faculty mentor line**: the public NITW student-welfare page lists Prof. Altaf Q. H. Badar (Electrical Engineering) as the club's mentor. Not shown; `about.facultyCoordinator` is `null` until the owner confirms.
- **Legal pages** (`content/legal/*.md`): untouched, still noindex drafts.
- Not attributed to the club: NITW E-Summit '25 and Technozion achievements. "Business Club NITW" (@bclubnitw) is a different club and is not used anywhere.

Not in this table on purpose: legal pages and any team or sponsor names beyond the poster's (none other published).
