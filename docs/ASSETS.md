# ASSETS

## AI-generated images (owner-generated in Gemini/ChatGPT, 30 Sep 2026)
Originals live in `raw-media/generated/` (gitignored). Converted with sharp to WebP + AVIF (1600 px wide; paper tile 1024) in `public/images/generated/`. All are abstract, no people, no text. Alt text is set where each is used.

| File | Use | Alt / note |
|---|---|---|
| hero-poster | Home hero, LCP element and 3D fallback | Dark glass bars rising left to right on a reflective floor, brass coins in the air |
| vortex | Vortex portal backdrop | Spiral of orange and cyan light particles |
| manifesto | Manifesto section background | Ledger page, ruled lines |
| pitch-stage | Events / pitch section | Empty stage with a single spotlight |
| sponsors-band | Sponsors band | Stepped podium of black and brass blocks |
| workshop | Ideas / join section | Desk with blank notebooks |
| paper-tile | Paper texture | Cream paper |
Not yet supplied: startup-ecosystem abstract (prompt 6).

## Event photos and videos
79 files from the owner's Drive folders sit in `raw-media/` (never committed). Held back by owner decision (30 Sep 2026); the gallery stays empty until the owner chooses which to publish. Consent must be recorded in `src/data/media.ts` before any photo is shown.

## Dependencies added (bundle cost recorded when first used, see build log)
three 0.186, @react-three/fiber 9.8, @react-three/drei 10.7, gsap 3.15, zod 4.6 (runtime); sharp, @gltf-transform/cli, @playwright/test, @types/three (dev). `npm audit`: 0 vulnerabilities.

## Component sources
None used yet.
