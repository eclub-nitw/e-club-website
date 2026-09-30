# Design system — E-Club NITW

## Concept: "The Ledger"
An entrepreneurship club is about turning ideas into numbers. The site reads like a beautifully printed founder's ledger: warm paper and deep-teal ink, hairline rules, numbered entries, and one gold line that "grows" as you scroll (echoing the rising bars in the E-Club logo). Distinct from Venture Vortex's violet event world, but sharing fonts and structure so the two can live in one codebase.

## Anti-slop rules
Same as Venture Vortex: no gradient blobs, no glassmorphism **card grids**, no icon-circles above headings, no emoji icons, no Inter/Poppins/Space Grotesk, no corporate clichés, no centred-everything, no lorem ipsum, no stock "diverse team high-fiving" photos. Use real club photography, cropped with intention. Prefer big type, hairlines, tables and numerals over boxes.

**Glassmorphism, used correctly (not banned — scoped).** Glass reads as premium in exactly one situation: a surface that floats *above* content while you scroll past it, so the blur has something to blur. It reads as AI-slop when it's the default background of a static card sitting in a grid. Allowed: the floating pill nav (`backdrop-blur`, 1px border, on scroll), a modal/drawer scrim, a toast, a sticky filter bar on `/events`. Not allowed: sponsor cards, team cards, stat cards, or any grid of more than one glass surface on screen at once. If you're tempted to put `bg-white/10 backdrop-blur` on a card that isn't moving over other content, use a solid `club-paper` or `club-deep` panel with a hairline border instead — that's the ledger language, and it's the thing that will look expensive and considered rather than templated.

## Component, motion and security stack
Stack decisions for Claude Code to install and use. The rule from AGENTS.md still applies — explain the reason and bundle cost before adding anything not on this list.

**Components — install via the shadcn CLI, never hand-roll a primitive that already exists.**
- **shadcn/ui** (Tailwind + Radix primitives, code lives in your repo, not a black-box package): `Dialog`, `Sheet` (mobile nav + filter drawers), `Toast`/`Sonner` (form feedback), `Tabs` (team-by-year, gallery filters), `Tooltip`. Init: `npx shadcn@latest init`, then `npx shadcn@latest add dialog sheet tabs tooltip sonner`.
- **shadcn MCP server** — lets Claude Code browse and install shadcn components by natural language instead of you pasting CLI commands. Official, from the shadcn/ui project itself. Set up once per machine: `pnpm dlx shadcn@latest mcp init --client claude` (or `npx` if pnpm isn't installed), then restart Claude Code and run `/mcp` to confirm it shows Connected. After that, Claude Code can just be told "add a login-style form using shadcn" and it fetches the real component.
- **Watermelon UI** (`watermelon.dev` or similar — verify the exact domain and current CLI syntax on their site before use, since I have not personally rendered it) — a newer Tailwind + Radix registry with 300+ production-ready sections, dashboards and full-page blocks, in the same copy-paste tradition as shadcn. Use it for pre-built section *shapes* (a stats strip, a pricing-style comparison block repurposed for sponsor tiers) that you then restyle entirely with our tokens — never ship one of its default themes unmodified, or it will read as a template.
- **Motion Primitives** (`motion-primitives.com`) — open-source, copy-paste animated primitives built on the `motion` library we already use (masked text reveal, scroll-linked reveals, morphing elements). This is the most directly useful one for our "one motion language" rule — several of its primitives are close to what DESIGN.md already specifies by hand (masked reveal, stagger). Prefer copying its reveal/stagger logic over writing new easing curves from scratch, but keep our exact easing (`cubic-bezier(.16,1,.3,1)`) and timings, not its defaults.
- **Aceternity UI** — another animated-component source (3D pins, spotlight effects, background beams). Good for ONE hero-level moment if a section genuinely needs it (e.g. a subtle spotlight-follows-cursor on the Home hero). Do not use more than one Aceternity effect per page — stacking several is exactly the "10 different animations" anti-slop rule breaks.
- **Radix UI primitives** underlie shadcn already — don't add `@radix-ui/*` packages directly except through shadcn's CLI, which pins the right version per component.
- **lucide-react** for icons (nav, socials, buttons — not as icon-in-circle headings, which stays banned).
- **Vaul** for the mobile nav/filter drawer if `Sheet` from shadcn doesn't cover a specific gesture need (swipe-to-dismiss). Try `Sheet` first.

**Motion.** `motion` (the maintained Framer Motion successor) + Lenis remain the base, with one easing curve and transform/opacity only. **GSAP + ScrollTrigger and R3F frame loops are now approved** (owner-approved 30 Sep 2026, see `docs/claude-code/MASTERPROMPT-V2.md` section 1) for pinned scroll scenes and the 3D hero; they must load lazily, never block LCP, and keep the initial JS budget of 180 KB gz. Prefer CSS/IntersectionObserver over `motion` in components that ship on every page, because `motion/react` alone is about 60 KB gz.

**Verification tooling (for Claude Code to use on itself, see the masterprompts in `docs/claude-code/`).**
- **Playwright** (`npm i -D playwright && npx playwright install chromium`) — Claude Code should screenshot every page it builds at 360/768/1440px and actually look at the images before calling a page done, not just trust that the code compiles.
- **`@next/bundle-analyzer`** to check the 180 KB gz budget isn't blown.
- **Lighthouse CLI** (`npx lighthouse http://localhost:3000 --view`) for the Performance/Accessibility/SEO scores this repo targets.

**Security (concrete, not aspirational — already in the repo).** `next.config.ts` sets CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy on every route. `.github/workflows/ci.yml` runs typecheck + lint + build + `npm audit` on every PR. `.github/dependabot.yml` opens weekly PRs for outdated/vulnerable packages. When you add a new external script or embed origin, add it to the CSP in `next.config.ts` in the same PR — don't loosen the policy to `unsafe-inline`/wildcards to make an error disappear.

## Palette (sampled directly from the OFFICIAL E-Club logo file, confirmed 29 Sep 2026 — replaces the earlier poster-based guesses)
| Token | Hex | Use | Contrast |
|---|---|---|---|
| club-ink | `#0b2226` | dark sections, footer | — |
| club-deep | `#123a40` | raised panels on dark | — |
| club-teal | `#2c8b93` | graphics, large text (≥24px) only | 3.8:1 on ink (fails small text — decorative/large only) |
| club-teal-deep | `#224f63` | text/links on paper — this is the logo's literal ring colour | 7.9:1 on paper |
| club-gold | `#ed9038` | **CORRECTED**: the real logo accent is orange, not yellow-gold. Accent, buttons, the growth line. Pair with **ink** text, never white (white on this is only 2.4:1) | 6.3:1 on ink |
| club-cyan | `#36afaa` | **NEW**, optional: bright highlight from the logo's arrow/bars. Use sparingly — one underline, a hover state, a single accent line. Not a second CTA colour. | 5.8:1 on ink |
| club-paper | `#f5f1e6` | light sections, cards | ink on paper 13.7:1 |
| club-mist | `#9fb8ba` | muted text on dark | 7.4:1 on ink |
Rhythm: alternate ink and paper sections. Hero is ink. Content-heavy pages (events archive, team, legal) are paper. Orange (`club-gold`) button with **ink text** on both ink and paper sections — white text on the button fails contrast. Set `data-theme="club"` on `<html>` (default in `tokens.css`); the Venture Vortex route wraps itself in `data-theme="vortex"`.
Logo file: `public/images/brand/eclub-logo.png` (transparent background, cut from the official file) and `src/app/icon.png` (512×512 favicon source) — Wahid drops these in manually (binary files aren't pushed through the filesystem tool). Source resolution is modest (~300px); ask the design team for a larger master file if the logo needs to render above ~150px anywhere (e.g. an About-page hero).

## Typography
Shared with Venture Vortex. Display: **Bricolage Grotesque**; body: **Instrument Sans**; labels/dates/numbers: **JetBrains Mono** uppercase. Headline sizes clamp(2.5rem, 6vw, 6rem). Body 17–18px / 1.65. Legal pages: body 16px, max 68ch.

## Signature elements
1. **Growth line:** a 2px gold SVG polyline that draws itself down the left rail of the Home page as you scroll (stroke-dashoffset linked to scroll progress), ending at the CTA.
2. **Ledger tables:** events and team use hairline-ruled rows with mono year/date columns instead of cards; hover highlights the row.
3. **Numbered sections** ("02 — What we do").
4. **Photo treatment:** all photos same aspect ratios (4:5 portrait / 3:2 landscape), slight warm grade, `object-fit: cover`, no rounded corners beyond 2px. Team photos in greyscale, colour on hover.
5. Grain overlay at 4%.

## Motion
Same language as Venture Vortex (masked reveals, scroll-linked lines, hover lift, transform/opacity only, Lenis smooth scroll, full reduced-motion support). Page transitions: none (fast beats fancy). Event archive filters animate with layout transitions ≤ 250ms.

## Components to build (shared library in `src/components/ui/`)
Container, Section (with number label), Button (primary/secondary/link), Nav (sticky, mobile sheet), Footer, LedgerRow, EventRow, EventCard (only for featured), StatNumber, SponsorLogo (uniform 40px height, grayscale→colour), TeamMember (photo, name, role, LinkedIn), Timeline, Accordion (`<details>`), VideoEmbed (lite YouTube facade), Gallery (masonry + lightbox, keyboard accessible), FormField, Toast, Breadcrumbs, TornEdge (from VV), Marquee (pauses on hover/touch and reduced-motion).

## Signature moments (informed by the four reference sites; none of them does these)
1. **Growth line.** A 2px gold line draws itself down the left rail of Home as you scroll and ends at the CTA (echoes the rising bars in the E-Club logo).
2. **Event ledger with a live preview.** `/events` is a hairline-ruled table (year · title · type). Hovering a row makes a photo from that event follow the cursor in a small 3:2 window (desktop only; keyboard focus shows it in place; touch shows an inline thumbnail). Beats the vertical-strip accordions used by two of the reference sites because it scales to 30+ events and works with the keyboard.
3. **Proof numbers.** Stats only appear with a footnote naming the source (e.g. "participants: registration data, Unstop, 2025"). No number, no stat.
4. **Fall into the vortex.** The Home CTA "Venture Vortex 2026" plays a circular clip-path reveal from the button's position that swaps the theme from teal/gold to violet and lands on `/venture-vortex`. Reduced motion: normal navigation.
5. **Sponsor page as a ledger.** "Why partner with us" is a table of verified numbers plus a downloadable one-page summary later; a sponsor block also sits in the footer (borrowed from the IIT Hyderabad pattern).
6. **Team as index cards.** Greyscale portraits with colour on hover; role in mono; year archive via `/team/[year]`.
7. **Floating pill nav.** Small centred pill (the site's only blurred surface) on scroll-down; full header at the top.
