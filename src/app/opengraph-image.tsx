import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colours mirror the club tokens (next/og cannot read CSS variables).
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0b2226", color: "#f5f1e6", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#9fb8ba" }}>Venture Vortex 2026 · 30–31 Oct</div>
        <div style={{ display: "flex", fontSize: 104, fontWeight: 700, lineHeight: 1 }}>E-Club NIT Warangal</div>
        <div style={{ display: "flex", width: 240, height: 6, background: "#ed9038" }} />
      </div>
    ),
    size,
  );
}
