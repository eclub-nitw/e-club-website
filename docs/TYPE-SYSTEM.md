# TYPE SYSTEM (V4)

Four voices plus a label. Pages never set their own font sizes: they use `<Display/> <H1/> <H2/> <H3/> <Lede/> <Body/> <Label/>` from `src/components/ui/Type.tsx` (or the matching `.t-*` classes). Two gates enforce it: `node scripts/type-audit.mjs` (static: no `text-[..]`, `text-sm`, `font-bold`, `font-display` etc. outside `Type.tsx`) and `node scripts/audit-v4.mjs` (rendered: every visible text node must be a token size, an allowed family and an allowed weight). Screenshot of every voice and state: `docs/handoff/v4/states-1440-01.png` and `states-1440-02.png` (a QA page built with `SHOW_STATES=1`; it is a 404 in a normal build).

| Voice | Class | Spec (as built) | Use |
|---|---|---|---|
| Impact | `.t-impact` | Bricolage Grotesque, `wdth` 75, `wght` 800, UPPERCASE, -0.02em, line-height 0.86, `clamp(5rem, 18vw, 20rem)` | Wordmark, giant numerals, one hero stat. **Max one per viewport.** |
| Impact S | `.t-impact-s` | same, `clamp(4rem, 11vw, 11rem)` | The one hero stat when it shares a column with copy (flagship prize figure) |
| Headline | `.t-h1` `.t-h2` `.t-h3` | Bricolage, `wdth` 100, `wght` 600, sentence case, -0.025em, line-height 1.02; h1 `clamp(2.75rem, 6.5vw, 6rem)`, h2 `clamp(2rem, 4.2vw, 3.75rem)`, h3 `clamp(1.5rem, 2.4vw, 2.25rem)` | All headings. Weight can be mixed inside one block with `.w-light` (300) and `.w-heavy` (700), e.g. the cover h1 |
| Lede / quote | `.t-lede` | Instrument Serif regular (roman only), line-height 1.15, `clamp(1.5rem, 2.6vw, 2.5rem)` | Pull-quotes, chapter ledes |
| Lede XL | `.t-lede-xl` | same face, line-height 1.02, `clamp(2.5rem, 7.2vw, 7rem)` | The Problem question and the closing line only |
| Body | `.t-body` | Instrument Sans 400, 17-19px / 1.6, measure 62ch, colour = paper at 78% on ink (9.3:1) / ink at 78% on paper (7.5:1) | Paragraphs |
| Label | `.t-label` | JetBrains Mono 500, 11px (12px from 768), UPPERCASE, +0.14em | Chapter numbers, captions, nav counter, metadata |
| UI | `.t-ui` | Instrument Sans 400, 15px | Button, nav-link and form-control text. Not a heading voice |
| Wordmark | `.t-wordmark` | Bricolage 600, 18px | The nav wordmark only |

## Fonts (self-hosted, subset, OFL)
`scripts/subset-fonts-v4.py` builds them from `google/fonts`: Bricolage Grotesque **variable with the `wght` 200-800 and `wdth` 75-100 axes both kept** (opsz pinned at 96; verified with fontTools, 48 KB), Instrument Sans 400 (14 KB), **Instrument Serif regular** (9.6 KB, loaded without preload because it is always below the fold), JetBrains Mono pinned at 500 (5 KB). `font-display: swap`; only the Bricolage, Instrument Sans and Mono files are preloaded. Width is applied with `font-variation-settings: "wdth" 75|100` (next/font/local cannot declare a `font-stretch` range).

## Hierarchy rules (and how they are applied)
- Per section: one dominant element, one secondary, one supporting; size contrast between levels at least 1.6x. Example, Home 03: serif lede (dominant) / area names in H3 (secondary) / mono numbers (supporting).
- No paragraphs in uppercase or Impact. The banned trick (one italic serif word inside a sans headline) is not used; the serif is roman and sits in its own block.
- Left-aligned, asymmetric, hairline-ruled. Container is 1280px with 20-40px gutters (about 8% outer margin at 1440).

## Colour roles for text
| On ink | Value | Contrast |
|---|---|---|
| Headings | paper `#f5f1e6` | 14:1 |
| Body | paper at 78% | 9.3:1 |
| Labels / muted | mist `#9fb8ba` | 7.9:1 |
| Accent text (<= 2 words per viewport, large text only) | orange `#ed9038` (`text-accent-text`) | 6.8:1 |

| On paper | Value | Contrast |
|---|---|---|
| Headings | ink `#0b2226` | 13.7:1 |
| Body | ink at 78% | 7.5:1 |
| Small accent text | **new token `club-orange-ink` `#a14e00`** (`text-accent-text` inside `.tone-paper`) | 5.2:1 |

Orange is never used as small text on paper. Cyan is for light effects only. Token change is in `src/styles/tokens.css`: `--color-club-orange-ink`; grain overlay lowered from 4% to 3.5%.

## What the audits actually measured
Contrast is not guessed: `audit-v4.mjs` hides the text, screenshots the real pixels behind each text line (art, veils, 3D poster) and takes the worst pixel against the text colour: 4.5:1 for small text, 3:1 for large. It found and fixed real failures (countdown labels over the poster's orange glow, header labels over the vortex art, h1 over a flying coin).

# V5 caps (supersede the sizes above)
Owner feedback 2 Oct: "font sizes are irrelevantly huge in places". Hard caps, measured on the rendered DOM at 1440 by `node scripts/type-audit.mjs` (fails on any text node over its cap and prints the largest per page):

| Voice | V5 spec | Notes |
|---|---|---|
| Impact (`.t-impact`) | `clamp(3.5rem, 10vw, 9rem)` (max 144 px) | Wordmark or giant numeral, at most once per viewport; not currently used on a page |
| Stat numeral (`.t-stat`, `.t-impact-s`) | `clamp(2.75rem, 5vw, 5rem)` (max 80 px at 1440 = 72 px) | Numbers sequence, prize figure |
| H1 | `clamp(2.25rem, 4.2vw, 3.75rem)` (60 px) | |
| H2 | `clamp(1.75rem, 3vw, 2.5rem)` (40 px) | |
| H3 | `clamp(1.25rem, 1.8vw, 1.625rem)` (26 px) | |
| Lede (`.t-lede`, `.t-lede-xl`) | `clamp(1.25rem, 1.8vw, 1.75rem)` / H2-sized | |
| Body | 17-19 px, measure 62ch | |
| Label | 11 px, 12 px from 768 | |
| Ghost word (`.t-ghost`) | up to 18vw, opacity 7%, `aria-hidden`, text from `data-word` (generated content, so no text node) | Decorative only |

Result on the final build: largest non-ghost text is 72 px on `/` and `/venture-vortex` (a stat numeral) and 60 px (the H1) on every other page.
