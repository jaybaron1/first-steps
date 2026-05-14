import React from "react";
import FlyerFrame from "./FlyerFrame";
import FlyerBrandImage from "./FlyerBrandImage";
import { FLYER_THEME as T, FLYER_FONTS as F } from "./flyerTheme";

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
  levelPrices?: { l2?: number; l3?: number; l4?: number };
  personaAddOnPrice?: number;
  showIntroducerBlock?: boolean;
  introducerCustomLine?: string;
}

const Intro: React.FC<{ data: FlyerData; innerRef: React.Ref<HTMLDivElement> }> = ({ data, innerRef }) => {
  const accent = data.accentColor || T.accent;
  return (
    <FlyerFrame ref={innerRef} size="letter">
      <div style={{ background: T.paper, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Top gold rule */}
        <div style={{ height: 6, background: accent }} />

        <div style={{ padding: "56px 64px 40px", flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 600, fontFamily: F.body }}>
              A personal introduction
            </p>
            <p style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: T.bodyMuted, margin: 0, fontWeight: 500, fontFamily: F.body }}>
              From Galavanteer
            </p>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: F.display,
              fontSize: 64,
              lineHeight: 1.02,
              fontWeight: 600,
              margin: "44px 0 0",
              color: T.ink,
              letterSpacing: "-0.01em",
            }}
          >
            {data.headline}
          </h1>

          {/* Italic tagline */}
          <p
            style={{
              fontFamily: F.display,
              fontStyle: "italic",
              fontSize: 22,
              lineHeight: 1.4,
              color: T.inkSoft,
              margin: "20px 0 0",
              maxWidth: 580,
              fontWeight: 400,
            }}
          >
            {data.tagline}
          </p>

          {/* Hairline */}
          <div style={{ width: 90, height: 1, background: accent, margin: "32px 0" }} />

          {/* Numbered bullets */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 560 }}>
            {data.bullets.slice(0, 3).map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 18 }}>
                <span
                  style={{
                    fontFamily: F.display,
                    fontSize: 22,
                    color: accent,
                    fontWeight: 500,
                    width: 32,
                    flexShrink: 0,
                    lineHeight: 1.1,
                  }}
                >
                  0{i + 1}
                </span>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: T.body,
                    margin: 0,
                    fontFamily: F.body,
                    fontStyle: "italic",
                  }}
                >
                  {b}
                </p>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Shared with you by */}
          <div style={{ marginTop: 40 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: T.bodyMuted, margin: 0, fontFamily: F.body, fontWeight: 500 }}>
              Shared with you by
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 12 }}>
              {data.photoUrl && (
                <FlyerBrandImage src={data.photoUrl} imageStyle={data.imageStyle} size={64} borderColor={accent} />
              )}
              <p
                style={{
                  fontFamily: F.display,
                  fontSize: 28,
                  fontWeight: 600,
                  color: T.ink,
                  margin: 0,
                  letterSpacing: "-0.005em",
                }}
              >
                {data.partnerName}
              </p>
            </div>
          </div>
        </div>

        {/* Footer band */}
        <div
          style={{
            background: T.paperEdge,
            borderTop: `1px solid ${T.hairline}`,
            padding: "16px 64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: F.body,
          }}
        >
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: T.bodyMuted, margin: 0, fontWeight: 500 }}>
            {data.partnerName} · In partnership with Galavanteer
          </p>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: T.bodyMuted, margin: 0, fontWeight: 500 }}>
            {data.referralUrl.replace(/^https?:\/\//, "")}
          </p>
        </div>
      </div>
    </FlyerFrame>
  );
};

export default Intro;
