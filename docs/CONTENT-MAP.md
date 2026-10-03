# Content map (V7, 3 Oct 2026)

Rule: every block of copy has exactly one home. Home carries a teaser and a deep link; the inner page carries the full treatment in a different layout. A block that would be repeated links instead.

| Block | Its home (data source) | Elsewhere it appears only as |
|---|---|---|
| Club line "Think. Connect. Create. Lead." | `site.quote` in `src/data/site.ts` | Hero line, one Home band (inside About), `/about` header, footer, Organization JSON-LD `slogan`. One string, one data source; each place has a different job (greeting, band, page lede, sign-off). |
| Venture Vortex facts (prize, 3 rounds, 50 startups, team size, finale) | `src/data/event.ts`, `startups.ts` | Home Numbers (five figures), Home flagship stage, Initiatives "How to take part" (four lines), `/venture-vortex` (full rules). Figures are computed from data, never retyped. |
| Round 1 rules, judging weights, FAQ (6 questions), the 50 startups | `/venture-vortex` | Initiatives has three different, shorter questions and links to the full rules. |
| How to take part (4 steps) and short FAQ | `/initiatives` | Nowhere else. |
| Club's own events (Valuation Wars, Pitch’er Perfect, The Pitch League) | `src/data/events.ts` | Home ledger (name + cover), `/initiatives` ledger (filterable), `/initiatives/[slug]` (full page), `/gallery` (grouped photos). Facts (date, venue, summary) render only when supplied. |
| Event photographs | `/gallery`, `/initiatives/[slug]` | One cover per event in two ledgers. Never in hero, vortex or posters. None render until `photoConsent` is set. |
| Posters (four) | Home, section 07 | Linked from the Venture Vortex page. The poster text sits under each. The Initiatives page no longer repeats the poster wall. |
| Partners of Venture Vortex 2026 | `src/data/partners.ts` (scope `venture-vortex-2026`) | Home 08 (logo cells), `/sponsors` block 2, `/venture-vortex` ledger. The footer no longer lists partners. |
| Club sponsors and partners | `/sponsors` block 1 (scope `club`, empty today) | Nowhere. |
| About, mission, manifesto | `/about` | Home About is one paragraph and a link. |
| Think / Connect / Create / Lead reading | `/about` | Nowhere. |
| Faculty mentor | `about.facultyCoordinator` | `/about` and `/team` ("who runs this"), same field. |
| Reach map and eligibility | Home 05 | Nowhere (the Venture Vortex page keeps its own eligibility in FAQ and facts strip). |
| Contact points (email, Instagram, LinkedIn) | `ContactLedger` component | Home Join (with icons), `/contact` (with Copy email), footer (one line each, global chrome). |
| Contact form and its four types | `/contact` | Home Join and `/sponsors` deep-link to `/contact#join`, `#query`, `#sponsor`. |
| Legal | `content/legal/*.md` | Footer links. |

Layouts differ by design: Home = ledgers and bands; About = long-form editorial with a sticky index; Initiatives = filterable ledger + steps; Event page = photo-led; Contact = two columns with tabs; Sponsors = two scoped blocks.
