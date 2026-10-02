// The club's own posters (raw-media/posters, supplied by the owner 2 Oct 2026). Built by scripts/build-posters.mjs.
// Every poster's wording also exists as real text in `text` (rendered as HTML next to the image), so no content is image-only.
// `consent` records the basis for showing logos or faces; "club-owned poster, confirm" is listed in docs/COPY-REVIEW.md.
export type Poster = {
  slug: string; title: string; event: string;      // event: slug in data/events.ts
  alt: string; w: number; h: number;
  text: string[];                                   // the poster's words, in reading order
  consent: true | "club-owned poster, confirm";
  show: boolean;                                    // false = not built, not shipped
  why?: string;                                     // reason it is hidden
};

export const posters: Poster[] = [
  {
    slug: "vv-announcement", title: "Venture Vortex 2026 announcement", event: "venture-vortex-2026", w: 1024, h: 1451,
    alt: "Dark navy poster with the white words Venture Vortex, the line Decode the business, craft what's next, and a row of partner logos.",
    text: ["Technozion, NIT Warangal's, October 30 to 31 · Entrepreneurship Club", "Masters' Union University presents Venture Vortex", "Decode the business, craft what's next", "Powered by Unstop · Knowledge Partner Uplearn by Upstox · Outreach Partner S2S"],
    consent: "club-owned poster, confirm", show: true,
  },
  {
    slug: "vv-why", title: "Why participate", event: "venture-vortex-2026", w: 1024, h: 1451,
    alt: "Dark poster titled Why Participate with six numbered reasons and the line Build, Market, Pitch.",
    text: ["Why participate: experience the complete startup journey from identifying problems to building strategies.", "01 50k cash prize · 02 Goodies · 03 Exclusive rewards · 04 Networking and mentorship · 05 Entrepreneurship guidance · 06 Masters' Union campus visit", "Build, Market, Pitch", "Perfect for curious students, founders, product and marketing professionals, young entrepreneurs"],
    consent: true, show: true,
  },
  {
    slug: "vv-tracks", title: "Decode, Craft, Defend", event: "venture-vortex-2026", w: 1113, h: 1578, alt: "", text: [],
    consent: "club-owned poster, confirm", show: false,
    why: "Shows a woman's face in a stock-style photograph. Owner to confirm it is club material and may be shown.",
  },
  {
    slug: "vv-timeline", title: "Timeline", event: "venture-vortex-2026", w: 1113, h: 1578, alt: "", text: [],
    consent: "club-owned poster, confirm", show: false,
    why: "Shows identifiable people (a group at a Master's Union room), and its dates (registration 22 Sep to 3 Oct) differ from the Unstop timeline the owner declared authoritative.",
  },
];
export const shownPosters = (event?: string) => posters.filter((p) => p.show && (!event || p.event === event));
