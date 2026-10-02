# Domain cutover (one page)

Nothing in the code hard-codes a domain. Everything (canonical tags, `og:url`, OG image URLs, sitemap, robots, JSON-LD `url`, the contact API origin allowlist) reads `NEXT_PUBLIC_SITE_URL`. Pick the **apex** (`example.org`) as the canonical host and send `www` to it.

## Steps (owner, about 30 minutes plus DNS wait)
1. Vercel → project `e-club-nitw` → Settings → Domains → add `example.org`, then `www.example.org`. Set `www` to **Redirect to** `example.org` (308).
2. At the registrar add what Vercel shows. Usually: apex `A` `76.76.21.21`, and `www` `CNAME` `cname.vercel-dns.com`. (Or switch the domain to Vercel nameservers instead.) **Use the exact values Vercel shows for your project; they win over this page.**
3. Wait until both rows say "Valid Configuration" and the certificate is issued (minutes to a few hours).
4. Set the env var for **Production and Preview**: `NEXT_PUBLIC_SITE_URL=https://example.org` (no trailing slash). Fast path: `node scripts/vercel-env.mjs https://example.org`, or the Vercel UI. Redeploy (Deployments → ⋯ → Redeploy; NEXT_PUBLIC values are baked in at build time).
5. Tell Claude the domain. It then checks: canonical, `og:url`, OG image absolute URLs, `sitemap.xml`, `robots.txt`, JSON-LD, the form's origin check, the mailto links; confirms `e-club-nitw.vercel.app` 308-redirects to the new domain (already wired in `next.config.ts`, switches on by itself once step 4 is deployed); re-runs the header check and Lighthouse.
6. **HSTS.** Today `Strict-Transport-Security` is `max-age=86400` (one day). Once the domain has served HTTPS correctly for a few days: raise to `max-age=31536000; includeSubDomains` in `next.config.ts`. Add `; preload` and submit to hstspreload.org **only** if every subdomain you will ever use is HTTPS, because preload is very hard to undo.

## Only a human can do these
- Google Search Console on a club-owned Google account: add the domain property, verify with the DNS TXT record, submit `https://example.org/sitemap.xml`.
- Bing Webmaster Tools (optional, can import from Search Console).
- Rich Results Test on `/` and `/venture-vortex`.
- Paste the link into WhatsApp, LinkedIn and Instagram DMs and check the preview image (these apps cache previews; use their debuggers if it looks stale).
- Buying and renewing the domain, and who holds the registrar login (put it with the faculty advisor, not one student).

## Email
The site only uses `e_club@nitw.ac.in`. Do not set up sending from the new domain unless asked.
