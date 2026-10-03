import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colours mirror the club tokens (next/og cannot read CSS variables).
export default async function OgImage() {
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/images/brand/eclub-logo-512.png"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0b2226", color: "#f5f1e6", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#9fb8ba" }}>Entrepreneurship Club · Warangal, Telangana</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={150} height={150} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 700, lineHeight: 1 }}>E-Club NIT Warangal</div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 40, color: "#9fb8ba" }}>{site.quote.line}</div>
        </div>
        <div style={{ display: "flex", width: 240, height: 6, background: "#ed9038" }} />
      </div>
    ),
    size,
  );
}
