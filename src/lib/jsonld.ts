import { site } from "@/data/site";
import type { ClubEvent } from "@/data/events";
import { partnersOf } from "@/data/partners";
import { currentPhase } from "@/lib/phase";

// "<" is escaped so no data value can ever close the <script> tag.
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.legalName,
  url: site.url,
  email: site.email,
  slogan: site.quote.line,
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

/** Only for an event with a real start date and venue: nothing is guessed. Collaborators of the flagship are `contributor`, not `sponsor`: the club names them partners, not funders. */
export const eventLd = (e: ClubEvent) => e.dateStart && e.venue ? ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: e.plain,
  ...(e.summary && { description: e.summary }),
  startDate: e.dateStart,
  ...(e.dateEnd && { endDate: e.dateEnd }),
  eventStatus: new Date((e.dateEnd ?? e.dateStart)!).getTime() < Date.now() ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
  location: { "@type": "Place", name: e.venue },
  organizer: { "@type": "Organization", name: site.name, url: site.url },
  ...(e.type === "flagship" && {
    contributor: partnersOf("venture-vortex-2026").filter((p) => p.slug !== "technozion").map((p) => ({ "@type": "Organization", name: p.name, ...(p.href && { url: p.href }) })),
    superEvent: { "@type": "Event", name: "Technozion", location: { "@type": "Place", name: "NIT Warangal" } },
  }),
  url: `${site.url}${e.href ?? `/initiatives/${e.slug}`}`,
  ...(e.registerUrl && ["pre", "registration"].includes(currentPhase()) && { offers: { "@type": "Offer", url: e.registerUrl } }),
}) : null;
