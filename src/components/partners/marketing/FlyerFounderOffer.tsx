import React from "react";
import FlyerFrame from "./FlyerFrame";
import FlyerBrandImage from "./FlyerBrandImage";
import { FLYER_THEME as T, FLYER_FONTS as F } from "./flyerTheme";
import type { FlyerData } from "./FlyerRoundtableIntro";

const splitHeadline = (headline: string) => {
  // Split at first sentence boundary so we can italicize the second clause.
  const m = headline.match(/^(.+?[.!?])\s+(.+)$/);
  if (m) return { lead: m[1], tail: m[2] };
  return { lead: headline, tail: "" };
};

const FounderOffer: React.FC<{ data: FlyerData; innerRef: React.Ref<HTMLDivElement> }> = ({ data, innerRef }) => {
  const accent = data.accentColor || T.accent;
  const { lead, tail } = splitHeadline(data.headline);

  return (
    <FlyerFrame ref={innerRef} size="letter">
      <div style={{ background: T.paper, height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 6, background: accent }} />

        <div style={{ padding: "52px 64px 40px", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 600, fontFamily: F.body }}>
              Founder offer · By invitation
            </p>
            {data.photoUrl && (
              <FlyerBrandImage src={data.photoUrl} imageStyle={data.imageStyle} size={56} borderColor={accent} />
            )}
          </div>

          <h1
            style={{
              fontFamily: F.display,
              fontSize: 56,
              lineHeight: 1.05,
              fontWeight: 600,
              margin: "40px 0 0",
              color: T.ink,
              letterSpacing: "-0.01em",
            }}
          >
            {lead}
            {tail && (
              <>
                {" "}
                <span style={{ fontStyle: "italic", color: accent, fontWeight: 500 }}>{tail}</span>
              </>
            )}
          </h1>

          <p
            style={{
              fontFamily: F.display,
              fontStyle: "italic",
              fontSize: 19,
              lineHeight: 1.45,
              color: T.inkSoft,
              margin: "22px 0 0",
              maxWidth: 600,
            }}
          >
            {data.tagline}
          </p>

          <div style={{ width: 80, height: 1, background: accent, margin: "32px 0" }} />

          {/* Three pillar columns inspired by deck p.5 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 28, marginTop: 4 }}>
            {data.bullets.slice(0, 3).map((b, i) => (
              <div key={i}>
                <div style={{ height: 1, background: T.ink, marginBottom: 14 }} />
                <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 600, fontFamily: F.body }}>
                  0{i + 1}
                </p>
                <p
                  style={{
                    fontFamily: F.body,
                    fontStyle: "italic",
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: T.body,
                    margin: "10px 0 0",
                  }}
                >
                  {b}
                </p>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* CTA */}
          <div
            style={{
              marginTop: 40,
              padding: "24px 28px",
              background: T.paperEdge,
              border: `1px solid ${T.hairline}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 600, fontFamily: F.body }}>
                Reserved for {data.partnerName}'s circle
              </p>
              <p
                style={{
                  fontFamily: F.display,
                  fontSize: 18,
                  fontWeight: 500,
                  color: T.ink,
                  margin: "8px 0 0",
                  wordBreak: "break-all",
                }}
              >
                {data.referralUrl}
              </p>
            </div>
            {data.qrDataUrl && (
              <div style={{ background: "#fff", padding: 6, border: `1px solid ${T.hairline}` }}>
                <img src={data.qrDataUrl} style={{ width: 84, height: 84, display: "block" }} />
              </div>
            )}
          </div>
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

export default FounderOffer;
