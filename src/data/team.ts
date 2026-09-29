export type Member = {
  name: string; role: string; group: "Faculty" | "Core" | "Vertical" | "Tech" | "Design" | "Other";
  year: string;                    // academic year of service, e.g. "2026-27"
  photo?: string; linkedin?: string;
  photoConsent: boolean;           // must be true to show the photo
};
export const team: Member[] = [
  // Fill from the club. Public roles and names only; no phone numbers.
];
