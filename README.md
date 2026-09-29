# E-Club NIT Warangal — official website

Next.js (App Router, TypeScript) + Tailwind v4. Static, no database. Content lives in `src/data/*` and `content/legal/*`.

## Setup
```bash
git clone <REPO_URL> E-club-website
cd E-club-website
npm install
npm run dev       # http://localhost:3000
```
Node 20+.

## Workflow
`git checkout main && git pull` → `git checkout -b yourname/feature` → commit small → `git push -u origin yourname/feature` → open a PR → reviewer merges. Never push to `main`.

## Adding content
- New event: add an entry to `src/data/events.ts`, put photos in `public/images/events/<slug>/` (run `node scripts/optimize-images.mjs`), upload video to the club YouTube and paste the video ID.
- New team member: `src/data/team.ts` + photo in `public/images/team/`. Record consent in the `photoConsent` field.
- Legal text: `content/legal/*.md` (review required before any edit goes live).

## Read first
`AGENTS.md` · `docs/CONTEXT.md` · `docs/DESIGN.md` · `docs/SITEMAP-AND-PAGES.md` · `docs/TASKS.md` · `docs/SEO-LEGAL-CHECKLIST.md`
