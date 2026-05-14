import React from "react";
import FlyerFrame from "./FlyerFrame";
import FlyerBrandImage from "./FlyerBrandImage";
import GalavanteerMark from "./GalavanteerMark";
import type { FlyerData } from "./FlyerRoundtableIntro";

const FounderOffer: React.FC<{ data: FlyerData; innerRef: React.Ref<HTMLDivElement> }> = ({ data, innerRef }) => (
  <FlyerFrame ref={innerRef}>
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0f172a", color: "#f8fafc" }}>
      {/* Hero */}
      <div style={{ padding: "56px 56px 40px", borderBottom: `4px solid ${data.accentColor}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: data.accentColor, margin: 0, fontWeight: 600 }}>
            Founder offer · By invitation
          </p>
          {data.photoUrl && (
            <FlyerBrandImage src={data.photoUrl} imageStyle={data.imageStyle} size={56} />
          )}
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 64, lineHeight: 1, fontWeight: 500, margin: 0 }}>
          {data.headline}
        </h1>
        <p style={{ fontSize: 17, color: "#cbd5e1", marginTop: 24, lineHeight: 1.5, maxWidth: 580 }}>{data.tagline}</p>
      </div>

      {/* Stat */}
      <div style={{ padding: "40px 56px 32px", display: "flex", gap: 40, alignItems: "baseline" }}>
        <div>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 88, lineHeight: 1, margin: 0, color: data.accentColor, fontWeight: 600 }}>
            1:1
          </p>
          <p style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#94a3b8", marginTop: 8 }}>
            Private working session
          </p>
        </div>
        <div style={{ flex: 1, paddingLeft: 32, borderLeft: "1px solid #1e293b" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {data.bullets.map((b, i) => (
              <li key={i} style={{ display: "flex", gap: 12, fontSize: 15, color: "#e2e8f0", lineHeight: 1.5 }}>
                <span style={{ color: data.accentColor, fontWeight: 700 }}>+</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* CTA footer */}
      <div style={{ padding: "32px 56px 48px", background: "#020617", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: data.accentColor, margin: 0, fontWeight: 600 }}>
            Reserved for {data.partnerName}'s circle
          </p>
          <p style={{ fontSize: 16, fontWeight: 600, marginTop: 8, color: "#f8fafc", wordBreak: "break-all" }}>{data.referralUrl}</p>
          <div style={{ marginTop: 14 }}>
            <GalavanteerMark color="#94a3b8" invert />
          </div>
        </div>
        {data.qrDataUrl && (
          <div style={{ background: "#fff", padding: 8, borderRadius: 4 }}>
            <img src={data.qrDataUrl} style={{ width: 96, height: 96, display: "block" }} />
          </div>
        )}
      </div>
    </div>
  </FlyerFrame>
);

export default FounderOffer;
