import React from "react";
import FlyerFrame from "./FlyerFrame";
import FlyerBrandImage from "./FlyerBrandImage";

export interface FlyerData {
  partnerName: string;
  photoUrl: string | null;
  headline: string;
  tagline: string;
  bullets: string[];
  accentColor: string;
  referralUrl: string;
  qrDataUrl: string | null;
  setupPrice?: number;
  imageStyle?: "photo" | "logo";
}

const Editorial: React.FC<{ data: FlyerData; innerRef: React.Ref<HTMLDivElement> }> = ({ data, innerRef }) => (
  <FlyerFrame ref={innerRef}>
    <div style={{ padding: "64px 64px 56px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b", margin: 0 }}>
            An invitation from
          </p>
          <p style={{ fontSize: 22, fontWeight: 600, marginTop: 8, color: "#0f172a" }}>{data.partnerName}</p>
        </div>
        {data.photoUrl && (
          <FlyerBrandImage
            src={data.photoUrl}
            imageStyle={data.imageStyle}
            size={96}
            borderColor={data.accentColor}
          />
        )}
      </div>

      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 56, lineHeight: 1.05, fontWeight: 500, margin: 0, color: "#0f172a" }}>
        {data.headline}
      </h1>
      <div style={{ width: 72, height: 3, background: data.accentColor, margin: "32px 0" }} />
      <p style={{ fontSize: 18, lineHeight: 1.55, color: "#334155", margin: 0, maxWidth: 560 }}>{data.tagline}</p>

      <ul style={{ listStyle: "none", padding: 0, margin: "48px 0 0", display: "flex", flexDirection: "column", gap: 18 }}>
        {data.bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", fontSize: 16, color: "#1e293b", lineHeight: 1.5 }}>
            <span style={{ color: data.accentColor, fontWeight: 700, marginTop: 2 }}>—</span>
            {b}
          </li>
        ))}
      </ul>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #e2e8f0", paddingTop: 28 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b", margin: 0 }}>
            Request access
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, marginTop: 6, color: "#0f172a", wordBreak: "break-all" }}>{data.referralUrl}</p>
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 12, letterSpacing: "0.05em" }}>The Roundtable · Galavanteer</p>
        </div>
        {data.qrDataUrl && <img src={data.qrDataUrl} style={{ width: 96, height: 96 }} />}
      </div>
    </div>
  </FlyerFrame>
);

export default Editorial;
