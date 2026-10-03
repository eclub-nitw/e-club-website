// raw-media/<event folder>/* -> public/images/events/<slug>/<nn>-<long edge>.{avif,webp} + src/data/event-photos.ts
// Six photos per event, chosen by the owner and reviewed frame by frame (see docs/handoff/BUILD-LOG-V7). The sources are WhatsApp exports and
// carry no EXIF; sharp drops metadata anyway, so nothing (GPS, device) can reach public/. Alt text says only what is visible; no names.
// ratio = the frame the site crops to (3:2 landscape, 4:5 portrait); focal = object-position so the subject survives the crop.
import sharp from "sharp";
import { mkdir, rm, writeFile } from "node:fs/promises";

const SIZES = [640, 960, 1600];
const SETS = {
  "valuation-wars": { dir: "Valuation Wars", files: [
    ["WhatsApp Image 2026-10-02 at 21.55.55.jpeg", "3:2", "50% 60%", "Students in a tiered lecture hall, many with an arm raised and a white paddle in hand, seats full behind them."],
    ["WhatsApp Image 2026-10-02 at 21.56.00.jpeg", "4:5", "50% 55%", "Close view of students in the hall with hands and white paddles raised, several looking toward the camera."],
    ["WhatsApp Image 2026-10-02 at 21.58.55.jpeg", "3:2", "50% 65%", "Wide view of a full lecture hall, students standing and seated, a few holding paddles up."],
    ["WhatsApp Image 2026-10-02 at 21.58.56.jpeg", "3:2", "40% 65%", "Students crowd the aisle and front rows of the hall, some holding white paddles."],
    ["WhatsApp Image 2026-10-02 at 22.04.12.jpeg", "3:2", "50% 55%", "The hall seen from the back: a seated audience facing a projector screen, a presenter standing near the lectern."],
    ["WhatsApp Image 2026-10-02 at 22.04.13.jpeg", "3:2", "80% 60%", "A student speaks into a microphone at the right of the hall while the audience watches."],
  ] },
  "pitcher-perfect": { dir: "Pitcher perfect", files: [
    ["WhatsAp Image 2026-10-02 at 22.11.19.jpeg", "4:5", "55% 60%", "Two students seated at a wooden desk reading papers together, more students at desks behind them."],
    ["WhatsApp Image 2026-10-02 at 22.11.19.jpeg", "3:2", "45% 60%", "Students in rows of wooden desks in a classroom, one standing at the right."],
    ["WhatsApp Image 2026-10-02 at 22.11.20.jpeg", "3:2", "55% 50%", "A classroom with a projected slide on the front wall and students at desks facing it."],
    ["WhatsApp Image 2026-10-02 at 22.11.23.jpeg", "3:2", "40% 50%", "Students seated at desks in a daylit classroom, facing a projected slide at the front."],
    ["WhatsApp Image 2026-10-02 at 22.11.24.jpeg", "3:2", "55% 60%", "Two students stand beside a lectern next to a projected slide while others sit at a desk on the left."],
    ["WhatsApp Image 2026-10-02 at 22.11.43.jpeg", "3:2", "60% 65%", "Students working in pairs and small groups at wooden desks in a classroom."],
  ] },
  "the-pitch-league": { dir: "The pitch league", files: [
    ["WhatsApp Image 2026-10-02 at 22.13.07.jpeg", "3:2", "22% 50%", "Two students shown in profile, one gesturing toward something out of frame, in front of a whiteboard and a window."],
    ["WhatsApp Image 2026-10-02 at 22.13.41.jpeg", "3:2", "45% 50%", "Two presenters stand beside a projector screen in a classroom while seated students watch."],
    ["WhatsApp Image 2026-10-02 at 22.13.42.jpeg", "3:2", "38% 50%", "A student presents in front of a projected screen while seated classmates look on."],
    ["WhatsApp Image 2026-10-02 at 22.13.48.jpeg", "3:2", "22% 50%", "A student in a brown sweater gestures as he presents to students seated by the windows."],
    ["WhatsApp Image 2026-10-02 at 22.13.49.jpeg", "3:2", "40% 50%", "A student speaks in front of a chalkboard that reads The Pitch League, a projected slide beside it."],
    ["WhatsAppImage 2026-10-02 at 22.13.48.jpeg", "3:2", "38% 50%", "A student stands at the lectern, back partly to the camera, facing students seated along the windows."],
  ] },
};

const out = {};
for (const [slug, set] of Object.entries(SETS)) {
  await rm(`public/images/events/${slug}`, { recursive: true, force: true });
  await mkdir(`public/images/events/${slug}`, { recursive: true });
  out[slug] = [];
  for (const [i, [file, ratio, focal, alt]] of set.files.entries()) {
    const n = String(i + 1).padStart(2, "0");
    const src = sharp(`raw-media/${set.dir}/${file}`).rotate();
    const meta = await src.metadata();
    const [W, H] = meta.orientation && meta.orientation >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];
    for (const L of SIZES) {
      const r = src.clone().resize({ width: W >= H ? L : undefined, height: H > W ? L : undefined, withoutEnlargement: true });
      await r.clone().webp({ quality: 78 }).toFile(`public/images/events/${slug}/${n}-${L}.webp`);
      await r.clone().avif({ quality: 50, effort: 4 }).toFile(`public/images/events/${slug}/${n}-${L}.avif`);
    }
    const blur = "data:image/webp;base64," + (await src.clone().resize(24).webp({ quality: 40 }).toBuffer()).toString("base64");
    out[slug].push({ n: i + 1, w: W, h: H, ratio, focal, alt, blur });
    console.log(slug, n, W, H);
  }
}
const ts = `// GENERATED by scripts/build-events.mjs from raw-media (not committed). Edit alt/focal/ratio in the script and re-run.
export type EventPhoto = { n: number; w: number; h: number; ratio: "3:2" | "4:5"; focal: string; alt: string; blur: string };
export const eventPhotos: Record<"valuation-wars" | "pitcher-perfect" | "the-pitch-league", EventPhoto[]> = ${JSON.stringify(out, null, 1)};
`;
await writeFile("src/data/event-photos.ts", ts);
