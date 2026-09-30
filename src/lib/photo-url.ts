// Pure URL helpers, safe to import from client components (no photo data in the client bundle).
export const SIZES = [640, 1024, 1600] as const;
type Sized = { event: string; id: string; w: number };
export const fileOf = (p: { event: string; id: string }, size: number, ext: "avif" | "webp") => `/images/events/${p.event}/${p.id}-${size}.${ext}`;
export const srcSet = (p: Sized, ext: "avif" | "webp") => SIZES.map((s) => `${fileOf(p, s, ext)} ${Math.round((p.w * s) / 1600)}w`).join(", ");
