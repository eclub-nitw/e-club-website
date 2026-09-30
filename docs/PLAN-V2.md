# PLAN V2: The Ledger, Immersive

Branch `feat/immersive-v2`. Rules: `AGENTS.md` plus `docs/claude-code/MASTERPROMPT-V2.md` section 1 overrides. Every step ends with the section 7 verification loop and measured numbers.

## Starting state (measured 30 Sep 2026)
- Earlier build: Lighthouse mobile 94 to 100 depending on route, **LCP 3.0 to 3.1 s (fails 2.5 s)**, cause not yet isolated; motion + lenis about 68 KiB unused on first load.
- `three`, R3F, drei, gsap, sharp, `@playwright/test`, zod are not installed yet. shadcn is initialised (`components.json`), with uncommitted edits to `Button.tsx`, `globals.css`, `layout.tsx` from that init.
- `npm config get registry` = `https://registry.npmjs.org/` (OK, audit results valid).
- No photos and no `raw-media/` folder yet. `scripts/optimize-images.mjs` is a 15-line webp-only stub.
- `DESIGN.md` says "do not add GSAP"; MASTERPROMPT-V2 section 1.1 supersedes that.

## Phase 1: foundation
1. Commit the shadcn-init edits after checking they lint and build.
2. Fix the LCP problem first: get a baseline on `next start`, then lazy-load Lenis, measure again. The new LCP element will be the hero poster image, not the h1.
3. Install approved deps one at a time, recording gz cost each in the build log.
4. UI kit: Button (fill sweep, magnetic, focus ring), Cursor, Nav pill, mobile menu with focus trap, Footer, Ticker.
5. `lib/gsap.ts` registers plugins once; Lenis wired to ScrollTrigger; both off under reduced motion.
6. Rewrite `scripts/optimize-images.mjs` (AVIF+WebP, blur, EXIF strip, kebab-case). Create `src/data/media.ts` with a `consent` field.

## Phase 2 to 5
As in MASTERPROMPT-V2 section 8. Hero poster comes from prompt 1 in section 9 (owner generates it); until it exists, the poster is a static render of the R3F scene captured with Playwright.

## 3D fallback rule (all scenes)
Static poster when: `prefers-reduced-motion`, `hardwareConcurrency <= 4`, no WebGL context, or `saveData`. Scene mounts after `requestIdleCallback`, `dynamic({ ssr:false })`, one Canvas per page.

## Blocked on the owner
- Drive photos downloaded into `raw-media/` and a consent statement per event.
- Generated images from section 9 in `raw-media/generated/`.
- Real logo file, founding year, tagline, verified stats.
