# BUILD LOG: Phase 2 (Home), 30 Sep 2026

Branch `feat/immersive-v2`. Everything below was measured on the production build (`next start`) on the owner's Windows laptop (RTX 4060, 16 logical cores). Lighthouse runs were accepted only when Lighthouse's own machine benchmark was healthy (see "Measurement conditions").

## Numbers

| Metric | Result | Target | Met |
|---|---|---|---|
| Lighthouse mobile, `/`, median of 5 valid runs | perf 96, a11y 100, SEO 100, best-practices 100 | perf >= 90, a11y >= 95, SEO 100 | yes |
| LCP (simulated mobile) | 2.70 s median, range 2.69-2.89 | <= 2.5 s | **no** |
| FCP / TBT / CLS | 0.76 s / 92 ms / 0.000 | CLS <= 0.1 | yes |
| Transfer, `/` | 266 KiB | | |
| INP proxy (Event Timing under 4x CPU, 10 runs) | median 48 ms, max 64 ms (8 ms granularity) | <= 200 ms | yes (proxy only) |
| Initial JS gz | `/` 186.7 KB, `/about` 181.5 KB, `/events` 183.5 KB | <= 180 KB | **no** |
| Hero scene fps, desktop, real GPU | 60.2 (worst frame 17 ms) | >= 55 | yes |
| Hero scene fps, 4x CPU throttle | 46-50 (worst frame 34 ms) | >= 30 | yes |
| Full-page scroll fps, desktop / 4x throttle | 59.6 / 51.5-54.6 | | |
| Long tasks during a full scroll, desktop | 0 by PerformanceObserver; trace shows 1 RunTask of 61-63 ms with no attributable child | none > 50 ms | **almost** |
| Long tasks during a full scroll, 4x throttle | 3 over 50 ms, max 99 ms (compositor Commit, R3F frame callback) | none > 50 ms | **no** |
| QA harness (`scripts/qa.mjs`) | 45/45 | | yes |

Bare Next 16.3.6 + React 19.2.8 app with one `Link`, measured the same way: **172.0 KB gz** initial JS, LCP 1.56 s median (140 KiB). So a 180 KB JS budget leaves about 8 KB for everything we write; that number is not reachable on this framework version with a real Nav, and it is a decision for the owner (see below).

## What was found and fixed for LCP (3.24 s -> 2.70 s)
1. **A poster covering the whole viewport is ignored as an LCP candidate.** Chrome skips an image that is as large as the viewport (843 px high counts, 844 px does not). The poster box is now 92svh. Verified with controlled experiments.
2. **Lighthouse's simulated LCP tracks bytes loaded before the observed paint.** Real first paint was about 200 ms locally; the score came from downloading about 390 KiB at 1.47 Mbps. Levers, measured: removing all web fonts gave 2.28 s; subsetting fonts to the characters used (111 KB -> 39 KB) gave 2.64 s; removing `motion` (44 KB gz) from `/` and `/events`; fetching the vortex artwork only when near.
3. Things tried that did not help and were reverted: `preload: false` on fonts (worse FCP, CLS 0.017), an `Enhancements` dynamic wrapper (bigger bundle), drei `PerformanceMonitor` (no change), image `quality` (ignored: Next 16 only honours values listed in `images.qualities`).

## Remaining levers for LCP <= 2.5 s (each needs a decision)
- `next.config.ts` is a shared file (not touched): `images.qualities` would allow a lower-quality poster (about -6 KB); `experimental.inlineCss` removes one request from the critical path. Neither measured.
- Drop the JetBrains Mono file (8 KB) in favour of a system mono stack: about -0.05 s, changes the label look.
- Deployed measurement: Vercel serves brotli and HTTP/2, which local `next start` does not; local gz numbers are pessimistic. Not measured until deployed.

## Built
Hero (poster LCP, R3F scene after load + idle, desktop only), manifesto (pinned on desktop, contrast-safe words), flagship section with vortex portal (3,600 particles, hover speed-up, 550 ms dive), events (pinned rail with 3+ events, ledger rows below that, empty state), verified stats with count-up (hidden: no verified numbers exist), sponsors band (hidden: no consented sponsors), get-involved rows, ticker with pause button, CSS scroll-driven growth line. Removed `HeroBars`, `Tilt`, and the `motion` dependency. `GrowthLine` now CSS-only. `EventLedger` (still used by `/events`) no longer uses `motion`.

## Not built / not done
- **Blender models:** the Blender MCP was not connected ("Could not connect to Blender. Make sure the Blender addon is running."). The scene is procedural; the modelled `.glb` swap is pending. The runtime will use `useGLTF(url, false)` (no Draco/Meshopt decoder) because the CSP forbids `wasm-unsafe-eval` and blob workers and must not be loosened.
- `EventLedger` is not removed: `/events` still uses it until the Phase 3 archive replaces it.
- No HDRI: lighting is procedural (Lightformers), so nothing is fetched from a third party.

## Deviations from the V2 brief
- **Two WebGL contexts on desktop Home** (hero and vortex portal), not one shared Canvas. Each is paused off screen; the portal's context is created 2.5 s after load so shader compile does not land in a scroll. A single shared canvas (drei `View`) would be a larger rewrite.
- **Touch devices get the poster, never the live scene** (V2: mobile falls back to the poster). This is also what Lighthouse mobile sees.
- The hero poster is now a render of the live scene (landscape and portrait, art-directed with `<picture>`), not the AI poster, so poster and scene match. The AI poster is still in `public/images/generated/`.
- The manifesto text is built only from `docs/CONTEXT.md` facts and marked `CONFIRM` in `src/data/about.ts` for club approval.

## Measurement conditions
Mid-session the machine slowed dramatically (Lighthouse benchmark index fell from about 2400 to 134; a build took 2.5 minutes; free RAM 1.7 of 24 GB with about 50 node processes, mostly MCP servers, and 35 Chrome processes). Numbers taken then (perf 40-48, TBT 3-7 s) are discarded. `scripts/lh.mjs` now records the benchmark for every run and rejects runs below `MIN_BENCH`; all figures above come from runs at 2280-2470 (healthy is about 2400).

## Not tested
A real phone (touch scrolling, real GPU throttling, thermal behaviour, iOS Safari), Firefox and Safari (CSS scroll-driven growth line falls back to a full line; WebGL not checked), integrated GPUs, screen readers, Lighthouse desktop / PageSpeed, deployed (brotli, CDN) performance, real INP (proxy only), the events rail with real data (verified only with a temporary 5-event fixture, since removed), the count-up with real data, and the sponsors band and stats with real data.

## Memory drift
Heap after 30 navigations grows about 0.08 MB per navigation on both Home and non-Home pages (Home visits: 12.2, 13.1, 13.9, 14.8 MB). Listener counts, pin spacers and canvases are stable and scenes are disposed on every non-Home page (21 visits checked), but a slow heap trend remains unexplained; the harness's 15% plateau tolerance passes it. Needs a longer soak or a heap-snapshot diff before calling it leak-free.

## Review
```
git checkout feat/immersive-v2 && npm install && npm run build && npm start
node scripts/qa.mjs http://localhost:3100 all
MIN_BENCH=1800 node scripts/lh.mjs http://localhost:3100/ 5
node scripts/scene-perf.mjs            # headed Chrome, real GPU
```
Screenshots: `docs/handoff/phase2/` (`sheet-*.png`, `hero-scene-*-render.png`).
