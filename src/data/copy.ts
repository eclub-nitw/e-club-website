// Every public sentence below that is not a verified fact is a CONFIRM candidate (docs/COPY-REVIEW.md).
// The UI uses index 0 of each option list; the club picks or rewrites.
export type Seg = string | { em: string };

export const copy = {
  // Facts only: docs/CONTEXT.md (Venture Vortex 2026).
  manifestoLines: [
    ["We are the Entrepreneurship Club of NIT Warangal."],
    ["This year we run ", { em: "Venture Vortex" }, "."],
    ["An all-India startup strategy competition."],
    [{ em: "₹50,000" }, " on the table."],
    ["Finale on campus, 30 and 31 October."],
  ] as Seg[][],
  facts: [
    { value: "₹50,000", label: "Prize pool, Venture Vortex 2026", source: "Venture Vortex 2026 brief (docs/CONTEXT.md)" },
    { value: "30–31 Oct", label: "Finale, on campus at NIT Warangal", source: "Venture Vortex 2026 brief (docs/CONTEXT.md)" },
    // CONFIRM: public source is the Technozion '23 brochure PDF on nitw.ac.in; not yet confirmed by the club.
    { value: "2006", label: "Year Technozion, our host festival, was established", source: "NITW Technozion '23 brochure (nitw.ac.in)" },
  ],
  // CONFIRM: three candidate closing lines.
  closing: [
    "Bring the idea. We'll bring the questions.",
    "Every company starts as an argument in a room.",
    "Show up with the idea. Leave with the flaw.",
  ],
  // CONFIRM: unsigned club-voice lines between photos. Not attributed to any person.
  quotes: [
    "We run the room. The room runs the ideas.",
    "Five minutes, one slide, no hiding.",
    "The best question is usually the rude one.",
  ],
} as const;
