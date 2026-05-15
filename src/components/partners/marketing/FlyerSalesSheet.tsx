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

type LevelKey = "l2" | "l3" | "l4" | "l5";
type Level = { n: number; name: string; body: string; priceKey: LevelKey | null };

const LEVELS: Level[] = [
  { n: 1, name: "The Roundtable",      body: "The room itself. Three to five of sixty-plus senior advisors.", priceKey: null },
  { n: 2, name: "The Operating Frame", body: "Your company, in their hands.",                                  priceKey: "l2" },
  { n: 3, name: "Take A Seat",         body: "You, in the room when you're not.",                              priceKey: "l3" },
  { n: 4, name: "Future Me",           body: "Tested against who you're becoming.",                            priceKey: "l4" },
  { n: 5, name: "Add a Voice",         body: "A teammate's voice in the room when they're not.",               priceKey: "l5" },
];

const DEFAULT_MARGARITA_NOTE =
  "A named persona at the table from day one — sharp, candid, and tuned to the way your business actually moves.";

const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;
const priceLabel = (v: number | undefined) => (v && v > 0 ? fmt(v) : "Quoted on request");

const SalesSheet: React.FC<{ data: FlyerData; innerRef: React.Ref<HTMLDivElement> }> = ({ data, innerRef }) => {
  const setup = data.setupPrice ?? 6000;
  const lp = data.levelPrices ?? {};
  const accent = data.accentColor;
  const showMargarita = data.showMargarita ?? true;
  const margaritaNote = (data.margaritaNote ?? "").trim() || DEFAULT_MARGARITA_NOTE;

  const ink = "#0F172A";
  const paper = "#FFFFFF";
  const muted = "#64748B";
  const body = "#334155";
  const hairline = "#E5E7EB";
  const cream = "#FAF7F2";

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
      {/* Faint accent ornaments */}
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
                letterSpacing: "-0.005em",
              }}
            >
              The Roundtable
            </h1>
            <p style={{ fontSize: 10.5, color: "#CBD5E1", margin: "6px 0 0", letterSpacing: "0.04em" }}>
              A private executive boardroom inside your own ChatGPT.
            </p>
          </div>
          {data.photoUrl && (
            <div style={{ background: paper, padding: 4, borderRadius: 999 }}>
              <FlyerBrandImage src={data.photoUrl} imageStyle={data.imageStyle} size={56} borderColor={accent} />
            </div>
          )}
        </div>

        {/* === Lead === */}
        <div style={{ marginTop: 18, paddingBottom: 14, borderBottom: `1px solid ${hairline}` }}>
          <p style={labelStyle}>What it is</p>
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 16,
              lineHeight: 1.45,
              color: ink,
              margin: "8px 0 0",
              fontWeight: 400,
            }}
          >
            {data.tagline}
          </p>
        </div>

        {/* === Two columns: pillars + ladder === */}
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 24, marginTop: 16 }}>
          {/* LEFT: pillars + Margarita */}
          <div>
            <p style={labelStyle}>What you actually get</p>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 9 }}>
              {PILLARS.map((p) => (
                <div key={p.title} style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 4, background: accent, borderRadius: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: ink, margin: 0 }}>{p.title}</p>
                    <p style={{ fontSize: 10, lineHeight: 1.45, color: body, margin: "2px 0 0" }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {showMargarita && (
              <div
                style={{
                  marginTop: 14,
                  background: cream,
                  border: `1px solid ${accent}33`,
                  borderRadius: 4,
                  padding: 12,
                  display: "flex",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 999,
                    background: ink,
                    color: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 19,
                    fontWeight: 600,
                    flexShrink: 0,
                    border: `2px solid ${accent}`,
                  }}
                >
                  M
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 8, letterSpacing: "0.24em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 700 }}>
                    Included in your boardroom
                  </p>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, color: ink, margin: "2px 0 0", fontWeight: 600, lineHeight: 1.1 }}>
                    Margarita
                  </p>
                  <p style={{ fontSize: 9.5, color: muted, margin: "1px 0 0", fontStyle: "italic" }}>
                    Founder of Galavanteer · in-house strategist
                  </p>
                  <p style={{ fontSize: 10, lineHeight: 1.45, color: body, margin: "5px 0 0" }}>
                    {margaritaNote}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: ladder (6 tiers) */}
          <div>
            <p style={labelStyle}>How deep you go</p>
            <div style={{ marginTop: 10, position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: 15.5,
                  top: 16,
                  bottom: 16,
                  width: 1,
                  background: `${accent}40`,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {LEVELS.map((lvl) => {
                  const isBase = lvl.priceKey === null;
                  const price = isBase ? "Included" : priceLabel(lp[lvl.priceKey!]);
                  return (
                    <div key={lvl.n} style={{ display: "flex", alignItems: "flex-start", gap: 10, position: "relative" }}>
                      <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: "block", flexShrink: 0, zIndex: 1, overflow: "visible" }}>
                        <circle cx="16" cy="16" r="15" fill={paper} stroke={accent} strokeWidth="1.5" />
                        <text
                          x="16"
                          y="16"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontFamily="Georgia, 'Times New Roman', serif"
                          fontSize="15"
                          fontWeight="600"
                          fill={accent}
                        >
                          {lvl.n}
                        </text>
                      </svg>
                      <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: ink, margin: 0 }}>{lvl.name}</p>
                          {isBase ? (
                            <svg width="72" height="18" viewBox="0 0 72 18" style={{ display: "block", flexShrink: 0 }}>
                              <rect x="0.5" y="0.5" width="71" height="17" rx="8.5" fill="none" stroke={accent} strokeWidth="1" />
                              <text
                                x="36"
                                y="9"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontFamily="Inter, Arial, sans-serif"
                                fontSize="7.5"
                                fontWeight="700"
                                letterSpacing="1.35"
                                fill={accent}
                              >
                                INCLUDED
                              </text>
                            </svg>
                          ) : (
                            <span style={{ fontSize: 10, fontWeight: 700, color: ink, whiteSpace: "nowrap", lineHeight: 1.2 }}>{price}</span>
                          )}
                        </div>
                        <p style={{ fontSize: 9.5, lineHeight: 1.4, color: muted, margin: "2px 0 0" }}>{lvl.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* === Investment === */}
        <div
          style={{
            marginTop: 18,
            border: `1px solid ${accent}55`,
            borderRadius: 4,
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            overflow: "hidden",
          }}
        >
          {/* LEFT: light cream panel with accent stripe + ink price */}
          <div style={{ padding: "16px 20px", background: cream, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accent }} />
            <p style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 700 }}>
              Investment · Workspace build
            </p>
            <svg width="210" height="48" viewBox="0 0 210 48" style={{ display: "block", marginTop: 8, overflow: "visible" }}>
              <text
                x="0"
                y="25"
                dominantBaseline="central"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="40"
                fontWeight="700"
                fill={ink}
              >
                {fmt(setup)}
              </text>
            </svg>
            <p style={{ fontSize: 9.5, color: muted, margin: "10px 0 0", lineHeight: 1.4 }}>
              One-time setup. Tier 1 subscription required. Upgrades priced individually.
            </p>
          </div>
          <div style={{ padding: "14px 20px", background: paper }}>
            <p style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: muted, margin: 0, fontWeight: 700 }}>
              Not included — billed separately
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                { label: "ChatGPT Teams (paid to OpenAI)", price: "$50 / mo" },
                { label: "Each additional user", price: "$100 / mo" },
                { label: "Ongoing maintenance", price: "$200 / mo" },
              ].map((row, i, arr) => (
                <li
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10.5,
                    color: body,
                    paddingBottom: i < arr.length - 1 ? 5 : 0,
                    borderBottom: i < arr.length - 1 ? `1px dashed ${hairline}` : "none",
                  }}
                >
                  <span>{row.label}</span>
                  <span style={{ fontWeight: 700, color: ink }}>{row.price}</span>
                </li>
              ))}
            </ul>
          </div>
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
            marginTop: 14,
          }}
        >
          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: muted, margin: 0, fontWeight: 700 }}>
              Request access
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 14,
                color: ink,
                margin: "5px 0 0",
                wordBreak: "break-all",
                fontWeight: 500,
              }}
            >
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
