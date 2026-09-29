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
