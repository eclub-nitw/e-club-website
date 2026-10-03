# Legal drafts vs what the site actually does (for the faculty reviewer)

Claude did not edit any legal text. This list quotes each draft line that conflicts with, or omits, a fact in `docs/DATA-INVENTORY.md`. Robots state today: all five legal routes render with `robots: { index: false, follow: true }` (`src/app/[legal]/page.tsx:15`) and are left out of `sitemap.ts`. They stay noindex until review is done.

| File:line | Draft says | Fact in the code | Reviewer action |
|---|---|---|---|
| PRIVACY.md:11 | "cookieless analytics ([[Vercel Analytics / Plausible]])" | **There is no analytics at all.** | Remove or confirm if analytics is added later. |
| PRIVACY.md:11 | IP, browser, pages visited "processed by our hosting provider" | True for Vercel's standard request logs; the site itself logs nothing. | Keep, name Vercel. |
| PRIVACY.md:10 | "[[List exactly what each form collects.]]" | Name, email, message, form kind, timestamps; an 18+ tick that is required but not stored. | Fill from DATA-INVENTORY. |
| PRIVACY.md:15 | "only if you ask, to send updates about club events" | **No mailing list, newsletter or update sending exists.** | Delete or keep as future. |
| PRIVACY.md:18 | "Forms: [[Google Forms / email provider]]" | Forms post to the site's own API and are stored in Google Cloud Firestore (region asia-south1, Mumbai); a `mailto:` fallback uses the visitor's email app. No Google Forms. | Replace with Google (Firebase) and Vercel as processors. |
| PRIVACY.md:18 | "These providers may process data outside India." | Firestore location is Mumbai; Vercel serves from its network; Google/Vercel are US companies. | Reviewer to word. |
| PRIVACY.md:21 | "Messages: [[12 months]] then deleted. Mailing-list details until you unsubscribe." | 12 months is enforced by a daily job. **No mailing list exists.** | Confirm 12 months; drop mailing-list sentence. |
| PRIVACY.md:21 | "Server logs: as per the provider's retention" | Vercel's own retention; not controlled by the site. | Keep. |
| PRIVACY.md (absent) | — | A hashed client address is held in server memory for at most 10 minutes for rate limiting; never stored. | Consider mentioning. |
| PRIVACY.md (absent) | — | Who can access the stored messages (Firebase/Vercel project members). | Reviewer to decide. |
| PRIVACY.md:12 | "do not knowingly collect… under 18" | The form requires an "I am 18 or older" tick; API refuses without it. | Consistent. |
| PRIVACY.md:24 | rights; response "[[30]] days" | Process in `docs/DELETION-RUNBOOK.md`. | Reviewer to set the number. |
| COOKIES.md:6 | "[[If using Vercel Analytics or Plausible: …]]" | No analytics, no cookies set by the site (no `document.cookie`, localStorage or sessionStorage use). | Delete the bracketed clause. |
| COOKIES.md:8 | "Google Forms links open on Google's site" | No Google Forms link is on the site today (`recruitmentUrl` is empty). Links to Unstop and Instagram/LinkedIn exist. | Replace with the links that exist, or leave if recruitment form is added. |
| COOKIES.md:8 | videos load from youtube-nocookie "only after you click play" | The CSP allows `youtube-nocookie.com`; the Venture Vortex page uses no video embed today. | Confirm when videos are added. |
| TERMS.md:8 | "[[Confirm wording with the institute.]]" | — | Open item. |
| TERMS.md:15 | governing law "[[Warangal, Telangana]]" | — | Open item. |
| DISCLAIMER.md | whole file | The site shows startup logos (fetched from each company's own site) on `/venture-vortex` and partner **names** (no logos, `consent: false`) in "Backed by". A disclaimer line (`startupsDisclaimer`, and the partner line) appears beside each. | Reviewer to confirm that logo use is acceptable. |
| ACCESSIBILITY.md:4 | claims WCAG 2.2 AA aim | Axe/Lighthouse a11y 96 to 100; not tested with a real screen reader (see BUILD-LOG-V6 "Not tested"). | Keep as "aim". |
| All | "Last updated: [[DATE]]" and the DRAFT banners | — | Remove at publication. |

`G3` (forms 18+): the form shows "I am 18 or older." and the API rejects a missing tick (`contact-schema.ts`, tested in `scripts/test-api.mjs`). There is no separate privacy-consent checkbox; the reviewer decides whether the policy requires one.


## V7 additions (3 Oct 2026)
Claude wrote no legal text. These are facts and owner decisions the reviewer needs.

| # | Item | Fact | Reviewer action |
|---|---|---|---|
| V7-1 | **18+ checkbox removed** | The owner asked for the "I am 18 or older" checkbox to be removed. The form no longer asks for age and the API refuses an `age` field. A replacement notice, "Forms here are for people aged 18 and over. Under 18? Email us instead.", is stored as `site.forms.noticeLine` (`src/data/site.ts`) and is **not shown** until `site.forms.noticeApproved` is set to true. Until then the form shows only "We use your details only to reply to you." with a link to the Privacy Policy. Claude does **not** claim this removal is compliant: review it against India's Digital Personal Data Protection Act 2023 (data of minors) and `PRIVACY.md:12` ("do not knowingly collect... under 18"), which no longer matches how the form enforces it. | Decide the wording and whether a consent control is required; approve or replace the line. |
| V7-2 | New form fields | Join: optional branch and year. Sponsor / Partnership: organisation (required) and optional website. All stored with the message (see DATA-INVENTORY). Other fields are refused. | Update PRIVACY.md:10 "what each form collects". |
| V7-3 | **NIT Warangal emblem** | `nitw.png` was supplied by the owner; it is processed and in the repo but shown nowhere (`site.showInstituteLogo` is false). Showing the institute's name/emblem likely needs the institute's written permission (Q2). | Obtain permission, then set the flag. |
| V7-4 | **Event photographs** | 18 photographs of students at three events are in the repo but not rendered (`photoConsent` is null). People are recognisable in most frames. | Obtain and record the consent basis per event; the owner then sets `photoConsent` (one line per event). |
| V7-5 | Partner names and logos | Partners are now scoped: Unstop, Masters' Union, School2Startup, Uplearn by Upstox and Technozion appear only as partners of Venture Vortex 2026 (Home, `/sponsors`, the Venture Vortex page). Names are plain text; a logo shows only with a file, `consent: true` and a `logo` entry. The trademark disclaimer line stays beside every partner list. Event JSON-LD lists the four partners as `contributor` (not `sponsor`) and Technozion as `superEvent`; Organization JSON-LD lists none. | Confirm the roles wording and the `contributor` choice. |
| V7-6 | Club line | "Think. Connect. Create. Lead." and "Entrepreneurship Club - NITW" were supplied by the owner on 3 Oct 2026 (`site.quote.source`). Used in the hero, a Home band, About, the footer and Organization JSON-LD `slogan`. | None unless it is a registered mark. |
| V7-7 | About reading of the line | `/about` matches each word of the line to a round of Venture Vortex, using only facts from `src/data/event.ts`. The framing is editorial. | Club to approve (`docs/COPY-REVIEW.md`). |
| V7-8 | Campus address | A postal-address line on `/contact` is supported (`site.campusLine`) but empty: nitw.ac.in is script-rendered and its address could not be read in the V7 run. | Supply the address and the page that prints it. |

## V8 additions (3 Oct 2026)
Claude wrote no legal text. Facts and owner decisions for the reviewer.

| # | Item | Fact | Reviewer action |
|---|---|---|---|
| V8-1 | **Owner flags not set in the launch line** | The V8 brief carried the template `PHOTO_CONSENT=<yes\|no> INSTITUTE_EMBLEM_PERMISSION=<yes\|no> PARTNER_LOGOS_APPROVED=<yes\|no>` unfilled. Treated as `no`: `photoConsent` stays `null` on all three events (no photograph renders anywhere), `site.showInstituteLogo` stays `false`, partner `consent` stays `false` (partner names render as plain wordmarks). | When the owner confirms, set the three fields. For photos the brief fixes the string: `"Club owner (Abdul Wahid) confirmed consent of the people shown, 3 Oct 2026 launch brief"`; for partners the note is "owner-supplied 3 Oct 2026; written permission to be filed". Both are the owner's assertion, not a filed document. |
| V8-2 | Photo consent | 18 photographs of students at three events are in the repo; people are recognisable. The string above would be the only record of consent. | Obtain and file written consent; decide whether the owner's confirmation is enough. |
| V8-3 | NIT Warangal emblem | The owner's `nitw-logo.webp` is processed and ready (`public/images/brand/nitw-logo.webp`). Not displayed. | Institute's written permission, then `site.showInstituteLogo = true`. |
| V8-4 | Partner logos | `unstop`, `masters-union`, `school2startup` logo files (owner-supplied) are in `public/images/partners/`. Uplearn by Upstox and Technozion: no file supplied, shown as names. None displayed as logos (`consent: false`). They appear only in the Venture Vortex spotlight block on Home and the event-partners block on `/sponsors`, while the spotlight is promoted, with the disclaimer line. | Written permission from each owner, then set `consent: true`. |
| V8-5 | Contact form: two boxes, two new fields | Box B stores `role` (optional) and `interest` (one of four fixed choices) with the existing fields. Box A sends `join`, `query` or `contact`; no age or branch/year field in the UI (the API still accepts optional `branch` and `year` on `join`). | Update PRIVACY.md:10 ("what each form collects") to list `role` and `interest`. |
| V8-6 | Existing legal text mentions the competition's platform | `content/legal/PRIVACY.md` line 18 and `TERMS.md` line 9 name Unstop. Not edited. The V8 generic-content test lists them as known exceptions. | Decide whether the policies should name the platform or speak generically. |
| V8-7 | Club-wide statistics | None supplied, none shown. | Nothing until the club supplies numbers with sources. |
| V8-8 | Dive artwork | Generated art, labelled "Generated artwork, not a photograph." The two competition posters were removed from the tunnel. | None. |
