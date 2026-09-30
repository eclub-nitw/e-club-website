export type Sponsor = {
  name: string;
  logo: string;            // /images/sponsors/<name>.svg
  width: number;           // intrinsic logo width at 40px height
  href?: string;
  consent: boolean;        // sponsor consent to show the logo; must be true to render
  tier?: string;
};

export const sponsors: Sponsor[] = [
  // Fill from the club with sponsor consent. Do NOT add logos scraped without permission.
];
