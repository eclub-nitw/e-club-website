export const site = {
  name: "E-Club NIT Warangal",
  legalName: "Entrepreneurship Club, National Institute of Technology Warangal",
  // Set NEXT_PUBLIC_SITE_URL in the host's env once the domain is confirmed; the fallback is a placeholder.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.org").replace(/\/$/, ""),
  email: "e_club@nitw.ac.in",
  instagram: "https://www.instagram.com/eclubnitw/",   // CONFIRM
  linkedin: "https://www.linkedin.com/company/entrepreneurship-club-nitw/",   // official (E-Club, 28 Sep 2026)
  youtube: "",                                // CONFIRM: club YouTube channel URL
  address: { locality: "Warangal", region: "Telangana", country: "IN" }, // CONFIRM full address with the club
  foundedYear: null as number | null,         // CONFIRM with the club
  tagline: null as string | null,             // CONFIRM: one line the club approves; hidden while null
  brochureUrl: "",                            // CONFIRM: sponsorship brochure PDF/link, shown only when set
  recruitmentUrl: "",                         // CONFIRM: Google Form link, only while recruitment is open
} as const;
