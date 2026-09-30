import { photos, type MediaRole, type Photo } from "@/data/media";
import { archive } from "@/data/archive";

export const SIZES = [640, 1024, 1600] as const;
const setOf = (p: Photo) => archive.find((a) => a.slug === p.event);

export const photoById = (id: string): Photo => {
  const p = photos.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown photo id: ${id}`);
  return p;
};
export const withRole = (role: MediaRole) => photos.filter((p) => p.roles.includes(role));
export const caption = (p: Photo) => { const s = setOf(p); return s ? `${s.label} · ${s.when}` : p.event; };
export const fileOf = (p: Photo, size: number, ext: "avif" | "webp") => `/images/events/${p.event}/${p.id}-${size}.${ext}`;
export const srcSet = (p: Photo, ext: "avif" | "webp") => SIZES.map((s) => `${fileOf(p, s, ext)} ${Math.round((p.w * s) / 1600)}w`).join(", ");
export const diveFile = (id: string) => `/images/dive/${id}.webp`;
