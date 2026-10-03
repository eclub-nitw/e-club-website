export type PartnerScope = "venture-vortex-2026" | "club";
export type Partner = {
  slug: string;                                    // file name stem under public/images/partners/
  name: string;
  role: string;                                    // how the partner is named on the official poster
  scope: PartnerScope;                             // a partner of one competition is not a club sponsor
  href?: string;
  /** Add the file to public/images/partners/<slug>.webp (or .png), set this and `consent`, rebuild: the cell shows the logo instead of the name. */
  logo?: { src: string; w: number; h: number };
  consent: boolean;                                // written permission to show the logo; names are shown as plain type regardless
};

// Venture Vortex 2026 partners, as named on the official poster. `club` scope is empty: the club has no club-wide sponsor or partner on record yet
// (TODO(owner): docs/CONTENT-INTAKE.md section 4). Names are trademarks of their owners; docs/LEGAL-REVIEW-NOTES.md covers the disclaimer wording.
export const partners: Partner[] = [
  { slug: "unstop", name: "Unstop", role: "Powered by", scope: "venture-vortex-2026", href: "https://unstop.com/o/cxKq1kz?lb=usedZ8to", consent: false },
  { slug: "masters-union", name: "Masters' Union", role: "In collaboration with", scope: "venture-vortex-2026", consent: false },
  { slug: "school2startup", name: "School2Startup", role: "Outreach partner", scope: "venture-vortex-2026", consent: false },
  { slug: "uplearn", name: "Uplearn by Upstox", role: "Knowledge partner", scope: "venture-vortex-2026", consent: false },
  { slug: "technozion", name: "Technozion", role: "Festival", scope: "venture-vortex-2026", consent: false },
];

export const partnersOf = (scope: PartnerScope) => partners.filter((p) => p.scope === scope);
