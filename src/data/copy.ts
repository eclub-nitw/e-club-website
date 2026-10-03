// Every sentence here that is not a verified fact is CONFIRM (docs/COPY-REVIEW.md). Voice: short, first-person plural, dry, no clichés.
// Club-wide copy sits at the top level. Copy about the featured initiative lives under `spotlight` and is shown only while it is promoted.
export const copy = {
  hero: { label: "Entrepreneurship Club" },                      // full name: hero sub-label only (and once in About)
  about: {
    title: "Who we are",
    line: "The students who run entrepreneurship at NIT Warangal.",   // CONFIRM
    lede: "We run competitions and pitch sessions where ideas get presented, questioned and sharpened. Bring a startup you admire or one you have not built yet.", // CONFIRM
    glance: "At a glance",
  },
  initiatives: { title: "What we run", line: "Competitions first. More as the club confirms them." },
  fromTheFloor: { title: "From the floor", line: "One photograph from each event we have run." },          // CONFIRM
  dive: { title: "Think. Connect. Create. Lead.", label: "The dive" },
  spotlight: {
    label: "This season's spotlight",
    eyebrow: "Now open",
    line: "Decode the business. Craft what's next.",               // the competition's tagline, from its poster
    reach: { title: "Campus to India", line: "Two rounds online, open across the country. The finale is on our campus." },
    partners: { title: "Event partners", line: "Partners of this competition. Club-wide sponsors are listed on the Sponsors page." },
  },
  speakers: { title: "Speakers", line: "" },
  voices: { title: "Voices", line: "" },
  join: { title: "Join us", line: "Come to an event, or write to us." },
} as const;
