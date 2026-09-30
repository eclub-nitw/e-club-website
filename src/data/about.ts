// All fields are supplied by the club. Sections on /about render only when their data is present.
export const about = {
  mission: null as string | null,
  // CONFIRM: built only from facts in docs/CONTEXT.md (Venture Vortex 2026 details). The club should replace or approve this wording.
  manifesto: "The Entrepreneurship Club of NIT Warangal. This year our flagship is Venture Vortex 2026: an all-India startup strategy competition with a ₹50,000 prize pool, held within Technozion and finishing on campus on 30 and 31 October." as string | null,
  verticals: [] as { name: string; description: string }[],
  timeline: [] as { year: string; text: string }[],
  facultyCoordinator: null as string | null,
};
