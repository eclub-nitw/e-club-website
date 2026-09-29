// Self-hosted via next/font (fast, and no Google request from the visitor's browser).
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";

export const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
export const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });
export const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

// In src/app/layout.tsx:
// <html lang="en-IN" className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}>
