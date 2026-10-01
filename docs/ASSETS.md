# ASSETS

## V4 update (1 Oct 2026): supersedes the sections below where they conflict
**AI-generated art** (14 files, owner-generated; originals in git-ignored `raw-media/generated/`) is converted by `node scripts/build-art.mjs` to `public/images/art/<key>-{800,1600}.{avif,webp}` plus a 24px blur placeholder in `src/data/art.ts`. Sources are 1672 px wide (hero-bars-bg and network-city 1916, trophy-plinth 1122x1402), so 1600 is the largest honest size: the brief's 2400 px variant was NOT produced (it would be an upscale). Decorative only, `alt=""`, never presented as photographs of the club.

| Key | Used on |
|---|---|
| manifesto | Home 02 backdrop |
| pitch-stage | Home 06 flagship stage; Events header; ledger covers |
| vortex | Venture Vortex portal still; event-page header; flagship ledger cover |
| sponsors-band | Home 08; Sponsors header and partner panel; ledger cover |
| workshop | ledger cover |
| startup-ecosystem | About header |
| network-city | Team header |
| boardroom-table | Contact header; ledger cover |
| rocket-launch-abstract | Join header; ledger cover |
| hero-bars-bg | 404 backdrop |
| hero-coin-macro | ledger cover |
| trophy-plinth | flagship ledger hover cover |
| hero-poster (generated) | Not used: the cover poster is now a Blender render of the live scene, so poster and scene match. Original kept in raw-media |
| paper-tile | Not used: it is a 16:9 render, not a seamless tile; paper sections stay flat tokens |

**Cover poster and 3D** (Blender 5.1.2 via MCP): `public/images/art/poster-{1024,1600}.*` and `poster-portrait.*` are Cycles renders of the Rising Ledger (7 bevelled ink bars with brass caps, coins, a glossy floor that fades to transparent so there is no horizon line, orange rim and cyan fill). Their background is exactly `#0b2226`, the page ink. `public/models/rising-ledger.glb` (35 KB, weld + KHR_mesh_quantization, no decoder) and `public/models/ledger-coin.glb` (140 KB, from V3) are the live objects.

**HDRI**: `public/models/studio-256.hdr` (99 KB) is "Ferndale Studio 08" by Dimitrios Savva (photography) and Jarod Guest (processing), from Poly Haven, licence CC0, resampled to 256x128 in Blender. The 1k source is in git-ignored `raw-media/_hdri`.

**Moments**: `public/images/moments/<id>-{1024,1600}.{avif,webp}` are 8 frames in one ink-teal to warm-paper duotone, 3:2 (`scripts/build-moments.mjs`). Excluded: 03-39 (student in a checked dress in the foreground), 01-10 (close-up of a seated student), 02-23 (near-duplicate of 02-22).

**Fonts**: see `docs/TYPE-SYSTEM.md` (`scripts/subset-fonts-v4.py`).

---

## AI-generated images (owner-generated in Gemini/ChatGPT, 30 Sep 2026)
Originals live in `raw-media/generated/` (gitignored). Converted with sharp to WebP + AVIF (1600 px wide; paper tile 1024) in `public/images/generated/`. All are abstract, no people, no text. Alt text is set where each is used.

Global suffix on every prompt: "no text, no logos, no people, no watermark, cinematic lighting, shallow depth of field, photoreal, dark ink-teal (#0b2226) background with warm orange (#ed9038) rim light and faint cyan (#36afaa) accents, 16:9, high resolution." (paper-tile uses its own line.)

| File | AI-generated: yes | Prompt used (from MASTERPROMPT-V2 section 9) | Use |
|---|---|---|---|
| hero-poster | yes | Rows of polished dark-glass bar columns of increasing height on a glossy black reflective floor, orange edge lighting, floating brass coins mid-air, soft volumetric haze, camera slightly low, macro product-photography look. | Home hero, LCP element and 3D fallback |
| vortex | yes | A swirling spiral tunnel of fine orange and cyan light particles converging to a bright centre, deep space-like ink background, long-exposure feel. | Vortex portal backdrop |
| manifesto | yes | Macro shot of a ledger book page with faint ruled hairlines and embossed numerals, warm paper, extremely shallow depth of field, moody side light. | Manifesto section background |
| pitch-stage | yes | Empty modern auditorium stage with a single spotlight cone and a lectern, seats in silhouette, orange spotlight, no people. | Events / empty-state visual |
| sponsors-band | yes | Stack of matte black and brushed brass geometric blocks forming a stepped podium, studio lighting. | Sponsors band |
| workshop | yes | Top-down desk with blank notebooks, sticky notes with no legible writing, pen and coffee, warm tungsten light, no hands, no faces. | Ideas / join section |
| paper-tile | yes | Seamless cream paper with subtle fibres, neutral, 2048 px. | Paper texture (the file is a 16:9 render, not a seamless tile; use as a section background, do not tile) |

Not yet supplied: startup-ecosystem abstract (prompt 6). The owner will regenerate it later; nothing depends on it.

## Where the generated images are used (Phase 2)
- `hero-poster`: Home hero, the LCP image (decorative, `alt=""`), also the fallback for reduced motion, touch devices, weak devices and no-WebGL.
- `vortex`: still artwork inside the flagship vortex portal (decorative), shown until, or instead of, the live particles.
- `pitch-stage`: empty state of the Home events section.
- Not used yet: `manifesto`, `paper-tile`, `sponsors-band`, `workshop`.
- Live 3D scenes use no image or HDRI: lighting comes from procedural Lightformers, so nothing is fetched from a third party.

## Fonts (self-hosted subsets)
`src/fonts/*.woff2` are subsets of Bricolage Grotesque (weight 600), Instrument Sans (400) and JetBrains Mono (400), all SIL OFL 1.1. Built by `scripts/subset-fonts.py` from the Google-served Latin files: Basic Latin, Latin-1 and the punctuation the site uses, weights pinned, ligature features removed. 39 KB in total instead of 111 KB. Needs regenerating if the site starts using a character outside that set or another weight.

## Event photos and videos
79 files from the owner's Drive folders sit in `raw-media/` (never committed). Held back by owner decision (30 Sep 2026); the gallery stays empty until the owner chooses which to publish. Consent must be recorded in `src/data/media.ts` before any photo is shown.

## Dependencies added (bundle cost recorded when first used, see build log)
three 0.186, @react-three/fiber 9.8, @react-three/drei 10.7, gsap 3.15, zod 4.6 (runtime); sharp, @gltf-transform/cli, @playwright/test, @types/three (dev). `npm audit`: 0 vulnerabilities.

## Component sources
None used yet.
