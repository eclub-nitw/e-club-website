import { photos, type MediaRole, type Photo } from "@/data/media";
import { archive } from "@/data/archive";

export { SIZES, fileOf, srcSet } from "./photo-url";
const setOf = (p: Photo) => archive.find((a) => a.slug === p.event);

export const photoById = (id: string): Photo => {
  const p = photos.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown photo id: ${id}`);
  return p;
};
export const withRole = (role: MediaRole) => photos.filter((p) => p.roles.includes(role));
export const caption = (p: Photo) => { const s = setOf(p); return s ? `${s.label} · ${s.when}` : p.event; };
export const diveFile = (id: string) => `/images/dive/${id}.webp`;
