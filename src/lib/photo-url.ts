// Pure URL helpers for event photographs, safe to import from client components (no photo data in the client bundle).
export const SIZES = [640, 960, 1600] as const;
type Sized = { n: number; w: number; h: number };
const nn = (n: number) => String(n).padStart(2, "0");
export const fileOf = (slug: string, n: number, size: number, ext: "avif" | "webp") => `/images/events/${slug}/${nn(n)}-${size}.${ext}`;
/** Width descriptor of the variant whose long edge is `size`. */
const widthAt = (p: Sized, size: number) => (p.w >= p.h ? size : Math.round((p.w * size) / p.h));
export const srcSet = (slug: string, p: Sized, ext: "avif" | "webp") => SIZES.map((s) => `${fileOf(slug, p.n, s, ext)} ${widthAt(p, s)}w`).join(", ");
export const FRAME = { "3:2": "aspect-[3/2]", "4:5": "aspect-[4/5]" } as const;
