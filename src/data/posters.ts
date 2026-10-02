// The club's own posters (raw-media/posters, supplied by the owner 2 Oct 2026). Built by scripts/build-posters.mjs.
// Every poster's wording also exists as real text in `text` (rendered as HTML next to the image), so no content is image-only.
// `consent` records the basis for showing logos or faces. On 2 Oct 2026 the owner confirmed all four posters are the club's own, that their
// dates are correct, and that they may be shown.
export type Poster = {
  slug: string; title: string; event: string;      // event: slug in data/events.ts
  alt: string; w: number; h: number;
  text: string[];                                   // the poster's words, in reading order
  consent: true | "club-owned poster, owner confirmed 2026-10-02";
  show: boolean;
};

export const posters: Poster[] = [
  {
    slug: "vv-announcement", title: "Venture Vortex 2026 announcement", event: "venture-vortex-2026", w: 1024, h: 1451,
    alt: "Dark navy poster with the white words Venture Vortex, the line Decode the business, craft what's next, and a row of partner logos.",
    text: ["Technozion, NIT Warangal's, October 30 to 31 · Entrepreneurship Club", "Masters' Union University presents Venture Vortex", "Decode the business, craft what's next", "Powered by Unstop · Knowledge Partner Uplearn by Upstox · Outreach Partner S2S"],
    consent: "club-owned poster, owner confirmed 2026-10-02", show: true,
  },
  {
    slug: "vv-tracks", title: "Decode, Craft, Defend", event: "venture-vortex-2026", w: 1024, h: 1451,
    alt: "Poster with three cards, Decode, Craft and Defend, above a woman writing on a glass board covered in notes and charts.",
    text: ["Decode · Product Teardown: analyze a startup's product, business model, and market strategy.", "Craft · Build / Market: identify an industry gap and develop your own business strategy.", "Defend · Present & Pitch: present your strategy to industry leaders from Masters' Union and compete for the top spot."],
    consent: "club-owned poster, owner confirmed 2026-10-02", show: true,
  },
  {
    slug: "vv-timeline", title: "Timeline", event: "venture-vortex-2026", w: 1024, h: 1451,
    alt: "Poster titled Timeline with three round cards above a group of people gathered around a laptop in a meeting room.",
    text: ["Round 1 · Decode: registration Sept 22 to Oct 03, submission Sept 24 to Oct 09, result Oct 10.", "Round 2 · Craft: track lock Oct 11 to Oct 18.", "Round 3 · Boardroom: Oct 30 to Oct 31."],
    consent: "club-owned poster, owner confirmed 2026-10-02", show: true,
  },
  {
    slug: "vv-why", title: "Why participate", event: "venture-vortex-2026", w: 1024, h: 1451,
    alt: "Dark poster titled Why Participate with six numbered reasons and the line Build, Market, Pitch.",
    text: ["Why participate: experience the complete startup journey from identifying problems to building strategies.", "01 50k cash prize · 02 Goodies · 03 Exclusive rewards · 04 Networking and mentorship · 05 Entrepreneurship guidance · 06 Masters' Union campus visit", "Build, Market, Pitch", "Perfect for curious students, founders, product and marketing professionals, young entrepreneurs"],
    consent: true, show: true,
  },
];
export const shownPosters = (event?: string) => posters.filter((p) => p.show && (!event || p.event === event));
