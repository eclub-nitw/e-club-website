// All fields are supplied by the club. Sections on /about render only when their data is present.
export const about = {
  mission: null as string | null,
  // CONFIRM: built only from facts in data/event.ts. The club should replace or approve this wording.
  manifesto: "Entrepreneurship Club is the student community at NIT Warangal for people who build or want to. This year our flagship is Venture Vortex 2026: an all-India startup strategy competition with a ₹50,000 prize pool, held within Technozion and finishing on campus on 30 and 31 October." as string | null,
  verticals: [] as { name: string; description: string }[],
  timeline: [] as { year: string; text: string }[],
  // Public NITW student-welfare page lists Prof. Altaf Q. H. Badar (Electrical Engineering) as the club's faculty mentor. Owner has not confirmed publication: keep null until told.
  facultyCoordinator: null as string | null,
};
