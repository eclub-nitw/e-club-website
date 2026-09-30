// raw-media (not committed) -> public/images/events/<slug>/<id>-<long edge>.{avif,webp} + src/data/media.ts
// Selection comes from the contact-sheet review in docs/MEDIA-INVENTORY.md. Metadata (EXIF/GPS) is stripped: sharp drops it by default.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const R = "raw-media/";
// [source file, event slug, alt text (what is visible only), role tags]
const A = "club-event-01", B = "club-event-02", C = "club-event-03";
const SEL = [
  ["20260829_172007 (1).jpg", A, "A presenter stands beside a projector screen while students sit at desks in a classroom.", "dive"],
  ["20260829_173802.jpg", A, "A presenter stands at a wooden lectern while students in the foreground take notes.", "dive"],
  ["20260829_174004 (1).jpg", A, "Two students stand together in front of a green chalkboard and a projected slide, speaking to the room.", "moments"],
  ["20260829_174247 (1).jpg", A, "Two students present side by side while an audience sits at desks on the right.", "moments"],
  ["20260829_175726.jpg", A, "A student in a white shirt stands before a projected slide while two seated students watch.", "moments"],
  ["20260829_180109.jpg", A, "Two students present next to a wooden lectern in front of a projected slide.", "gallery"],
  ["20260829_180719.jpg", A, "A student speaks from a lectern beside a projection screen.", "gallery"],
  ["20260829_181732.jpg", A, "A presenter gestures while two seated students watch from the desks in the foreground.", "gallery"],
  ["20260829_182922.jpg", A, "Two presenters stand beside a lectern, one gesturing toward the audience.", "gallery"],
  ["20260829_183227.jpg", A, "A seated student in a checked shirt listens in the foreground while two presenters stand behind him.", "moments"],
  ["20260829_184129.jpg", A, "Two students stand at a lectern beside a projection screen.", "gallery"],
  ["20260829_184243.jpg", A, "A presenter stands by a lectern while students with laptops sit at desks to the right.", "dive"],
  ["20260829_184550.jpg", A, "A student speaks next to a lectern with a projected slide behind him.", "gallery"],
  ["20260829_185503(0).jpg", A, "Presenters stand at a lectern while students with laptops watch from the desks.", "dive"],
  ["20260829_171403 (1).jpg", A, "A student presents beside a projected slide titled 'Problem in The Mobility Sector'.", "moments"],
  ["_heic/IMG_5569.jpg", B, "Students at tables with laptops in a classroom while others stand beside a projector screen.", "dive"],
  ["_heic/IMG_5570.jpg", B, "A projected slide reading 'Pitch'er Perfect' with presenters standing beside the lectern.", "dive"],
  ["_heic/IMG_5571.jpg", B, "A projected 'Pitch'er Perfect' slide with presenters at the lectern and a listener in the foreground.", "gallery"],
  ["_heic/IMG_5572.jpg", B, "A wide view of the 'Pitch'er Perfect' slide and three people at the lectern.", "gallery"],
  ["_heic/IMG_5573.jpg", B, "A presentation slide on the screen while three students stand at the lectern.", "moments"],
  ["_heic/IMG_5574.jpg", B, "A student in a dark checked shirt stands at the lectern beside a projected slide.", "moments"],
  ["_heic/IMG_5576.jpg", B, "Rows of students sit at wooden desks in a classroom, facing the front.", "hero"],
  ["_heic/IMG_5578.jpg", B, "Students seated in rows at wooden desks, looking toward a presenter.", "dive"],
  ["_heic/IMG_5579.jpg", B, "A student stands at the lectern while others work at a table on the left.", "gallery"],
  ["_heic/IMG_5580.jpg", B, "Presenters at the lectern beside a projected slide, students seated at a table on the left.", "gallery"],
  ["_heic/IMG_5581.jpg", B, "Presenters at the lectern beside a projected slide, with students at a table on the left.", "gallery"],
  ["IMG_5604.JPG", C, "Students seated at desks in a classroom, writing on paper.", "dive"],
  ["_heic/IMG_5582.jpg", C, "Students seated in rows in a classroom, looking toward the front.", "dive"],
  ["_heic/IMG_5588.jpg", C, "A student stands beside two seated students working on a laptop.", "moments"],
  ["_heic/IMG_5589.jpg", C, "A student stands beside two seated students working on a laptop.", "gallery"],
  ["_heic/IMG_5595.jpg", C, "Two students at a desk look at papers together.", "moments"],
  ["_heic/IMG_5596.jpg", C, "Students at desks, two in the foreground looking at their papers.", "gallery"],
  ["_heic/IMG_5597.jpg", C, "A large classroom with students seated in rows and a countdown timer on the screen at the front.", "dive"],
  ["_heic/IMG_5598.jpg", C, "Students seated in a classroom facing a projected countdown timer.", "gallery"],
  ["_heic/IMG_5601.jpg", C, "A wide view of a classroom full of students facing a projected timer.", "dive"],
  ["_heic/IMG_5603.jpg", C, "Three students gather around a laptop beside a projection screen showing a countdown timer.", "moments"],
  ["_heic/IMG_5608.jpg", C, "Two students at a desk in the foreground, with more seated in rows behind them.", "gallery"],
  ["_heic/IMG_5609.jpg", C, "A student sits at a desk with papers in a large classroom.", "gallery"],
  ["_heic/IMG_5611.jpg", C, "Groups of students huddle over papers at desks in a large classroom with tall windows.", "dive"],
  ["_heic/IMG_5613.jpg", C, "Students seated in a classroom with a projector screen in the distance.", "gallery"],
  ["_heic/IMG_5614.jpg", C, "A student stands at the side of a classroom while others sit facing a projected screen.", "dive"],
];
await mkdir("public/images/dive", { recursive: true });
// Ink-teal "duotone-lite", baked in (no runtime filter): luminance mapped ink -> paper-teal, 30% of the original colour kept, edge vignette.
const INK = [11, 34, 38], LIGHT = [200, 226, 222];
async function hero(base) {
  for (const [name, w, h] of [["hero-1600", 1600, 1000], ["hero-1024", 1024, 640], ["hero-portrait", 900, 1200]]) {
    const { data, info } = await base.clone().resize(w, h, { fit: "cover", position: name === "hero-portrait" ? "centre" : "attention" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 3;
      const lum = Math.min(1, Math.max(0, (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255));
      const t = Math.pow(lum, 1.35);
      const dx = (x / info.width - 0.5) * 2, dy = (y / info.height - 0.5) * 2;
      const vig = 1 - 0.55 * Math.min(1, (dx * dx + dy * dy) / 2) - 0.25 * Math.max(0, -dy);
      for (let c = 0; c < 3; c++) {
        const duo = INK[c] + (LIGHT[c] - INK[c]) * t;
        data[i + c] = Math.max(0, Math.min(255, (duo * 0.7 + data[i + c] * 0.3 * t) * vig));
      }
    }
    const graded = sharp(data, { raw: info });
    await graded.clone().avif({ quality: 50, effort: 5 }).toFile(`public/images/events/${name}.avif`);
    await graded.clone().webp({ quality: 72 }).toFile(`public/images/events/${name}.webp`);
  }
}
const SIZES = [640, 1024, 1600];
const out = [];
let n = 0;
for (const [file, slug, alt, role] of SEL) {
  n++;
  if (process.env.HERO_ONLY && role !== "hero") continue;
  const id = `${slug.slice(-2)}-${String(n).padStart(2, "0")}`;
  const dir = `public/images/events/${slug}`;
  await mkdir(dir, { recursive: true });
  const base = sharp(R + file, { failOn: "none" }).rotate();
  const meta = await base.clone().resize(1600, 1600, { fit: "inside" }).toBuffer({ resolveWithObject: true });
  for (const s of SIZES) {
    const r = base.clone().resize(s, s, { fit: "inside", withoutEnlargement: true }).modulate({ saturation: 0.92 });
    await r.clone().avif({ quality: 48, effort: 4 }).toFile(`${dir}/${id}-${s}.avif`);
    await r.clone().webp({ quality: 74 }).toFile(`${dir}/${id}-${s}.webp`);
  }
  if (role === "dive") await base.clone().resize(1024, 768, { fit: "cover" }).webp({ quality: 72 }).toFile(`public/images/dive/${id}.webp`);
  if (role === "hero") await hero(base);
  const blur = (await base.clone().resize(24).blur(1).webp({ quality: 40 }).toBuffer()).toString("base64");
  out.push({ id, slug, w: meta.info.width, h: meta.info.height, alt, role, blur: `data:image/webp;base64,${blur}` });
  process.stdout.write(`${id} `);
}
const ts = `// GENERATED by scripts/build-media.mjs from raw-media (not committed). Edit alt/caption by re-running the script.
// Consent: owner statement 30 Sep 2026 that the club confirmed consent for people shown in these photos.
export type MediaRole = "hero" | "dive" | "moments" | "gallery";
export type Photo = {
  id: string; event: string;            // event = slug of an entry in data/events.ts
  w: number; h: number;                  // pixel size of the 1600 variant
  alt: string; roles: MediaRole[];
  blur: string;                          // 24px data-URI placeholder
  consent: true; basis: "club-confirmed 2026-09-30";
};
export const photos: Photo[] = ${JSON.stringify(out.map(o => ({ id: o.id, event: o.slug, w: o.w, h: o.h, alt: o.alt, roles: [o.role], blur: o.blur, consent: true, basis: "club-confirmed 2026-09-30" })), null, 1)};
`;
if (!process.env.HERO_ONLY) await writeFile("src/data/media.ts", ts);
console.log("\n", out.length, "photos");
