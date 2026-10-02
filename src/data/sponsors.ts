export type Sponsor = {
  name: string;
  logo?: string;           // /images/sponsors/<name>.svg, only with written consent
  width?: number;          // intrinsic logo width at 40px height
  href?: string;
  consent: boolean;        // written consent to show the logo; names are shown as plain type regardless
  tier?: string;
  role: string;            // how the partner is named on the official poster
};

// Named on the official Venture Vortex 2026 poster (raw-media/posters). Shown as typographic names: no logo files without written consent.
export const sponsors: Sponsor[] = [
  { name: "Master's Union", role: "In collaboration with", consent: false },
  { name: "Unstop", role: "Powered by", consent: false, href: "https://unstop.com/o/cxKq1kz?lb=usedZ8to" },
  { name: "School2Startup", role: "Outreach partner", consent: false },
  { name: "Technozion", role: "Part of", consent: false },
  { name: "Uplearn by Upstox", role: "Knowledge partner", consent: false },   // on the poster; not in event.ts: CONFIRM
];
