// Self-hosted via next/font/local: no Google request from the visitor's browser.
// Files in src/fonts are subsets (Basic Latin, Latin-1, the punctuation we use) built by scripts/subset-fonts-v4.py from the OFL-licensed
// Bricolage Grotesque (variable: wght 200-800, wdth 75-100, opsz pinned at 96), Instrument Sans, Instrument Serif (roman only) and JetBrains Mono (500).
// Add a character outside that set => rerun the script, do not fall back to the stock files.
import localFont from "next/font/local";

export const bricolage = localFont({ src: "../fonts/bricolage-grotesque.woff2", weight: "200 800", variable: "--font-bricolage", display: "swap", adjustFontFallback: "Arial" });
export const instrument = localFont({ src: "../fonts/instrument-sans.woff2", weight: "400", variable: "--font-instrument", display: "swap", adjustFontFallback: "Arial" });
// Serif is for ledes and quotes only; it is below the fold in every layout, so it is not preloaded.
export const instrumentSerif = localFont({ src: "../fonts/instrument-serif.woff2", weight: "400", style: "normal", variable: "--font-instrument-serif", display: "swap", preload: false, adjustFontFallback: "Times New Roman" });
export const jetbrains = localFont({ src: "../fonts/jetbrains-mono.woff2", weight: "500", variable: "--font-jetbrains", display: "swap", adjustFontFallback: false, fallback: ["ui-monospace", "Cascadia Mono", "monospace"] });
