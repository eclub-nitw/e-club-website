import { site } from "@/data/site";
import type { ClubEvent } from "@/data/events";

// "<" is escaped so no data value can ever close the <script> tag.
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.legalName,
  url: site.url,
  email: site.email,
  sameAs: [site.instagram, site.linkedin, site.youtube].filter(Boolean),
});

export const breadcrumbLd = (trail: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: `${site.url}${t.path}`,
  })),
});

export const eventLd = (e: ClubEvent) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: e.title,
  description: e.summary,
  startDate: e.dateStart,
  ...(e.dateEnd && { endDate: e.dateEnd }),
  eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
  location: { "@type": "Place", name: e.venue },
  organizer: { "@type": "Organization", name: site.name, url: site.url },
  url: `${site.url}${e.href ?? `/initiatives/${e.slug}`}`,
  ...(e.registerUrl && { offers: { "@type": "Offer", url: e.registerUrl } }),
});
