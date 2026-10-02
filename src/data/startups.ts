/**
 * The 50 startups of Round 1 — copied from the official "Behind the Startup" brief (numbers, names and sector labels are Unstop's).
 * `group` is OUR layout grouping (8 arms of the galaxy) — it is not an official category.
 * `logo` files were fetched from each company's own website (favicon / apple-touch icon) and are used only to identify the company.
 * Logos with logo:null get a monogram. To add or replace a logo: drop a square PNG/SVG in /public/images/startups/ and set the path.
 * Do NOT invent, reorder the official numbers, or add companies.
 */
export type StartupGroup =
  | "AI & Deep Infra" | "Space & Defence" | "Mobility & Energy" | "Commerce & D2C"
  | "FinTech & Insurance" | "HealthTech" | "SaaS & DevTools" | "Agritech";

export type Startup = { n: number; name: string; sector: string; group: StartupGroup; logo: string | null; site: string };

export const startupGroups: StartupGroup[] = [
  "AI & Deep Infra", "Space & Defence", "Mobility & Energy", "Commerce & D2C",
  "FinTech & Insurance", "HealthTech", "SaaS & DevTools", "Agritech",
];

export const startups: Startup[] = [
  { n: 1, name: "Sarvam AI", sector: "AI", group: "AI & Deep Infra", logo: "/images/startups/sarvam-ai.svg", site: "https://sarvam.ai" },
  { n: 2, name: "Neysa", sector: "AI Infrastructure", group: "AI & Deep Infra", logo: "/images/startups/neysa.png", site: "https://neysa.ai" },
  { n: 3, name: "Krutrim", sector: "AI", group: "AI & Deep Infra", logo: "/images/startups/krutrim.png", site: "https://olakrutrim.com" },
  { n: 4, name: "Emergent", sector: "AI / Software", group: "AI & Deep Infra", logo: "/images/startups/emergent.png", site: "https://emergent.sh" },
  { n: 5, name: "Uniphore", sector: "Enterprise AI", group: "AI & Deep Infra", logo: "/images/startups/uniphore.png", site: "https://uniphore.com" },
  { n: 6, name: "E2E Networks", sector: "Cloud / AI Infrastructure", group: "AI & Deep Infra", logo: "/images/startups/e2e-networks.png", site: "https://e2enetworks.com" },
  { n: 7, name: "Pixxel", sector: "SpaceTech", group: "Space & Defence", logo: "/images/startups/pixxel.png", site: "https://pixxel.space" },
  { n: 8, name: "Skyroot Aerospace", sector: "SpaceTech", group: "Space & Defence", logo: "/images/startups/skyroot-aerospace.png", site: "https://skyroot.in" },
  { n: 9, name: "Agnikul Cosmos", sector: "SpaceTech", group: "Space & Defence", logo: "/images/startups/agnikul-cosmos.png", site: "https://agnikul.in" },
  { n: 10, name: "Digantara", sector: "SpaceTech", group: "Space & Defence", logo: null, site: "https://digantara.com" },
  { n: 11, name: "Dhruva Space", sector: "SpaceTech", group: "Space & Defence", logo: "/images/startups/dhruva-space.png", site: "https://dhruvaspace.com" },
  { n: 12, name: "ideaForge", sector: "Drones / DefenceTech", group: "Space & Defence", logo: "/images/startups/ideaforge.png", site: "https://ideaforgetech.com" },
  { n: 13, name: "NewSpace Research & Technologies", sector: "Drones / DefenceTech", group: "Space & Defence", logo: "/images/startups/newspace-research-technologies.png", site: "https://newspace.co.in" },
  { n: 14, name: "Zepto", sector: "Quick Commerce", group: "Commerce & D2C", logo: "/images/startups/zepto.png", site: "https://zeptonow.com" },
  { n: 15, name: "Rapido", sector: "Mobility", group: "Mobility & Energy", logo: "/images/startups/rapido.png", site: "https://rapido.bike" },
  { n: 16, name: "Ather Energy", sector: "EV / Mobility", group: "Mobility & Energy", logo: null, site: "https://atherenergy.com" },
  { n: 17, name: "Exponent Energy", sector: "EV / Energy", group: "Mobility & Energy", logo: null, site: "https://exponent-energy.com" },
  { n: 18, name: "OfBusiness", sector: "B2B / FinTech", group: "Commerce & D2C", logo: "/images/startups/ofbusiness.png", site: "https://ofbusiness.com" },
  { n: 19, name: "Meesho", sector: "E-commerce", group: "Commerce & D2C", logo: "/images/startups/meesho.png", site: "https://meesho.com" },
  { n: 20, name: "CRED", sector: "FinTech", group: "FinTech & Insurance", logo: "/images/startups/cred.png", site: "https://cred.club" },
  { n: 21, name: "KreditBee", sector: "FinTech", group: "FinTech & Insurance", logo: "/images/startups/kreditbee.png", site: "https://kreditbee.in" },
  { n: 22, name: "Acko", sector: "InsurTech", group: "FinTech & Insurance", logo: "/images/startups/acko.png", site: "https://acko.com" },
  { n: 23, name: "Jar", sector: "FinTech", group: "FinTech & Insurance", logo: "/images/startups/jar.png", site: "https://myjar.app" },
  { n: 24, name: "Fi", sector: "FinTech", group: "FinTech & Insurance", logo: "/images/startups/fi.png", site: "https://fi.money" },
  { n: 25, name: "Kaleidofin", sector: "FinTech", group: "FinTech & Insurance", logo: "/images/startups/kaleidofin.png", site: "https://kaleidofin.com" },
  { n: 26, name: "SarvaGram", sector: "Rural FinTech", group: "FinTech & Insurance", logo: "/images/startups/sarvagram.png", site: "https://sarvagram.com" },
  { n: 27, name: "Orange Health Labs", sector: "HealthTech", group: "HealthTech", logo: "/images/startups/orange-health-labs.png", site: "https://orangehealth.in" },
  { n: 28, name: "Qure.ai", sector: "HealthTech / AI", group: "HealthTech", logo: "/images/startups/qure-ai.png", site: "https://qure.ai" },
  { n: 29, name: "Innovaccer", sector: "HealthTech / SaaS", group: "HealthTech", logo: "/images/startups/innovaccer.png", site: "https://innovaccer.com" },
  { n: 30, name: "MediBuddy", sector: "HealthTech", group: "HealthTech", logo: "/images/startups/medibuddy.png", site: "https://medibuddy.com" },
  { n: 31, name: "Practo", sector: "HealthTech", group: "HealthTech", logo: "/images/startups/practo.png", site: "https://practo.com" },
  { n: 32, name: "Cult.fit", sector: "HealthTech / Fitness", group: "HealthTech", logo: "/images/startups/cult-fit.png", site: "https://cult.fit" },
  { n: 33, name: "Whatfix", sector: "SaaS", group: "SaaS & DevTools", logo: "/images/startups/whatfix.png", site: "https://whatfix.com" },
  { n: 34, name: "BrowserStack", sector: "SaaS / Developer Tools", group: "SaaS & DevTools", logo: "/images/startups/browserstack.png", site: "https://browserstack.com" },
  { n: 35, name: "Postman", sector: "SaaS / Developer Tools", group: "SaaS & DevTools", logo: "/images/startups/postman.png", site: "https://postman.com" },
  { n: 36, name: "Darwinbox", sector: "SaaS / HRTech", group: "SaaS & DevTools", logo: "/images/startups/darwinbox.png", site: "https://darwinbox.com" },
  { n: 37, name: "Chargebee", sector: "SaaS / FinTech", group: "SaaS & DevTools", logo: "/images/startups/chargebee.png", site: "https://chargebee.com" },
  { n: 38, name: "Moglix", sector: "B2B Commerce", group: "Commerce & D2C", logo: "/images/startups/moglix.png", site: "https://moglix.com" },
  { n: 39, name: "Groyyo", sector: "Manufacturing / FashionTech", group: "Commerce & D2C", logo: "/images/startups/groyyo.png", site: "https://groyyo.com" },
  { n: 40, name: "DeHaat", sector: "Agritech", group: "Agritech", logo: "/images/startups/dehaat.png", site: "https://agrevolution.in" },
  { n: 41, name: "Ninjacart", sector: "Agritech / Supply Chain", group: "Agritech", logo: "/images/startups/ninjacart.png", site: "https://ninjacart.com" },
  { n: 42, name: "Kapture CX", sector: "Enterprise AI", group: "AI & Deep Infra", logo: "/images/startups/kapture-cx.png", site: "https://kapture.cx" },
  { n: 43, name: "Equal", sector: "Identity / FinTech", group: "FinTech & Insurance", logo: "/images/startups/equal.png", site: "https://equal.in" },
  { n: 44, name: "Reo.Dev", sector: "Sales Intelligence", group: "SaaS & DevTools", logo: "/images/startups/reo-dev.png", site: "https://reo.dev" },
  { n: 45, name: "TartanSense", sector: "Agritech / Robotics", group: "Agritech", logo: null, site: "https://tartansense.com" },
  { n: 46, name: "Aina", sector: "AI Hardware", group: "AI & Deep Infra", logo: null, site: "https://ainatech.ai" },
  { n: 47, name: "The Whole Truth", sector: "D2C / Food", group: "Commerce & D2C", logo: "/images/startups/the-whole-truth.png", site: "https://thewholetruthfoods.com" },
  { n: 48, name: "Minimalist", sector: "D2C / Beauty", group: "Commerce & D2C", logo: "/images/startups/minimalist.png", site: "https://beminimalist.co" },
  { n: 49, name: "Snitch", sector: "D2C / Fashion", group: "Commerce & D2C", logo: "/images/startups/snitch.png", site: "https://snitch.com" },
  { n: 50, name: "Lenskart", sector: "ConsumerTech / Retail", group: "Commerce & D2C", logo: "/images/startups/lenskart.png", site: "https://lenskart.com" },
];

export const startupsDisclaimer =
  "Company names and logos are trademarks of their respective owners and are shown only to identify the startups available for Round 1. No affiliation, sponsorship or endorsement is implied.";
