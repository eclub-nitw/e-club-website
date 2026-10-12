export type Member = {
  name: string; role: string; group: "Faculty" | "Core" | "Vertical" | "Tech" | "Design" | "Other";
  year: string;                    // academic year of service, e.g. "2026-27"
  photo?: string; linkedin?: string;
  photoConsent: boolean;           // must be true to show the photo
};
export const team: Member[] = [
  {
    name: "Bhavesh Vaishnav",
    role: "General Secretary",
    group: "Core",
    year: "2026-27",
    photoConsent: false,
  },
  {
    name: "Akash Hadpad",
    role: "Additional Secretary",
    group: "Core",
    year: "2026-27",
    photoConsent: false,
  },
  {
    name: "Faizan Ansari",
    role: "Additional Secretary",
    group: "Core",
    year: "2026-27",
    photoConsent: false,
  },
];
