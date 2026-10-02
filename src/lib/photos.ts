import type { Photo } from "@/data/media";
import { archive } from "@/data/archive";

export { SIZES, fileOf, srcSet } from "./photo-url";
const setOf = (p: Photo) => archive.find((a) => a.slug === p.event);

export const caption = (p: Photo) => { const s = setOf(p); return s ? `${s.label} · ${s.when}` : p.event; };
