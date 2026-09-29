# Kickoff prompts (paste as your FIRST message after loading AGENTS.md + docs)

## Wahid — shell, Home, SEO, deploy
I am Wahid, head of the E-Club tech team. Follow AGENTS.md. Task 1: build the shared shell in `src/components/ui/` (Container, Section with numbered mono label, Button, Nav with mobile sheet and a gold "Venture Vortex 2026" button, Footer with sitemap columns and legal links) and wire it into `layout.tsx`. Task 2: build Home per docs/SITEMAP-AND-PAGES.md using "The Ledger" design (docs/DESIGN.md) including the scroll-drawn gold growth line. Facts come from `src/data/*`; where the club hasn't supplied numbers, render only sections that don't need them. Also generate `opengraph-image`, favicon set and manifest. Plan → build → Lighthouse test list.

## Saad — Events, Gallery, Venture Vortex route
I am Saad on the E-Club tech team. Follow AGENTS.md. Task: `/events` (ledger list, filters by type and year, upcoming pinned), `/events/[slug]` (static params from `src/data/events.ts`, Event JSON-LD, gallery with keyboard-accessible lightbox, lite YouTube facade on youtube-nocookie.com), `/gallery`, and later merge the Venture Vortex page as `/venture-vortex` per the merge plan in docs/SITEMAP-AND-PAGES.md. Never embed Google Drive videos. Add each route to `sitemap.ts`. Plan → build → tests.

## Shroth — About, Team, Sponsors, Contact, Join, legal pages
I am Shroth on the E-Club tech team. Follow AGENTS.md. Task: `/about`, `/team` (+ `/team/[year]`, grouped by role, photo only when `photoConsent` is true), `/sponsors` (logo wall with the disclaimer nearby, "why partner with us" section that only uses verified numbers — leave TODO data if unknown), `/contact` (email + socials, no phone numbers; form comes in phase 2), `/join`, and legal routes that render `content/legal/*.md` (do not edit legal text). Add routes to `sitemap.ts`, unique metadata each. Plan → build → tests.
