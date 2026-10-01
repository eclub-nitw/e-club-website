# ART GENERATION + COWORK PROMPTS (E-Club NITW, V4)

## Part A. How to use
- Tools: Gemini (image) or ChatGPT (image). Run each prompt in a NEW chat, but first attach your best existing image from `raw-media/generated/` as a style reference and say: "Match the colour grade, lighting and grain of the attached reference."
- Generate 4 variants per prompt, keep the best, export PNG, long edge >= 2400 px, save to `C:\Users\tipty\E-club-website\raw-media\generated\` with the exact filename shown. If a result has any readable text, logo, face or watermark, rerun it.
- Never ask the tool to draw words, logos or people: AI lettering and faces look fake. All type is added in code.
- Check every image at full size before keeping: edges clean, no melted geometry, no random symbols, colours match the palette.

## Part B. Art bible (paste at the start of EVERY prompt)
"Photoreal cinematic still, studio-grade lighting, 35mm lens look, shallow depth of field, fine film grain. Palette: deep ink-teal #0b2226 shadows, warm orange #ed9038 practical light and rim highlights, small cyan #36afaa accents, brushed brass, off-white paper #f5f1e6 where paper appears. Moody, premium, restrained, lots of negative space for headlines. No text, no letters, no numbers, no logos, no watermarks, no people or faces, no cartoon style, no neon cyberpunk, no purple gradients, no lens-flare cliches."

## Part C. Prompts (append the art bible to each)
1. `hero-bars-bg.png` (21:9): "A row of matte black and brushed brass bar columns of rising height on a dark glossy reflective floor, orange rim light from the right, faint haze, camera low and wide, large empty dark area on the left for a headline."
2. `hero-coin-macro.png` (16:9): "Macro of a thick brass coin standing on edge on a dark polished surface, orange backlight catching the bevel, shallow depth of field, specks of dust in the light."
3. `startup-ecosystem.png` (16:9), the one missing from your first batch: "A constellation of small glowing orange nodes joined by hairline cyan lines forming a branching network on a deep ink-teal background, depth of field, a few nodes in sharp focus, the rest soft."
4. `boardroom-table.png` (16:9): "Empty modern boardroom at night, long dark wooden table, a single pool of warm light, blank notebooks and a closed laptop, city lights blurred through floor-to-ceiling glass, no people."
5. `pitch-podium.png` (4:5): "A lone lectern on a dark stage lit by one orange spotlight cone, haze in the beam, empty seats in silhouette, no people, no signage."
6. `ledger-macro.png` (16:9): "Open ledger book with faint ruled hairlines and no writing, warm paper, brass paperweight, raking side light, extreme shallow depth of field."
7. `desk-flatlay.png` (4:5): "Top-down flat lay on dark slate: blank notebook, pen, brass compass, small paper models of a rocket and a coin, orange side light, no hands, no text."
8. `chess-strategy.png` (16:9): "Dark and brass chess pieces mid-game on a dark board, one pawn lit in orange, rest in shadow, shallow depth of field, no text."
9. `rocket-launch-abstract.png` (16:9): "A minimal brass-and-black model rocket lifting off a dark surface, orange exhaust glow, streaked motion, long exposure feel, no people, no flags."
10. `door-light.png` (4:5): "A tall dark doorway with warm orange light spilling out onto a polished floor, architectural minimalism, empty."
11. `paper-fold-vortex.png` (1:1): "Concentric folded paper rings forming a spiral tunnel viewed from above, warm paper tones, shadows in ink-teal, orange glow at the centre."
12. `trophy-plinth.png` (4:5): "A simple brass trophy cup on a dark plinth, dramatic orange rim light, deep ink background, reflective floor, no engraving, no text."
13. `network-city.png` (21:9): "Aerial night view of a city grid reduced to fine orange and cyan light lines on near-black, abstract, no landmarks, no text."
14. `texture-grain-ink.png` (1:1): "Seamless dark ink-teal paper texture with subtle fibres and fine grain, neutral, tileable."
Existing seven (do not rerun unless weak): hero poster, vortex texture, manifesto background, pitch-stage abstract, sponsors band, workshop/ideas, paper texture tile.
Priority if you only have time for a few: 3 (startup ecosystem), 1, 5, 12, 2.

## Part D. Cowork prompt: curate the event media
(Run in Claude Cowork with access to `C:\Users\tipty\E-club-website\raw-media\`. Never delete originals.)
"Work only in raw-media (read-only for originals). Task: build a curation shortlist.
1. Inventory every photo and video: file name, type, resolution, size, capture date from metadata. Save as raw-media-inventory.csv in a NEW folder `raw-media\_curation\`.
2. Sort COPIES (never moves) into `_curation\keep`, `_curation\maybe`, `_curation\reject`. Keep = sharp, well exposed, strong composition, clear subject, nothing embarrassing. Reject = blurry, dark, duplicate, accidental, or showing anyone in an awkward moment. Prefer wide shots over close-ups of individuals. Pick at most 12 for `keep`.
3. Make 3 contact sheets (keep, maybe, reject) as images with file names under each thumbnail.
4. For the 12 keepers, write one neutral line each describing only what is visible (no names, no guessed event names).
5. List videos with duration and size and suggest which would work as a 6 to 10 second silent loop.
Report what you rejected and why. Ask me before touching anything outside raw-media\_curation."

## Part E. Cowork prompt: club content draft (after you paste LinkedIn/Instagram text into docs\CONTENT-INTAKE.md)
"Read the file `docs\CONTENT-INTAKE.md` I filled in. Produce `docs\CONTENT-DRAFT.md` containing: a 40-word club description, a 15-word tagline (3 options), 6 verticals with one line each, event summaries, and 3 closing-line options, using ONLY facts present in my intake file. Mark every sentence that is not directly from my text as CONFIRM. Do not invent numbers, names, years or quotes. Voice: short, specific, first-person plural, dry confidence, none of: unleash, elevate, empower, seamless, revolutionary, cutting-edge."
