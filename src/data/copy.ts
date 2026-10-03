// Every sentence here that is not a verified fact is CONFIRM (docs/COPY-REVIEW.md). Voice: short, first-person plural, dry, no clichés.
// Verified facts live in data/event.ts. Section titles are two to four words, one supporting line each.
export const copy = {
  hero: {
    label: "Entrepreneurship Club",                       // full name: hero sub-label only (and once in About)
  },
  numbers: { title: "Venture Vortex in numbers", line: "Verified facts about this year's flagship. Not lifetime club figures." },
  about: {
    title: "Who we are",
    line: "The students who run entrepreneurship at NIT Warangal.",   // CONFIRM
    lede: "We run competitions and pitch sessions where ideas get presented, questioned and sharpened. Bring a startup you admire or one you have not built yet.", // CONFIRM
  },
  initiatives: { title: "What we run", line: "Competitions first. More as the club confirms them." },
  reach: { title: "Campus to India", line: "Two rounds online, open across the country. The finale is on our campus." },
  flagship: { title: "Venture Vortex 2026", line: "Decode the business. Craft what's next." },
  posters: { title: "Event posters", line: "Our own flyers, newest first. Event photographs are in the Gallery." },
  speakers: { title: "Speakers", line: "" },
  voices: { title: "Voices", line: "" },
  backed: { title: "Backed by", line: "Collaborators on Venture Vortex 2026, named on the official poster." },
  join: { title: "Join us", line: "Come to an event, or write to us." },
} as const;
