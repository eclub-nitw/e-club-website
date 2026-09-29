import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { events } from "@/data/events";

// ADD each route here when its page ships. Do not list pages that do not exist yet.
const routes = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((r) => ({ url: `${site.url}${r === "/" ? "" : r}`, changeFrequency: "monthly" as const, priority: r === "/" ? 1 : 0.7 })),
    ...events.map((e) => ({ url: `${site.url}/events/${e.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
