# MEDIA INVENTORY (raw-media, 1 Oct 2026)
Source: the owner's `raw-media/` folder (never committed, git-ignored). Script: `scripts/media-inventory.mjs` (scores + contact sheets in `docs/handoff/v3/sheet-*.jpg`), selection and outputs: `scripts/build-media.mjs`.

## Counts
| Type | Files | Note |
|---|---|---|
| JPG/JPEG (phone) | 22 | 4000x3000 class |
| HEIC (iPhone) | 28 | sharp cannot decode HEVC here; decoded with Windows WIC to full-resolution JPEG (`raw-media/_heic`), 27 OK, 1 undecodable (IMG_5602, WIC error 0xC00D36BE) |
| Screenshots | 2 | excluded |
| Videos (mp4 + mov) | 20 (978 MB) | see below |
| **Selected stills** | 41 | dive 13, moments 10, hero 1, rest gallery |

## Scoring method
Sharpness = variance of a Laplacian on a 512 px greyscale copy; mean luminance recorded; then a manual pass on the contact sheets for composition, faces and privacy. Raw scores are in `docs/handoff/v3/media-scores.json`. Honest read of the set: these are candid classroom phone photos (ultra-wide lens distortion, flat daylight and tube light, cluttered backgrounds). They carry real people and real moments but not cinematic light, which is why the site grades them (ink-teal duotone on the hero) and puts them inside motion and type rather than showing them raw everywhere.

## Output
`public/images/events/<slug>/<id>-{640,1024,1600}.{avif,webp}` (long edge; EXIF/GPS stripped), 24 px blur placeholders in `src/data/media.ts`, graded hero (`events/hero-{1600,1024,portrait}`), Dive textures `public/images/dive/<id>.webp` (1024x768). Total `public/images/events` about 11 MB, `dive` 0.7 MB.

## Stills
| File | Size | MB | Sharpness | Status |
|---|---|---|---|---|
| 20260829_171403 (1).jpg | 4000x3000 | 1.23 | 188 | USED 01-15 (moments) |
| 20260829_172007 (1).jpg | 4000x3000 | 3.71 | 254 | USED 01-01 (dive) |
| 20260829_173002 (1).jpg | 4000x3000 | 3.39 | 158 | excluded: soft focus (sharpness score 158, cutoff 160) |
| 20260829_173802.jpg | 4000x3000 | 3.71 | 298 | USED 01-02 (dive) |
| 20260829_174004 (1).jpg | 4000x3000 | 2.25 | 234 | USED 01-03 (moments) |
| 20260829_174247 (1).jpg | 4000x3000 | 2.98 | 311 | USED 01-04 (moments) |
| 20260829_175044.jpg | 4000x3000 | 2.72 | 149 | excluded: soft focus (sharpness score 149, cutoff 160) |
| 20260829_175726.jpg | 4000x3000 | 2.97 | 241 | USED 01-05 (moments) |
| 20260829_180109.jpg | 4000x3000 | 3.06 | 259 | USED 01-06 (gallery) |
| 20260829_180719.jpg | 4000x3000 | 1.16 | 254 | USED 01-07 (gallery) |
| 20260829_181347.jpg | 3000x4000 | 1.07 | 144 | excluded: soft focus (sharpness score 144, cutoff 160) |
| 20260829_181732.jpg | 3000x4000 | 3.23 | 252 | USED 01-08 (gallery) |
| 20260829_182922.jpg | 4000x3000 | 2.9 | 230 | USED 01-09 (gallery) |
| 20260829_183227.jpg | 4000x3000 | 4.4 | 292 | USED 01-10 (moments) |
| 20260829_183601.jpg | 4000x3000 | 2.86 | 153 | excluded: soft focus (sharpness score 153, cutoff 160) |
| 20260829_184129.jpg | 4000x3000 | 3.43 | 204 | USED 01-11 (gallery) |
| 20260829_184243.jpg | 4000x3000 | 3.09 | 313 | USED 01-12 (dive) |
| 20260829_184550.jpg | 4000x3000 | 3.26 | 221 | USED 01-13 (gallery) |
| 20260829_185016.jpg | 4000x3000 | 1.44 | 142 | excluded: soft focus (sharpness score 142, cutoff 160) |
| 20260829_185503(0).jpg | 4000x3000 | 3.15 | 306 | USED 01-14 (dive) |
| IMG_20260829_171954_hdr.jpg | 4080x3072 | 2.73 | 119 | excluded: soft focus (sharpness score 119, cutoff 160) |
| IMG_5604.JPG | 3520x1980 | 1.33 | 352 | USED 03-27 (dive) |
| _heic/IMG_5569.jpg | 3614x2338 | 1.45 | 427 | USED 02-16 (dive) |
| _heic/IMG_5570.jpg | 3717x1929 | 1.25 | 299 | USED 02-17 (dive) |
| _heic/IMG_5571.jpg | 4032x3024 | 2.17 | 253 | USED 02-18 (gallery) |
| _heic/IMG_5572.jpg | 3717x1775 | 1.15 | 269 | USED 02-19 (gallery) |
| _heic/IMG_5573.jpg | 4032x3024 | 2.55 | 222 | USED 02-20 (moments) |
| _heic/IMG_5574.jpg | 4032x3024 | 2.22 | 187 | USED 02-21 (moments) |
| _heic/IMG_5575.jpg | 4032x3024 | 2.16 | 151 | excluded: soft focus (sharpness score 151, cutoff 160) |
| _heic/IMG_5576.jpg | 4032x3024 | 2.58 | 566 | USED 02-22 (hero) |
| _heic/IMG_5578.jpg | 4032x3024 | 2.58 | 542 | USED 02-23 (dive) |
| _heic/IMG_5579.jpg | 4032x3024 | 2.22 | 245 | USED 02-24 (gallery) |
| _heic/IMG_5580.jpg | 4032x3024 | 2.27 | 213 | USED 02-25 (gallery) |
| _heic/IMG_5581.jpg | 4032x3024 | 2.3 | 271 | USED 02-26 (gallery) |
| _heic/IMG_5582.jpg | 3863x2812 | 2.21 | 510 | USED 03-28 (dive) |
| _heic/IMG_5588.jpg | 3024x4032 | 2.28 | 487 | USED 03-29 (moments) |
| _heic/IMG_5589.jpg | 3024x4032 | 2.34 | 453 | USED 03-30 (gallery) |
| _heic/IMG_5595.jpg | 3024x4032 | 2.48 | 432 | USED 03-31 (moments) |
| _heic/IMG_5596.jpg | 3024x4032 | 2.61 | 455 | USED 03-32 (gallery) |
| _heic/IMG_5597.jpg | 4032x3024 | 2.37 | 437 | USED 03-33 (dive) |
| _heic/IMG_5598.jpg | 4032x3024 | 2.27 | 362 | USED 03-34 (gallery) |
| _heic/IMG_5601.jpg | 3432x1497 | 1.02 | 464 | USED 03-35 (dive) |
| _heic/IMG_5603.jpg | 4032x3024 | 1.93 | 213 | USED 03-36 (moments) |
| _heic/IMG_5608.jpg | 3024x4032 | 2.51 | 590 | USED 03-37 (gallery) |
| _heic/IMG_5609.jpg | 3024x4032 | 2.5 | 567 | USED 03-38 (gallery) |
| _heic/IMG_5610.jpg | 4032x3024 | 2.58 | 987 | excluded: near-duplicate of IMG_5611 (kept the sharper) |
| _heic/IMG_5611.jpg | 4032x3024 | 2.64 | 1019 | USED 03-39 (dive) |
| _heic/IMG_5613.jpg | 3024x4032 | 2.26 | 317 | USED 03-40 (gallery) |
| _heic/IMG_5614.jpg | 4032x3024 | 2.44 | 638 | USED 03-41 (dive) |
| ai_select_for_sharing_1789976363646.jpg | 328x338 | 0.04 | 22 | excluded: screenshot of a phone UI, not a photograph (328x338) |
| ai_select_for_sharing_1789976363718.jpg | 328x338 | 0.04 | 22 | excluded: screenshot of a phone UI, not a photograph (328x338) |

## Excluded and why (for the morning summary)
- 20260829_173002 (1).jpg: soft focus (sharpness score 158, cutoff 160)
- 20260829_175044.jpg: soft focus (sharpness score 149, cutoff 160)
- 20260829_181347.jpg: soft focus (sharpness score 144, cutoff 160)
- 20260829_183601.jpg: soft focus (sharpness score 153, cutoff 160)
- 20260829_185016.jpg: soft focus (sharpness score 142, cutoff 160)
- IMG_20260829_171954_hdr.jpg: soft focus (sharpness score 119, cutoff 160)
- _heic/IMG_5575.jpg: soft focus (sharpness score 151, cutoff 160)
- _heic/IMG_5610.jpg: near-duplicate of IMG_5611 (kept the sharper)
- ai_select_for_sharing_1789976363646.jpg: screenshot of a phone UI, not a photograph (328x338)
- ai_select_for_sharing_1789976363718.jpg: screenshot of a phone UI, not a photograph (328x338)
- IMG_5602.HEIC: file could not be decoded.
- Nothing was excluded for privacy or a minor in close-up: the people shown are in classroom settings at distance or mid-shot. One wide frame (used as gallery only, not hero, dive or moments: IMG_5611) has a student in a checked dress in the foreground who may look young; please glance at it (id `03-39`).

## Videos (not used tonight)
`ffmpeg` is not installed. The only ffmpeg on this machine is Playwright's, which has a VP8-only encoder and no H.264 decoder, so neither decoding the phone clips nor making H.264 loops is possible. **Decorative loops: BLOCKED (0 of 3 made).** Owner action: install ffmpeg (winget install Gyan.FFmpeg) and rerun, or upload the long videos to YouTube and add `youtubeId` to the event data.
| File | MB |
|---|---|
| 20260829_173405 (1).mp4 | 58.24 |
| 20260829_173516 (1).mp4 | 17.68 |
| 20260829_173631 (1).mp4 | 16.4 |
| 20260829_173756 (1).mp4 | 4.98 |
| 20260829_174024 (1).mp4 | 52.44 |
| 20260829_174514.mp4 | 30.93 |
| 20260829_175119.mp4 | 48.39 |
| 20260829_175347.mp4 | 135.91 |
| 20260829_180014.mp4 | 87.97 |
| 20260829_180926.mp4 | 115.54 |
| 20260829_181529.mp4 | 40.85 |
| 20260829_182953.mp4 | 41.99 |
| 20260829_184145.mp4 | 38.64 |
| 20260829_184656.mp4 | 64.48 |
| 20260829_185044.mp4 | 82.21 |
| IMG_5590.MOV | 36.63 |
| IMG_5605.MOV | 29.66 |
| IMG_5606.MOV | 23.69 |
| IMG_6737.MOV | 20.03 |
| IMG_6740.MOV | 30.92 |
