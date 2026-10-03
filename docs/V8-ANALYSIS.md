# V8 analysis (3 Oct 2026, written before any V8 change)

Branch `claude/v8-2026-10-03` from `main` = `a16bdeb`. Owner flags in the launch line were not filled (the template placeholders `<yes|no>` were pasted as-is), so all three are treated as `no`: photos hidden, NITW emblem hidden, partner logos hidden. Re-run with the flags set and the three data lines flip (see `docs/LEGAL-REVIEW-NOTES.md`, V8 section).

## A1. Deployment parity: production is current
`git rev-parse main origin/main` = `a16bdeb8b98c…` for both. I built `main` locally (`next build`, `next start -p 3100`) and compared the visible text (scripts and tags stripped) of eight routes against `https://e-club-nitw.vercel.app` fetched with `Cache-Control: no-cache` and a `?v=<timestamp>` query:

| Route | Local build vs production |
|---|---|
| `/`, `/about`, `/initiatives`, `/venture-vortex`, `/sponsors`, `/contact`, `/gallery`, `/team` | identical text |

Production Home contains "Venture Vortex in numbers", "Campus to India" and the V7 meta description; it contains none of "Bring the idea", "Backed by" (as a title), "Every company starts". **Conclusion: the deployment is not mixed.** The older copy the previous chat saw came from a stale cached fetch on its side. Nothing to fix in Vercel.

## A2. Production screenshots
`docs/handoff/v8/before/`, produced by `scripts/v8-shots.mjs` (9 routes x 390, 768, 1366x768, 1440, 1920, full page, after scrolling so on-enter animations fire). No horizontal scroll at any size.

## A3. Topic 3 diagnosis (Home About, right side empty)
Measured with `scripts/v8-diagnose-about.mjs` on the production build at 1366x768, 1440x900, 1920x1080:

| Hypothesis | Result |
|---|---|
| (a) masked reveal never fires | **False.** `.mask-in` is set, 32 mask words present. |
| (b) artwork is dark and reads as empty | **False as the cause.** The element never paints (see below), so luminance is irrelevant. |
| (c) grid column wider than content | **Partly true, and it is the real cause.** The grid is 1200px wide; column 2's track exists but the item inside it measures **0 x 0 px** (`crop: [1283, 545, 0, 0]` at 1366). |
| (d) image lazy and blank | **False.** `img.complete = true`, natural 448x192, opacity 1. |

**Root cause:** the right-hand element carries `lg:justify-self-end` and `lg:max-w-md` but no width. Its only child is `position:absolute`, so its shrink-to-fit width is 0, and `aspect-[4/3]` of 0 is 0 height. The artwork is loaded and revealed but has no box. A symptom fix (taller art, other art) would not have helped. The fix is structural: the right column becomes a plate with a real width (`w-full`), content in normal flow, equal height with the left column (C3).

## A4. VV-bleed inventory (competition words outside files that own the competition)
Owned by the competition and allowed to keep it: `src/data/event.ts`, `startups.ts`, `timeline.ts`, `posters.ts`, `src/features/venture-vortex/*`, `src/app/venture-vortex/page.tsx`, `src/lib/phase.ts` (to be parameterised by `spotlight.ts`).

| Where | What bleeds | Verdict |
|---|---|---|
| `src/app/page.tsx:13,25,36-47` | meta description; five Venture Vortex sections; ticker lines (rounds, Technozion, prize); stats band | rewrite (B, C) |
| `components/home/Numbers.tsx`, `FlagshipStage.tsx`, `CampusToIndia.tsx`, `Sections.tsx` (PosterWall, PartnersBlock) | whole sections are the competition | move into the spotlight block / delete Numbers and PosterWall from Home |
| `components/home/Initiatives.tsx` | flagship poster + rounds as the only large item | four equal rows |
| `components/home/Hero.tsx` + `PhaseActions` | hero primary CTA = Register / "Venture Vortex 2026", countdown in hero | CTAs "Explore initiatives" / "Get in touch"; countdown out |
| `components/home/VortexExpand.tsx:48,61` | heading "Venture Vortex 2026", aria label | motto heading, spotlight outro |
| `components/ui/Nav.tsx:22-26` | Register pill / "Venture Vortex" button | spotlight button from data, hidden when over |
| `components/ui/FloatingPill.tsx` | pill on every route except the VV page | only `/`, `/initiatives`, `/venture-vortex` |
| `data/copy.ts:7,15,19` | `numbers`, `flagship`, `backed` keys | club-generic keys; competition copy under `spotlight` |
| `data/about.ts:5` | `manifesto` ends with a Venture Vortex sentence (Technozion, prize) | replace |
| `app/about/page.tsx:20-59` | the four-word motto mapped to Rounds 1-3 (wrong, from the V7 brief) | remove; generic About |
| `app/layout.tsx:14`, `app/opengraph-image.tsx:13` | default description and OG image text mention Venture Vortex | generic |
| `app/sponsors/page.tsx:13,19,43-48` | meta description + intro | keep the event-partners block, generic everywhere else |
| `app/initiatives/page.tsx` | meta, "How to take part: four steps through Venture Vortex", FAQ | one Venture Vortex row; take-part ledger scoped to that row |
| `lib/jsonld.ts:44-45` | Technozion in Event JSON-LD | allowed (Event JSON-LD) |
| `content/legal/PRIVACY.md:18`, `TERMS.md:9` | mention Unstop | **legal text, not edited**; flagged in LEGAL-REVIEW-NOTES; the generic test lists these as known exceptions |
| `globals.css:198,210` | comments only | no change |

## A5. Reference pass (structure only; no copy, layout or assets taken)
Pattern from `docs/PARITY-V5.md` (V5 research of ecell.iith.ac.in, ecell.in, ecell.iitm.ac.in). The three sites were not re-opened in this run: nothing in V8 needs new reference data beyond the brief's stated pattern.

| Order | Reference section (type of content) | Our equivalent after V8 | Data exists? |
|---|---|---|---|
| 1 | Hero: identity, one line, CTA | Hero: "E-Club NIT Warangal", motto, Explore initiatives / Get in touch, one spotlight chip | yes |
| 2 | Announcement ticker | Ticker: club items first, spotlight second (`announcements.ts`) | yes (names, motto, initiative names) |
| 3 | Club-wide proof numbers (IITB) | none renders; one ledger row appears when founding year / members / events are supplied | **no** (CONTENT-GAPS) |
| 4 | About / what we do | About: text left, "At a glance" plate right | yes (facts only) |
| 5 | Initiatives / events tiles | "What we run": four equal ledger rows | yes |
| 6 | Event photos / gallery strip | "From the floor": three photos | yes, hidden until consent |
| 7 | (none has a flagship countdown) | the dive (kept) then the one time-boxed spotlight block | yes |
| 8 | Speakers, testimonials | data-gated | no |
| 9 | Sponsors ("backed by" grid, IITH) | club partners data-gated; event partners inside the spotlight block | partly |
| 10 | Contact + footer partner CTA | Join: three-door ledger + contact lines + two contact boxes on `/contact` | yes |

## Decisions recorded before building
- `phase.ts` keeps its date maths; its labels and links read the spotlight (`spotlight.ts`). Date states stay in one file.
- "Sunset" is evaluated server-side at render/revalidate time and in the browser clock for the client leaves (same two-layer approach V6 used for phases).

## A7. Venture Vortex hero: why the poster is "below" (S7)
Measured at 1366x768: the hero grid is `610px 509px` (two columns exist) but its second child, the `<picture>`, has a 0x0 box. V7 added `picture { display: contents }` in `globals.css:293`, so a `<picture>` used directly as a grid item loses the `mx-auto block w-full max-w-sm` classes it was given and the image falls out of the intended column. Fix in G: wrap the poster in a real `div` that owns the column and the `max-height: 82vh` rule; never classify a `<picture>`.
