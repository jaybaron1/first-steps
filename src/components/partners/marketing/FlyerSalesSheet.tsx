import React from "react";
import FlyerFrame from "./FlyerFrame";
import FlyerBrandImage from "./FlyerBrandImage";
import GalavanteerMark from "./GalavanteerMark";
import type { FlyerData } from "./FlyerRoundtableIntro";

const PILLARS = [
  { title: "A real boardroom, on demand", body: "3–5 executive personas, calibrated to the decision in front of you." },
  { title: "Built around your business", body: "Knows your company, customers, and how you actually decide." },
  { title: "Structured to an answer", body: "Alignment, exploration, your steering, convergence, written deliverable." },
  { title: "Private and yours", body: "Lives in your own ChatGPT. No new tools. No shared logins." },
];

type Tier = {
  n: string;
  name: string;
  body: string;
  price: string;
  unit: string;
  required?: boolean;
};

const TIERS: Tier[] = [
  { n: "I", name: "The Roundtable", body: "The room itself. Sixty advisors, one owner.", price: "$79", unit: "/ month", required: true },
  { n: "II", name: "The Operating Frame", body: "Your company, in their hands.", price: "+$1,500", unit: "one-time" },
  { n: "III", name: "Take A Seat", body: "You, in the room when you're not.", price: "+$2,500", unit: "one-time" },
  { n: "IV", name: "Future Me", body: "Tested against who you're becoming.", price: "+$300", unit: "per persona, one-time" },
  { n: "V", name: "Add a Voice", body: "A teammate's voice in the room when they're not.", price: "+$500", unit: "each, one-time" },
  { n: "VI", name: "Pull Up a Chair", body: "A login for a teammate to join the room live.", price: "$29", unit: "/ chair / month" },
];

const DEFAULT_MARGARITA_NOTE =
  "A named persona at the table from day one — sharp, candid, and tuned to the way your business actually moves.";

const SalesSheet: React.FC<{ data: FlyerData; innerRef: React.Ref<HTMLDivElement> }> = ({ data, innerRef }) => {
  const accent = data.accentColor;
  const ink = "#0F172A";
  const paper = "#FFFFFF";
  const muted = "#64748B";
  const body = "#334155";
  const hairline = "#E5E7EB";
  const cream = "#FAF7F2";
  const showMargarita = data.showMargarita ?? true;
  const margaritaNote = (data.margaritaNote ?? "").trim() || DEFAULT_MARGARITA_NOTE;

  const labelStyle: React.CSSProperties = {
    fontSize: 9,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    fontWeight: 700,
    color: accent,
    margin: 0,
  };

  return (
    <FlyerFrame ref={innerRef} size="letter">
      {/* faint accent ornaments */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 220, height: 220, background: `radial-gradient(circle at top right, ${accent}14, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 260, height: 180, background: `radial-gradient(circle at bottom left, ${accent}10, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ position: "relative", padding: "40px 48px 32px", height: "100%", display: "flex", flexDirection: "column" }}>
        {/* === Masthead === */}
        <div
          style={{
            background: ink,
            color: paper,
            padding: "20px 24px",
            borderRadius: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accent }} />
          <div style={{ paddingLeft: 14 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 700 }}>
              Presented by {data.partnerName}
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 30,
                lineHeight: 1.05,
                fontWeight: 500,
                margin: "8px 0 0",
                color: paper,
              }}
            >
              The Roundtable
            </h1>
            <p style={{ fontSize: 10.5, color: "#CBD5E1", margin: "6px 0 0", letterSpacing: "0.04em" }}>
              A software boardroom for founders & executives — by Galavanteer.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: paper, padding: 6, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GalavanteerMark color={ink} size={26} showWordmark={false} />
            </div>
            {data.photoUrl && (
              <div style={{ background: paper, padding: 4, borderRadius: 999 }}>
                <FlyerBrandImage src={data.photoUrl} imageStyle={data.imageStyle} size={56} borderColor={accent} />
              </div>
            )}
          </div>
        </div>

        {/* === Lead === */}
        <div style={{ marginTop: 18, paddingBottom: 14, borderBottom: `1px solid ${hairline}` }}>
          <p style={labelStyle}>What it is</p>
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 16.5,
              lineHeight: 1.45,
              color: ink,
              margin: "8px 0 0",
              fontWeight: 400,
            }}
          >
            {data.tagline}
          </p>
        </div>

        {/* === Pillars + Margarita === */}
        <div style={{ display: "grid", gridTemplateColumns: showMargarita ? "1.1fr 1fr" : "1fr", gap: 24, marginTop: 16 }}>
          <div>
            <p style={labelStyle}>What you actually get</p>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {PILLARS.map((p) => (
                <div key={p.title} style={{ display: "flex", gap: 8 }}>
                  <div style={{ width: 4, background: accent, borderRadius: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: ink, margin: 0 }}>{p.title}</p>
                    <p style={{ fontSize: 10, lineHeight: 1.45, color: body, margin: "2px 0 0" }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showMargarita && (
            <div
              style={{
                background: cream,
                border: `1px solid ${accent}40`,
                borderRadius: 4,
                padding: 14,
                display: "flex",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  background: ink,
                  color: accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 600,
                  flexShrink: 0,
                  border: `2px solid ${accent}`,
                }}
              >
                M
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 8.5, letterSpacing: "0.24em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 700 }}>
                  Included in your boardroom
                </p>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, color: ink, margin: "2px 0 0", fontWeight: 600, lineHeight: 1.1 }}>
                  Margarita
                </p>
                <p style={{ fontSize: 9.5, color: muted, margin: "2px 0 0", fontStyle: "italic" }}>
                  Founder of Galavanteer · in-house strategist
                </p>
                <p style={{ fontSize: 10, lineHeight: 1.5, color: body, margin: "6px 0 0" }}>
                  {margaritaNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* === Pricing — readable, light === */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <p style={labelStyle}>Configure your room</p>
            <p style={{ fontSize: 9, color: muted, margin: 0, letterSpacing: "0.06em" }}>
              One subscription. Stack what you need.
            </p>
          </div>

          <div
            style={{
              border: `1px solid ${hairline}`,
              borderRadius: 4,
              overflow: "hidden",
              background: paper,
            }}
          >
            {TIERS.map((t, i) => {
              const isLast = i === TIERS.length - 1;
              return (
                <div
                  key={t.n}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px 1fr auto",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderBottom: isLast ? "none" : `1px solid ${hairline}`,
                    background: i % 2 === 0 ? paper : "#FBFAF7",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: accent,
                      textAlign: "center",
                      borderRight: `1px solid ${accent}30`,
                      paddingRight: 6,
                    }}
                  >
                    {t.n}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: ink, margin: 0 }}>{t.name}</p>
                      {t.required && (
                        <span
                          style={{
                            fontSize: 7.5,
                            fontWeight: 700,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: accent,
                            border: `1px solid ${accent}`,
                            padding: "1px 5px",
                            borderRadius: 999,
                          }}
                        >
                          Required
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 10, color: muted, margin: "1px 0 0", lineHeight: 1.4 }}>{t.body}</p>
                  </div>
                  <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: ink, margin: 0, lineHeight: 1 }}>
                      {t.price}
                    </p>
                    <p style={{ fontSize: 8.5, color: muted, margin: "2px 0 0", letterSpacing: "0.04em" }}>
                      {t.unit}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: 9, color: muted, margin: "8px 0 0", lineHeight: 1.4 }}>
            Self-serve · Cancel anytime · Launch pricing, subject to change. ChatGPT subscription billed separately by OpenAI.
          </p>
        </div>

        <div style={{ flex: 1 }} />

        {/* === Footer === */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${hairline}`,
            paddingTop: 14,
            marginTop: 16,
          }}
        >
          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: muted, margin: 0, fontWeight: 700 }}>
              Request access
            </p>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, color: ink, margin: "5px 0 0", wordBreak: "break-all", fontWeight: 500 }}>
              {data.referralUrl}
            </p>
            <div style={{ marginTop: 10 }}>
              <GalavanteerMark color={ink} />
            </div>
          </div>
          {data.qrDataUrl && (
            <div style={{ padding: 4, background: paper, border: `1px solid ${hairline}`, borderRadius: 4 }}>
              <img src={data.qrDataUrl} style={{ width: 72, height: 72, display: "block" }} />
            </div>
          )}
        </div>
      </div>
    </FlyerFrame>
  );
};

export default SalesSheet;
