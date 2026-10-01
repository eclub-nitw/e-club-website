// Every public sentence below that is not a verified fact is a CONFIRM candidate (docs/COPY-REVIEW.md).
// Lines with several options: the UI uses index 0; the club picks or rewrites. Voice: short, first-person plural, dry, no clichés.
// Verified facts (docs/CONTEXT.md): Venture Vortex 2026, all-India startup strategy competition, ₹50,000 prize pool, finale on campus 30-31 Oct 2026.
export const copy = {
  cover: {
    kicker: ["Entrepreneurship Club", "NIT Warangal"],
    // CONFIRM
    lede: ["Where ideas get argued with.", "Bring the idea. We bring the questions.", "A room for people who would rather build it."],
  },
  problem: {
    // CONFIRM: the "question" slide of the deck
    question: ["Where does a good idea go to be argued with?", "Who tells you your startup has a hole in it?", "What happens to the idea you never pitched?"],
    statements: [
      { label: "The idea", text: "Everyone has one. Few get tested." },
      { label: "The room", text: "A lectern, a slide, and people who ask the rude question." },
      { label: "The club", text: "We build that room." },
    ],
  },
  solution: {
    // CONFIRM: club description; replace with the club's own text from docs/CONTENT-INTAKE.md
    lede: [
      "We are the student entrepreneurship community of NIT Warangal. We run competitions and pitch sessions where ideas get presented, questioned and sharpened.",
      "E-Club is where NIT Warangal students take an idea to a room and find out if it holds.",
      "We make students pitch, then make them defend it.",
    ],
    // CONFIRM: draft areas; the first row is a verified fact, the others are drawn from what the photo archive shows
    areas: [
      { name: "Competitions", text: "Venture Vortex 2026 is our flagship: an all-India startup strategy competition." },
      { name: "Pitch sessions", text: "On-campus sessions where students present an idea to their peers." },
      { name: "Community", text: "A room for student founders, and for the curious." },
    ],
  },
  traction: {
    heading: "We only print numbers we can source.",
    note: "Each figure below carries its source. Growth figures appear here when the club supplies them.",
    illustration: "Illustration. Not data.",
  },
  events: { heading: "Things we run." },
  moments: { heading: "The room, mid-argument." },
  investors: {
    heading: ["Your name could be the first on this slide.", "Back the people who ask the rude question.", "Be the partner on the next slide."],
    body: "No partners are listed yet. If you would like to back student founders at NIT Warangal, the partner page has what you need.",
  },
  ask: { heading: "The ask." },
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
  thanks: "Thank you / Questions?",
} as const;
