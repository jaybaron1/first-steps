import React from "react";
import FlyerFrame from "./FlyerFrame";
import FlyerBrandImage from "./FlyerBrandImage";
import { FLYER_THEME as T, FLYER_FONTS as F } from "./flyerTheme";
import type { FlyerData } from "./FlyerRoundtableIntro";

const EventInvite: React.FC<{ data: FlyerData; innerRef: React.Ref<HTMLDivElement> }> = ({ data, innerRef }) => {
  const accent = data.accentColor || T.accent;
  return (
    <FlyerFrame ref={innerRef} size="letter">
      <div style={{ background: T.paper, height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 6, background: accent }} />

        <div
          style={{
            flex: 1,
            padding: "72px 80px 48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {data.photoUrl && (
            <div style={{ marginBottom: 28 }}>
              <FlyerBrandImage src={data.photoUrl} imageStyle={data.imageStyle} size={72} borderColor={accent} />
            </div>
          )}
          <p style={{ fontSize: 11, letterSpacing: "0.34em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 600, fontFamily: F.body }}>
            {data.partnerName} invites you
          </p>

          <h1
            style={{
              fontFamily: F.display,
              fontSize: 68,
              lineHeight: 1.02,
              fontWeight: 600,
              margin: "32px 0 0",
              color: T.ink,
              maxWidth: 660,
              letterSpacing: "-0.01em",
            }}
          >
            {data.headline}
          </h1>

          <p
            style={{
              fontFamily: F.display,
              fontStyle: "italic",
              fontSize: 21,
              lineHeight: 1.45,
              color: T.inkSoft,
              margin: "26px 0 0",
              maxWidth: 540,
            }}
          >
            {data.tagline}
          </p>

          <div style={{ width: 60, height: 1, background: accent, margin: "44px 0" }} />

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>
            {data.bullets.map((b, i) => (
              <li
                key={i}
                style={{
                  fontFamily: F.body,
                  fontStyle: "italic",
                  fontSize: 15,
                  color: T.body,
                  lineHeight: 1.55,
                }}
              >
                {b}
              </li>
            ))}
          </ul>

          <div style={{ flex: 1 }} />

          {data.qrDataUrl && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 36 }}>
              <div style={{ background: "#fff", padding: 8, border: `1px solid ${T.hairline}` }}>
                <img src={data.qrDataUrl} style={{ width: 132, height: 132, display: "block" }} />
              </div>
              <div>
                <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: T.bodyMuted, margin: 0, fontFamily: F.body, fontWeight: 600 }}>
                  Scan to request a seat
                </p>
                <p
                  style={{
                    fontFamily: F.display,
                    fontSize: 14,
                    fontWeight: 500,
                    marginTop: 6,
                    color: T.ink,
                    wordBreak: "break-all",
                  }}
                >
                  {data.referralUrl}
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            background: T.paperEdge,
            borderTop: `1px solid ${T.hairline}`,
            padding: "14px 64px",
            display: "flex",
            justifyContent: "space-between",
            fontFamily: F.body,
          }}
        >
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: T.bodyMuted, margin: 0, fontWeight: 500 }}>
            {data.partnerName} · In partnership with Galavanteer
          </p>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: T.bodyMuted, margin: 0, fontWeight: 500 }}>
            The Roundtable
          </p>
        </div>
      </div>
    </FlyerFrame>
  );
};

export default EventInvite;
