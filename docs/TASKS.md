# Who builds what — E-Club website

Team: **Wahid** (head of tech; architecture, Home, SEO, legal integration, deploy, review), **Saad** (events engine, gallery/video, Venture Vortex route), **Shroth Parek** (About, Team, Sponsors, Contact/Join, legal pages). Satyam and Sumit are on the landing page and midsems; add them later for small tasks (image optimisation, content entry).

| Owner | Own these paths | Deliverables |
|---|---|---|
| **Wahid** | repo, `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/ui/*` (shell: Nav, Footer, Button, Section), `src/data/site.ts`, `sitemap.ts`, `robots.ts`, metadata, deploy, domain | scaffold on `main` first; Home; SEO; launch |
| **Saad** | `src/app/events/**`, `src/app/gallery/**`, `src/features/venture-vortex/**`, `src/data/events.ts`, `components/ui/{EventRow,Gallery,VideoEmbed}` | events index + detail, gallery + video, VV merge |
| **Shroth** | `src/app/{about,team,sponsors,contact,join}/**`, legal routes, `src/data/{team,sponsors}.ts`, `components/ui/{TeamMember,SponsorLogo,FormField}`, `content/legal/*` | About, Team, Sponsors, Contact, Join, legal pages |

## Milestones (proposal — no hard deadline yet; adjust)
| Week | Goal |
|---|---|
| 1 | Shell (nav, footer, tokens, fonts) + Home + component library; Drive content inventory; domain chosen |
| 2 | Events index/detail with real data; Team; Sponsors; About; Venture Vortex merged as `/venture-vortex` |
| 3 | Gallery + video; legal pages reviewed by faculty; forms; SEO pass; Lighthouse; launch on the new domain |

## Rules
Same PR workflow as Venture Vortex: branches `name/feature`, PRs to `main`, reviewer ticks the checklist, no direct pushes to `main`. Content changes (adding an event/team member) are PRs that touch only `src/data/*` and `public/images/*`.

## What remains per person (V6, 2 Oct 2026)
- **Wahid** (shell, SEO, deploy): rotate the Firebase key (`docs/KEY-ROTATION.md`); buy the domain and run `docs/DOMAIN-CUTOVER.md`; Search Console and link-preview checks; merge `claude/v6-2026-10-02` after review; turn on branch protection and Dependabot security updates (suggested, not enabled).
- **Saad** (events, gallery, Venture Vortex route): supply past-event names, dates and descriptions for `src/data/archive.ts` and `events.ts` via `docs/CONTENT-INTAKE.md` section 2; confirm photo consent per person where possible (today only a blanket club statement of 30 Sep); real-phone checks of `/gallery` and `/venture-vortex`.
- **Shroth** (About, Team, Sponsors, Contact, legal): team roster with roles and written portrait consent; sponsor logo consents; testimonials; take `docs/LEGAL-REVIEW-NOTES.md` to the faculty reviewer and decide each row; contact-form wording.
