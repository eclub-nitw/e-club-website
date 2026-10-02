/**
 * SINGLE SOURCE OF TRUTH for every fact on the Venture Vortex page.
 * Components import from here. NEVER type a date, amount or link directly in a component.
 * Sources: (1) the official poster, (2) the Instagram caption, (3) the Unstop "Stages and Timelines" panel — AUTHORITATIVE for dates,
 * (4) the official Round 1 brief "Behind the Startup: Startup Teardown" (Google Doc shared by E-Club) — AUTHORITATIVE for Round 1 content.
 */
export const event = {
  name: "Venture Vortex",                       // spelling: VORTEX. Unstop's Round 3 text says "Vertex" — a typo, never copy it.
  tagline: "Decode the business. Craft what's next.",              // poster
  captionLine: "Decode startups. Craft strategies. Pitch live.",   // Instagram caption
  organiser: "Entrepreneurship Club (E-Club), NIT Warangal",
  collaboration: "Master's Union",              // poster logo reads "master's union university"; caption says "Master's Union"
  platformPartner: "Unstop",                    // poster: "Powered by"
  outreachPartner: "School2Startup (S2S)",      // poster + caption: "Outreach Partner"
  fest: "Technozion, NIT Warangal",
  prize: { totalInr: 50000, label: "₹50,000 total cash prize pool", extras: ["Upstox courses", "Exclusive goodies", "National-level certificates"] },
  // CONFIRMED E-Club decision (29 Sep 2026): the split between winner and runner-up stays undisclosed for now. Never display a split or add one later without checking with Wahid first.
  team: { min: 2, max: 4, crossCollege: true, lockedAfter: "Round 1 registration closes" },
  eligibility: "Undergraduate and postgraduate students across India. Working professionals can also participate.",
  fee: "Free",
  registerUrl: "https://unstop.com/o/cxKq1kz?lb=usedZ8to",   // Unstop's own normalised link (utm/fbclid stripped)
  unstopPageUrl: "https://unstop.com/competitions/venture-vortex-entrepreneurship-club-nit-warangal-1760873",
  // WhatsApp group: registered teams get the invite DIRECTLY FROM UNSTOP after they register (confirmed 29 Sep 2026) — E-Club does not send it.
  // Never put the actual invite link on this page. It is fine to tell people "you'll get it from Unstop after registering."
  whatsappUrl: null as string | null,
  email: "e_club@nitw.ac.in",
  instagram: { handle: "@eclubnitw", url: "https://www.instagram.com/eclubnitw/" },
  linkedinUrl: "https://www.linkedin.com/company/entrepreneurship-club-nitw/",
  linkedinPageName: "Entrepreneurship Club-NIT Warangal", // the exact page name teams must tag (from the Round 1 brief)

  // Times are IST (UTC+05:30), from the Unstop "Stages and Timelines" panel (authoritative).
  rounds: [
    { id: "r1", n: 1, name: "Behind the Startup", subtitle: "Startup teardown", mode: "Online · Unstop",
      start: "2026-09-24T09:00:00+05:30", end: "2026-10-09T08:00:00+05:30" },
    { id: "r2", n: 2, name: "Strategy Build", subtitle: "Marketing or Product vertical", mode: "Online · Unstop",
      start: "2026-10-11T08:00:00+05:30", end: "2026-10-18T20:00:00+05:30" },
    { id: "r3", n: 3, name: "Boardroom Showdown", subtitle: "Grand finale", mode: "On campus · NIT Warangal",
      start: "2026-10-30T08:00:00+05:30", end: "2026-10-31T20:00:00+05:30" },
  ],
  // The Instagram caption says "Registration Deadline: October 5, 2026". E-Club decision: the Unstop timeline is absolute, so the page shows
  // ONLY the Unstop windows above. Leave null unless E-Club says otherwise in writing.
  registrationDeadline: null as string | null,
  shortlistAnnouncement: null as string | null,  // not published anywhere; show nothing

  // ── Round 1 (official brief) ─────────────────────────────────────────────────────────────
  round1Objective: "Choose one startup from the list of 50 and study how it grew, what made it different, how it makes money, and what challenges it faces. This is not a company profile — focus on the decisions and strategies that helped it stand out.",
  round1Areas: [ // exact headings and sub-points from the brief
    { title: "Business Journey & Milestones", points: ["How and why the startup started", "Major milestones and turning points", "Important pivots or changes in strategy", "Major product, market or expansion decisions"] },
    { title: "Core Differentiation", points: ["What the startup does differently", "Its main competitors and alternatives", "Why customers choose it", "Its key advantage in the market"] },
    { title: "Business & Revenue Model", points: ["Who the customers are", "What the startup sells", "How it makes money", "How the business scales", "Important costs or dependencies, if available"] },
    { title: "Innovation & Moat", points: ["Technology or product advantages", "Brand, data, network, distribution or other advantages", "What would be difficult for competitors to copy"] },
    { title: "Challenges & Strategic Weaknesses", points: ["Current business or market challenges", "Competition", "Financial or operational issues", "Risks that could affect future growth"] },
    { title: "Current Market Position", points: ["Current size and reach", "Funding and valuation, where available", "Customers or users", "Market position and recent performance"] },
    { title: "Future Growth Opportunities", points: ["New markets or customer groups", "New products or services", "Expansion opportunities", "Other realistic ways the startup could grow"] },
  ],
  round1Insights: "End the teardown with 2–4 clear insights, each supported by evidence and explaining why it matters.",
  round1Deliverable: {
    deck: "A presentation deck of 10–18 slides, including a list of sources used.",
    linkedin: [ // MANDATORY
      "Publish a dedicated LinkedIn post about the startup you picked, from your own LinkedIn account.",
      "Tag the club's LinkedIn page (Entrepreneurship Club-NIT Warangal) and the company's LinkedIn page.",
      "Briefly highlight the startup's product, idea or key offering.",
      "Publish it within the Round 1 submission period and include the post link in your submission.",
    ],
    titleSlide: "Show the full names of all team members on the title slide.",
  },
  round1Research: ["Use reliable and recent sources.", "Support important numbers and claims with sources.", "Use company documents, interviews, financial filings, industry reports and credible business news.", "Do not rely only on AI-generated summaries, Wikipedia or generic articles."],
  round1Criteria: [
    { label: "Depth of research", weight: 30 },
    { label: "Understanding of journey & differentiation", weight: 25 },
    { label: "Critical analysis & strategic insight", weight: 25 },
    { label: "Structure & presentation", weight: 20 },
  ],
  round1Note: "The startup list is a set of options. Use the most recent reliable information available when researching.",

  // ── Round 2 / 3 (Unstop panel) ───────────────────────────────────────────────────────────
  round2Verticals: [
    { id: "A", name: "Marketing Strategy Challenge", items: ["Brand positioning", "Target audience profiles", "Go-to-market channels", "A 20–60 second ad concept"] },
    { id: "B", name: "Product Strategy & MVP Building", items: ["User personas", "MVP feature prioritisation", "Key success metrics", "Wireframes"] },
  ],
  round3Criteria: [
    { label: "Strategy strength & business viability", weight: 30 },
    { label: "Handling of live defence / Q&A", weight: 30 },
    { label: "Creativity & originality", weight: 20 },
    { label: "Presentation & storytelling", weight: 20 },
  ],
  venue: { name: "NIT Warangal campus", city: "Hanamkonda, Warangal", state: "Telangana", country: "IN", postalCode: "506004" }, // CONFIRM postal code
} as const;
