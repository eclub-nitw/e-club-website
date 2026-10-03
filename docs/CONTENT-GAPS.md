# What the club still has to supply (3 Oct 2026)

Each line is blank on the site today because no verified fact exists. Paste answers into `docs/CONTENT-INTAKE.md` (or tell Claude in chat); only then does the matching data field get filled. Nothing below is invented in the meantime.

## Blocking
1. **Consent for the 18 event photographs** (everyone visible), per event: one sentence on the basis, e.g. "club-confirmed on <date>". Set in `src/data/events.ts` (`photoConsent`). Until then no event photograph is shown anywhere.
2. **Written permission from the institute to show the NIT Warangal emblem.** `public/images/brand/nitw-logo.webp` is ready; flip `site.showInstituteLogo` after permission.
3. **The official E-Club logo file** (PNG with transparency, at least 800px wide). It is not in the repo (a `LOGO.png` found in a personal Downloads folder is a different brand and was not used). Until it is supplied the nav and footer show the site's own three-bar glyph.

## Per event (Valuation Wars, Pitch’er Perfect, The Pitch League)
- Date(s), venue, one-line format, and whether any speakers or judges may be named. Fields: `dateStart`, `dateEnd`, `venue`, `summary`. Event JSON-LD appears automatically once a date and venue exist.

## The club
- Founding year (`site.foundedYear`), the mission line the club approves (`about.mission`), what the club runs year-round (`about.verticals`), a timeline (`about.timeline`).
- Team roster: names, roles, batch, and portrait consent per person (`src/data/team.ts`). The general secretary's name and any other public roles.
- The institute's postal address as printed on nitw.ac.in, and the page that prints it (`site.campusLine`).
- Club-wide sponsors or partners, with written permission to show logos (`src/data/partners.ts`, scope `club`). Logo files for the Venture Vortex partners (`public/images/partners/<slug>.webp`, then set `logo` and `consent`).
- Testimonials with written permission (`voices`), speakers with consent (`speakers`).
- What really happens after someone writes to the club (a "What happens next" list on `/contact` appears only when this is supplied).
- Whether the "Under 18? Email us instead" notice is approved (see `docs/LEGAL-REVIEW-NOTES.md` V7-1).
- Sponsorship brochure link, YouTube channel, recruitment form (all optional).

## To confirm
- "Masters' Union" spelling and the 23:59:59 IST registration cut-off (open since V6).
- The "How we read it" wording on `/about` and the Home About paragraph (`docs/COPY-REVIEW.md`).
