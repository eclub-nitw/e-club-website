// Self-hosted via next/font/local: no Google request from the visitor's browser.
// Files in src/fonts are subsets (Basic Latin, Latin-1, the punctuation we use) pinned to the weights the design uses,
// built by scripts/subset-fonts.py from the OFL-licensed Bricolage Grotesque, Instrument Sans and JetBrains Mono.
// 39 KB in total instead of 111 KB from the stock variable files; that difference is worth ~0.5 s of Lighthouse LCP.
// Add a character outside that set (or a new weight) => rerun the script, do not fall back to the stock files.
import localFont from "next/font/local";

export const bricolage = localFont({ src: "../fonts/bricolage-grotesque.woff2", weight: "600 800", variable: "--font-bricolage", display: "swap", adjustFontFallback: "Arial" });
export const instrument = localFont({ src: "../fonts/instrument-sans.woff2", weight: "400", variable: "--font-instrument", display: "swap", adjustFontFallback: "Arial" });
export const jetbrains = localFont({ src: "../fonts/jetbrains-mono.woff2", weight: "400", variable: "--font-jetbrains", display: "swap", adjustFontFallback: false, fallback: ["ui-monospace", "Cascadia Mono", "monospace"] });
