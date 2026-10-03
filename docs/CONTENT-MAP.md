# Content map (V8, 3 Oct 2026)

Rule: every block of copy has exactly one home. Home carries a teaser and a deep link; the inner page carries the full treatment in a different layout. A block that would be repeated links instead.

**The club is the subject; one initiative is featured while it runs.** Venture Vortex words appear only where `docs/V8-ANALYSIS.md` and `scripts/qa-v8-generic.mjs` allow them: the nav spotlight button, the Home hero chip, ticker, Initiatives row and spotlight block, `/initiatives` (one row and "How to take part"), `/venture-vortex`, the event-partners block on `/sponsors`, and Event JSON-LD. Everything is driven by `src/data/spotlight.ts` and disappears seven days after the finale.

| Block | Its home (data source) | Elsewhere it appears only as |
|---|---|---|
| Club line "Think. Connect. Create. Lead." | `site.quote` in `src/data/site.ts` | Hero line, ticker, the dive heading, `/about` header and four-word ledger, footer, Organization JSON-LD `slogan`, Home meta description. One string, one data source. |
| Club identity (logo, institute, faculty mentor, email, Instagram, LinkedIn) | `site.ts`, `about.ts` | Home "At a glance" plate (a summary), `/about` ("Faculty mentor", "Find us"), footer, `/contact` top row. |
| Who we are, mission | `/about` (manifesto, `about.mission`) | Home About: one paragraph and a link. |
| Think / Connect / Create / Lead, one reading each | `/about` | The dive's captions use the same four lines (`src/data/dive-groups.ts`); both CONFIRM. |
| Initiatives: Valuation Wars, Pitch’er Perfect, The Pitch League, and the one in the spotlight | `src/data/events.ts` | Home "What we run" (four equal rows), `/initiatives` (All / Upcoming / Past tabs, larger rows), `/initiatives/[slug]` (full page for the three past events), ticker (names). |
| Event photographs | `/gallery`, `/initiatives/[slug]` | One cover per event on Home "From the floor". None render until `photoConsent` is set. |
| The spotlight: poster, key facts, countdown, Register, rounds, "Campus to India" map, event partners | Home spotlight block (while promoted) | `/venture-vortex` has the full treatment (rules, Round 1, the 50 startups, FAQ, the four-poster wall); `/initiatives` "How to take part" is one row with its own link. |
| Round 1 rules, judging weights, FAQ, the 50 startups, four posters | `/venture-vortex` | Nowhere. |
| Partners of the featured competition | `src/data/partners.ts` (scope `venture-vortex-2026`) | Home spotlight block (white plates, logos only with consent), `/sponsors` event-partners block, `/venture-vortex` ledger. |
| Club sponsors and partners | `/sponsors` block 1 (scope `club`, empty today) | Home partners block when non-empty. |
| Club-wide numbers | `src/data/club-stats.ts` (empty) | Home ledger row when filled. Never the competition's figures. |
| Contact points (email, Instagram, LinkedIn) | `ContactLedger` | Home Join, `/contact` top row, `/about` "Find us", footer (one line each). |
| Contact: club questions, joining, hello | `/contact` box A (`#contact`, `#join`) | Home Join rows deep-link here. |
| Contact: sponsorship, partnership, media | `/contact` box B (`#sponsor`) | Home Join row 3 and `/sponsors` link here. |
| Legal | `content/legal/*.md` | Footer links. |

Layouts differ by design: Home = ledgers, a plate and bands; About = long-form editorial with a sticky index and four large word rows; Initiatives = filterable ledger; Event page = photo-led; Contact = contact ledger over two boxes side by side; Sponsors = two scoped lists; Venture Vortex = poster-in-hero landing page in its own theme.
