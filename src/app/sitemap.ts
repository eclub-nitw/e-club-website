import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { events } from "@/data/events";
import { teamYears } from "@/lib/team";

// ADD each route here when its page ships. Legal pages are omitted while they are noindex drafts.
const routes = ["/", "/about", "/events", "/team", "/sponsors", "/gallery", "/contact", "/join"];

export default function sitemap(): MetadataRoute.Sitemap {
  const at = (path: string, priority: number, changeFrequency: "monthly" | "yearly") => ({ url: `${site.url}${path === "/" ? "" : path}`, changeFrequency, priority });
  return [
    ...routes.map((r) => at(r, r === "/" ? 1 : 0.7, "monthly")),
    ...events.map((e) => at(`/events/${e.slug}`, 0.6, "yearly")),
    ...teamYears().map((y) => at(`/team/${y}`, 0.4, "yearly")),
  ];
}
