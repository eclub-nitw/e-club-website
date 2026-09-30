import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return { name: site.name, short_name: "E-Club NITW", start_url: "/", display: "browser", background_color: "#0b2226", theme_color: "#0b2226" };
}
