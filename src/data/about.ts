// All fields are supplied by the club. Sections on /about render only when their data is present.
export const about = {
  mission: null as string | null,
  // The club's own line, supplied by the owner on 3 Oct 2026 (V7 brief). The V7 version ended with a sentence about one competition: removed in V8, About is club-generic.
  manifesto: "Entrepreneurship Club is the student community at NIT Warangal for people who build or want to." as string | null,
  verticals: [] as { name: string; description: string }[],
  timeline: [] as { year: string; text: string }[],
  // Public NITW student-welfare page (nitw.ac.in/sw) lists this as the club's faculty mentor; the owner approved showing it on 2 Oct 2026.
  facultyCoordinator: null as string | null, // removed from the site on the owner's request, 3 Oct 2026. Was "Prof. Altaf Q. H. Badar, Department of Electrical Engineering" (public nitw.ac.in/sw listing); set it again to show it on Home, About and Team.
};
