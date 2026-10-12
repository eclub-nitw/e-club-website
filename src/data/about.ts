// All fields are supplied by the club. Sections on /about render only when their data is present.
export const about = {
  mission: null as string | null,
  // The club's own line, supplied by the owner on 3 Oct 2026 (V7 brief). The V7 version ended with a sentence about one competition: removed in V8, About is club-generic.
  manifesto: "Entrepreneurship Club is the student community at NIT Warangal for people who build or want to." as string | null,
  verticals: [
    {
      name: "Event Conduction and Coordination (ECC)",
      description: "Planning, organizing, and executing entrepreneurial events, competitions, and speaker sessions across campus.",
    },
    {
      name: "Content and Media",
      description: "Visual design, media coverage, editorial storytelling, and public relations across all club channels.",
    },
    {
      name: "Tech and Design",
      description: "Building digital platforms, software infrastructure, and user interfaces that power the club's initiatives.",
    },
    {
      name: "Innovation Team (I-team)",
      description: "Fostering campus startup ideation, product prototyping, and venture incubation.",
    },
    {
      name: "Outreach",
      description: "Connecting with founders, industry leaders, venture networks, and campus alumni.",
    },
  ] as { name: string; description: string }[],
  timeline: [] as { year: string; text: string }[],
  // Public NITW student-welfare page (nitw.ac.in/sw) lists this as the club's faculty mentor; the owner approved showing it on 2 Oct 2026.
  facultyCoordinator: null as string | null, // removed from the site on the owner's request, 3 Oct 2026. Was "Prof. Altaf Q. H. Badar, Department of Electrical Engineering" (public nitw.ac.in/sw listing); set it again to show it on Home, About and Team.
};
