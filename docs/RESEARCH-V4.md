# RESEARCH V4: type, colour, motion audit (1 Oct 2026)

Method: `scripts/research-v4.mjs` (installed Chrome via Playwright, 1440x900, 7 s settle). It walks every visible text node at four scroll depths and records distinct size / weight / family / case / tracking / line-height, plus canvases, sticky elements and whether small fixed elements move with the pointer. Screenshots and raw JSON: `docs/handoff/v4/research/`. Only URLs that actually opened are listed. Principles only; no asset, text or code was taken.

**Limits (honest):** the pass sees what is rendered at 1440 px after ~7 s, so intro gates (Lando Norris, Hubtown, Sleep Well Creative) were captured at their gate, with type read from the later scroll points. Cursor behaviour is a crude "did a small fixed element move" probe (all returned 0 or 1; I did not record video). Colours come from computed body styles and the screenshots. Cartier Watches & Wonders (`cartier.com/watchesandwonders`) returned **Access Denied** to automation, so it is **not** audited; what I know of it (six 3D alcoves, Three.js, GSAP, Lenis) is from an Awwwards write-up, not first-hand.

## Sites opened

| Site | Faces | Type scale actually used (computed) | Hero concept / scroll | 5-second feel |
|---|---|---|---|---|
| landonorris.com | 2 (Brier, Mona Sans Variable) | Display 98 px / 700 / UPPERCASE / -0.03em / line-height 0.8; body 17-20 px; nothing in between. Size ratio about 5:1 | playable "drive" intro, then scroll; 21 canvases, Lenis, 133 images; one acid-lime accent | A person, a number, one colour. No explanation needed |
| oryzo.ai (Awwwards SOTM Apr 2026) | 1 variable family (halyard-display, 100-900) | Everything 12-24 px, weight 400-500, UPPERCASE labels; scale comes from the object and layout, not the type. 56,691 px page | scroll-driven product scenes, 6 canvases, 2 videos | A single hero object lit like a product shot |
| lusion.co | 1 (Aeonik) | 36-38 px sentence case 400 for statements, 26 px uppercase nav, 14 px/500 uppercase labels | 3D object in a rounded frame, "Scroll to explore" | One strong render, one sentence |
| hubtown.co.in (SOTD Jun 2026) | 3 (Grotesk Light/Regular/Bold, Commit Mono) | Almost all text 8-12 px: mono 9 px uppercase +0.16em labels, 12 px light body at -0.02em. 1 canvas, 6 sticky UI frames | glowing monolith, HUD-like frame with scene counter and coordinates | A cinematic object and a control-panel frame; type is tiny and exact |
| sleep-well-creatives.com (SOTD Jan 2026) | 2 (Editorial serif, NM sans) | 65 px / weight 100 serif at -0.023em for headlines, 30 px serif, 18 px sans body. 14 videos, 1 canvas, Lenis | "Enter site" gate, then illustrated scroll story | Calm, one serif voice, warm paper |
| ecell.iith.ac.in | 3 (DM Sans, a serif, Geist Mono) | 96 / 72 px headlines at 100-700 weight, one serif italic line over a sans headline; 1 canvas | wave-line canvas hero, floating pill nav | Centered, polite, close to a template |
| ecell.iitm.ac.in/home | 4+ (Orbitron, Oswald, mono, system sans) | 96 px Orbitron 800 with 24 px tracking, 58 px Oswald 800 | video + ticker, pinned stat scenes | Loud, but four faces compete |
| ecell.in (IIT Bombay) | 2 (Bebas Neue, Poppins) | 55-64 px Bebas, 35 px Poppins numerals | stat trio, tiles | Dated; heading and numerals are the only hierarchy |
| ecelliitg.in | 5 (Urbanist, Inter Display, Space Grotesk, Instrument Serif, Instrument Sans) | 48 px / 400-600 at -0.03em, 40 px numerals | Framer, Lenis, orbiting stickers, photo wall | Busy; five families, no dominant element |

## What the numbers say
1. **The sites that feel premium use few, extreme sizes.** Lando: 98 px against 17-20 px. Hubtown: everything small, so the single canvas dominates. Nobody wins by setting every line big (that is our V3 mistake and IITM/IITG's weakness).
2. **Two or three faces, each with one job.** Sleep Well pairs one serif with one sans; Hubtown a grotesk with a mono. The E-Cells with 4-5 families (IITM, IITG) read as noise.
3. **Tracking is always negative on big type** (-0.02 to -0.03 em) and **positive on small mono labels** (+0.12 to +0.16 em), exactly the split in the brief.
4. **One object, lit properly, carries the hero** (Oryzo coaster, Lusion cluster, Hubtown monolith, Lando portrait). None of them uses a particle field as the show.
5. **The HUD frame idea** (Hubtown): small fixed corner readouts such as a scene counter and coordinates make a long scroll feel like a system. Our slide counter and progress rail are the same device.
6. **Gates are common among winners (Lando, Hubtown, Sleep Well) but all three hide content for several seconds.** We keep the rule: nothing gated.

## Adopt / reject
**Adopt:** (a) one mega uppercase moment per viewport at roughly 5:1 against body; (b) serif for ledes only, in the way Sleep Well uses its serif; (c) tiny mono HUD labels, chapter counter and progress rail (Hubtown); (d) a single lit 3D object per scene with generous negative space (Oryzo, Lusion, Hubtown); (e) negative tracking on display, positive on labels; (f) one accent colour.
**Reject:** gates and intros that delay content; 5-family type stacks (IITG, IITM); centred template heroes with a one-word italic accent (IITH); particle fields as the star; payloads of 7-22 MB (Lando 7 MB, Oryzo 22 MB lower bound, V3 audit); cookie walls; any asset or code.
