import React from "react";
import FlyerFrame from "./FlyerFrame";
import FlyerBrandImage from "./FlyerBrandImage";
import type { FlyerData } from "./FlyerRoundtableIntro";

const PILLARS = [
  { title: "A real boardroom, on demand", body: "3–5 executive personas, calibrated to the decision in front of you." },
  { title: "Built around your business", body: "Knows your company, customers, and how you actually decide." },
  { title: "Structured to an answer", body: "Alignment, exploration, your steering, convergence, written deliverable." },
  { title: "Private and yours", body: "Lives in your own ChatGPT. No new tools. No shared logins." },
];

const LEVELS = [
  { n: 1, name: "The Roundtable", body: "Prestige executive personas with broad, web-informed context.", priceKey: null as null | "l2" | "l3" | "l4" },
  { n: 2, name: "Company Context", body: "The room reasons inside your business — what you sell, protect, and how you decide.", priceKey: "l2" as const },
  { n: 3, name: "You, in the Room", body: "A faithful replica of how you actually think, decide, and speak today.", priceKey: "l3" as const },
  { n: 4, name: "Future You", body: "An aspirational counterpart that challenges Present You on the tradeoffs that matter.", priceKey: "l4" as const },
];

const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;
const priceLabel = (v: number | undefined) => (v && v > 0 ? fmt(v) : "Quoted on request");

const SalesSheet: React.FC<{ data: FlyerData; innerRef: React.Ref<HTMLDivElement> }> = ({ data, innerRef }) => {
  const setup = data.setupPrice ?? 6000;
  const lp = data.levelPrices ?? {};
  const accent = data.accentColor;

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
      {/* Faint accent ornament — top-right */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 220,
          height: 220,
          background: `radial-gradient(circle at top right, ${accent}14, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      {/* Faint accent ornament — bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 260,
          height: 180,
          background: `radial-gradient(circle at bottom left, ${accent}10, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", padding: "44px 52px 36px", height: "100%", display: "flex", flexDirection: "column" }}>
        {/* === Masthead === */}
        <div
          style={{
            background: ink,
            color: paper,
            padding: "22px 26px",
            borderRadius: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background: accent,
            }}
          />
          <div style={{ paddingLeft: 14 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 700 }}>
              Presented by {data.partnerName}
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 32,
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
            <div style={{ background: paper, padding: 5, borderRadius: 999 }}>
              <FlyerBrandImage src={data.photoUrl} imageStyle={data.imageStyle} size={62} borderColor={accent} />
            </div>
          )}
        </div>

        {/* === Lead === */}
        <div style={{ marginTop: 22, paddingBottom: 18, borderBottom: `1px solid ${hairline}` }}>
          <p style={labelStyle}>What it is</p>
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 17,
              lineHeight: 1.45,
              color: ink,
              margin: "10px 0 0",
              fontWeight: 400,
              letterSpacing: "-0.005em",
            }}
          >
            {data.tagline}
          </p>
        </div>

        {/* === Two columns: pillars + (margarita / ladder) === */}
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 28, marginTop: 20 }}>
          {/* LEFT: pillars */}
          <div>
            <p style={labelStyle}>What you actually get</p>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
              {PILLARS.map((p) => (
                <div key={p.title} style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 5, background: accent, borderRadius: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: ink, margin: 0, letterSpacing: "0.005em" }}>{p.title}</p>
                    <p style={{ fontSize: 10.5, lineHeight: 1.5, color: body, margin: "3px 0 0" }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Margarita callout */}
            <div
              style={{
                marginTop: 18,
                background: cream,
                border: `1px solid ${accent}33`,
                borderRadius: 4,
                padding: "14px 14px 14px 14px",
                display: "flex",
                gap: 12,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
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
                <p
                  style={{
                    fontSize: 8.5,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: accent,
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  Included in your boardroom
                </p>
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 16,
                    color: ink,
                    margin: "3px 0 0",
                    fontWeight: 600,
                    lineHeight: 1.1,
                  }}
                >
                  Margarita
                </p>
                <p style={{ fontSize: 10, color: muted, margin: "2px 0 0", fontStyle: "italic" }}>
                  Founder of Galavanteer · in-house strategist
                </p>
                <p style={{ fontSize: 10.5, lineHeight: 1.5, color: body, margin: "6px 0 0" }}>
                  A named persona at the table from day one — sharp, candid, and tuned to the way your business actually moves.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: How deep you go */}
          <div>
            <p style={labelStyle}>How deep you go</p>
            <div style={{ marginTop: 12, position: "relative" }}>
              {/* vertical rail */}
              <div
                style={{
                  position: "absolute",
                  left: 17,
                  top: 8,
                  bottom: 8,
                  width: 1,
                  background: `${accent}40`,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {LEVELS.map((lvl) => {
                  const isBase = lvl.priceKey === null;
                  const price = isBase ? "Included" : priceLabel(lp[lvl.priceKey!]);
                  return (
                    <div key={lvl.n} style={{ display: "flex", alignItems: "flex-start", gap: 12, position: "relative" }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 999,
                          background: paper,
                          border: `1.5px solid ${accent}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: 17,
                          fontWeight: 600,
                          color: accent,
                          zIndex: 1,
                          boxShadow: `0 0 0 4px ${paper}`,
                        }}
                      >
                        {lvl.n}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                          <p style={{ fontSize: 11.5, fontWeight: 700, color: ink, margin: 0 }}>{lvl.name}</p>
                          {isBase ? (
                            <span
                              style={{
                                fontSize: 8.5,
                                fontWeight: 700,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color: accent,
                                border: `1px solid ${accent}`,
                                padding: "2px 6px",
                                borderRadius: 999,
                                whiteSpace: "nowrap",
                              }}
                            >
                              Included
                            </span>
                          ) : (
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: ink, whiteSpace: "nowrap" }}>{price}</span>
                          )}
                        </div>
                        <p style={{ fontSize: 10, lineHeight: 1.45, color: muted, margin: "2px 0 0" }}>{lvl.body}</p>
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
            marginTop: 22,
            border: `1px solid ${hairline}`,
            borderRadius: 4,
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "18px 20px", background: ink, color: paper, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: accent }} />
            <p style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 700 }}>
              Investment · Workspace build
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 38,
                fontWeight: 600,
                margin: "8px 0 0",
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              {fmt(setup)}
            </p>
            <p style={{ fontSize: 10, color: "#94A3B8", margin: "8px 0 0", lineHeight: 1.4 }}>
              One-time setup. Level 1 included. Upgrades priced individually.
            </p>
          </div>
          <div style={{ padding: "16px 20px", background: paper }}>
            <p style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: muted, margin: 0, fontWeight: 700 }}>
              Not included — billed separately
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "ChatGPT Teams (paid to OpenAI)", price: "$50 / mo" },
                { label: "Each additional user", price: "$100 / mo" },
                { label: "Optional ongoing maintenance", price: "$200 / mo" },
              ].map((row, i, arr) => (
                <li
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: body,
                    paddingBottom: i < arr.length - 1 ? 6 : 0,
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
            marginTop: 18,
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
            <p style={{ fontSize: 9, color: "#94A3B8", margin: "8px 0 0", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>
              Galavanteer · The Roundtable
            </p>
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
