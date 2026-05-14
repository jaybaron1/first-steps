import React from "react";
import FlyerFrame from "./FlyerFrame";
import FlyerBrandImage from "./FlyerBrandImage";
import type { FlyerData } from "./FlyerRoundtableIntro";

const EventInvite: React.FC<{ data: FlyerData; innerRef: React.Ref<HTMLDivElement> }> = ({ data, innerRef }) => (
  <FlyerFrame ref={innerRef}>
    <div style={{ height: "100%", padding: "88px 80px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      {data.photoUrl && (
        <div style={{ marginBottom: 32 }}>
          <FlyerBrandImage src={data.photoUrl} imageStyle={data.imageStyle} size={80} />
        </div>
      )}
      <p style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: data.accentColor, margin: 0, fontWeight: 600 }}>
        {data.partnerName} invites you
      </p>

      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 68, lineHeight: 1.05, fontWeight: 500, margin: "32px 0 0", color: "#0f172a", maxWidth: 640 }}>
        {data.headline}
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.55, color: "#475569", margin: "28px 0 0", maxWidth: 520 }}>{data.tagline}</p>

      <div style={{ width: 48, height: 2, background: data.accentColor, margin: "48px 0" }} />

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>
        {data.bullets.map((b, i) => (
          <li key={i} style={{ fontSize: 15, color: "#334155", lineHeight: 1.5 }}>{b}</li>
        ))}
      </ul>

      <div style={{ flex: 1 }} />

      {data.qrDataUrl && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <img src={data.qrDataUrl} style={{ width: 144, height: 144 }} />
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#64748b", margin: 0 }}>
              Scan to request access
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, marginTop: 8, color: "#0f172a", wordBreak: "break-all" }}>{data.referralUrl}</p>
          </div>
        </div>
      )}

      <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 32, letterSpacing: "0.08em" }}>The Roundtable · Galavanteer</p>
    </div>
  </FlyerFrame>
);

export default EventInvite;
