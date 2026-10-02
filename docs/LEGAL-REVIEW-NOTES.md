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
