# SEO, legal and launch checklist

## A. Technical SEO (built in)
- [ ] `metadataBase`, per-page `title` template ("%s | E-Club NIT Warangal"), unique meta descriptions ≤ 160 chars, canonical URLs.
- [ ] `<html lang="en-IN">`; one h1 per page; logical headings; descriptive link text; alt text on every image.
- [ ] `src/app/sitemap.ts` (all routes + every event slug) and `src/app/robots.ts` (allow all, reference sitemap). Trailing-slash behaviour consistent; `www` → apex 301 redirect.
- [ ] Open Graph + Twitter cards with a unique 1200×630 image per key page (`opengraph-image.tsx` can generate them).
- [ ] JSON-LD: `Organization` (name, url, logo, sameAs = Instagram/LinkedIn/YouTube, contactPoint email) on Home; `Event` on each event page; `BreadcrumbList` on deep pages. Validate every type in Google's **Rich Results Test**.
- [ ] Favicons (`icon.png`, `apple-icon.png`), `manifest.webmanifest`, custom 404.
- [ ] Static generation for all pages (`generateStaticParams` for events). No client-only rendering of primary content.
- [ ] Images: `next/image`, AVIF/WebP, sizes attribute, priority only on the hero image.

## B. Verification (a human must do these — I cannot)
- [ ] Create the club's own Google account for the club (not a personal one), add two owners.
- [ ] Google Search Console: add a **Domain property** (DNS TXT record at the registrar), submit `/sitemap.xml`, request indexing of Home.
- [ ] Bing Webmaster Tools: import from Search Console.
- [ ] PageSpeed Insights + Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100 on Home, Events, Event detail, Team.
- [ ] Core Web Vitals in Search Console after ~28 days of traffic: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- [ ] Check "site:yourdomain" and brand searches ("E-Club NIT Warangal", "Venture Vortex") after a week.

## C. Security and privacy
- [ ] HTTPS only (Vercel default), HSTS; security headers in `next.config` (`X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, a conservative CSP).
- [ ] No third-party trackers. Analytics: Vercel Analytics or Plausible (cookieless) — avoids a consent banner. Google Analytics only if you also add a consent banner.
- [ ] Forms: honeypot + rate limit; no storing of personal data unless the Privacy Policy says so.
- [ ] No API keys in the repo; `.env.local` git-ignored; secrets only in Vercel settings.

## D. Legal pack (drafts in `content/legal/` — NOT legal advice)
**Deadline to confirm with the institute: Wed 30 Sep 2026** — name/emblem permission, subdomain option, faculty reviewer (see CONTEXT.md).

Drafts exist for: Privacy Policy, Terms of Use, Cookie Policy, Disclaimer, Accessibility Statement. **Before publishing:** (1) fill every `[[PLACEHOLDER]]`; (2) get them reviewed by the faculty coordinator or the institute's administration; (3) confirm the club may use the NIT Warangal name and emblem on a site under its own domain — institute names and logos are usually restricted, and the safer path is asking whether the site can live on an institute subdomain (for example `eclub.nitw.ac.in`) or getting written permission; (4) get permission before showing anyone's photo or name (team members, event attendees, speakers) and honour takedown requests; (5) sponsor and partner logos need the sponsor's consent. India's Digital Personal Data Protection Act, 2023 and its rules apply to personal data you collect; children under 18 need verifiable parental consent, so the site's own forms should be for 18+ or route minors to Unstop/Google Forms.

## E. Domain and hosting
Buy the domain in the club's name, with registrar login held by the club (two admins). Options: `.in` or `.org.in`. Point DNS to Vercel; enable auto-renew. Vercel's free tier is meant for non-commercial use; a student club with sponsor logos is likely fine but read the current terms, or use Cloudflare Pages / Netlify as alternatives.

## F. Launch gate
All above ticked, every page fact-checked against club records, legal pages reviewed, 404 and redirects tested, mobile tested on real phones.
