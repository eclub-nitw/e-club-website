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
  // Owner-supplied 3 Oct 2026 (V7 brief). `club` is the club's line, `line` the four-word motto shown in the hero, the Home band, About and the footer.
  quote: { club: "Entrepreneurship Club - NITW", line: "Think. Connect. Create. Lead.", source: "Club owner, 3 Oct 2026" },
  // The NIT Warangal emblem is shown only after the institute's written permission (docs/LEGAL-REVIEW-NOTES.md). Flip this one flag to publish it.
  showInstituteLogo: false,
  logos: {
    nitw: { src: "/images/brand/nitw-logo.webp", w: 640, h: 720, alt: "NIT Warangal logo" },
    eclub: null as { src: string; w: number; h: number; alt: string } | null, // TODO(owner): the official E-Club logo file is not in the repo; add it to public/images/brand and set this
  },
  // Shown on /contact only with an address read from nitw.ac.in. The site is script-rendered and could not be read in the V7 run, so this stays null.
  // TODO(owner or next run): { text: "NIT Warangal, Telangana", source: "<the nitw.ac.in page that prints it>" }
  campusLine: null as { text: string; source: string } | null,
  forms: {
    // Owner asked (3 Oct 2026) to drop the "18 or older" checkbox. This line is the proposed replacement notice; it renders only once a human reviewer
    // has accepted the wording and `noticeApproved` is set (docs/LEGAL-REVIEW-NOTES.md). No age is collected or stored either way.
    noticeLine: "Forms here are for people aged 18 and over. Under 18? Email us instead.",
    noticeApproved: false,
  },
  tagline: null as string | null,             // CONFIRM: one line the club approves; hidden while null
  brochureUrl: "",                            // CONFIRM: sponsorship brochure PDF/link, shown only when set
  recruitmentUrl: "",                         // CONFIRM: Google Form link, only while recruitment is open
} as const;
