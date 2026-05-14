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

  return (
    <FlyerFrame ref={innerRef}>
      <div style={{ padding: "38px 48px", height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottom: `2px solid ${accent}` }}>
          <div>
            <p style={{ fontSize: 9.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "#64748b", margin: 0, fontWeight: 600 }}>
              Presented by {data.partnerName}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, lineHeight: 1.1, fontWeight: 500, margin: "6px 0 0", color: "#0f172a" }}>
              {data.headline}
            </h1>
          </div>
          {data.photoUrl && (
            <FlyerBrandImage src={data.photoUrl} imageStyle={data.imageStyle} size={56} borderColor={accent} />
          )}
        </div>

        {/* What it is */}
        <div style={{ marginTop: 18 }}>
          <p style={{ fontSize: 9.5, letterSpacing: "0.22em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 700 }}>
            What it is
          </p>
          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "#1e293b", margin: "8px 0 0" }}>
            {data.tagline}
          </p>
        </div>

        {/* Pillars (compact) */}
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 9.5, letterSpacing: "0.22em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 700 }}>
            What you actually get
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px", marginTop: 10 }}>
            {PILLARS.map((p) => (
              <div key={p.title}>
                <p style={{ fontSize: 11.5, fontWeight: 600, color: "#0f172a", margin: 0 }}>{p.title}</p>
                <p style={{ fontSize: 11, lineHeight: 1.45, color: "#475569", margin: "2px 0 0" }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade ladder — How deep you go */}
        <div style={{ marginTop: 18 }}>
          <p style={{ fontSize: 9.5, letterSpacing: "0.22em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 700 }}>
            How deep you go
          </p>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {LEVELS.map((lvl, i) => {
              const isBase = lvl.priceKey === null;
              const price = isBase ? "Included" : priceLabel(lp[lvl.priceKey!]);
              // ascending depth: tier height grows slightly, accent intensity grows
              const indent = i * 14;
              const intensity = 0.06 + i * 0.06;
              return (
                <div
                  key={lvl.n}
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    marginLeft: indent,
                    background: `rgba(15,23,42,${intensity})`,
                    borderLeft: `3px solid ${accent}`,
                    borderRadius: 3,
                  }}
                >
                  <div style={{ width: 38, display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid rgba(15,23,42,0.08)" }}>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: accent, fontWeight: 600, lineHeight: 1 }}>
                      {lvl.n}
                    </span>
                  </div>
                  <div style={{ flex: 1, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "0.01em" }}>
                        {lvl.name}
                      </p>
                      <p style={{ fontSize: 10.5, lineHeight: 1.4, color: "#475569", margin: "2px 0 0" }}>
                        {lvl.body}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: isBase ? "#0f172a" : accent,
                        whiteSpace: "nowrap",
                        letterSpacing: "0.04em",
                        textTransform: isBase ? "uppercase" : "none",
                      }}
                    >
                      {price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Investment */}
        <div style={{ marginTop: 18, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "14px 16px", borderRadius: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 8, borderBottom: "1px solid #e2e8f0" }}>
            <div>
              <p style={{ fontSize: 9.5, letterSpacing: "0.22em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 700 }}>
                Investment · Workspace build
              </p>
              <p style={{ fontSize: 10.5, color: "#64748b", margin: "3px 0 0" }}>One-time setup. Level 1 included. Upgrades priced above.</p>
            </div>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 600, color: "#0f172a", margin: 0 }}>
              {fmt(setup)}
            </p>
          </div>
          <p style={{ fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b", margin: "10px 0 5px", fontWeight: 600 }}>
            Not included — billed separately
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { label: "ChatGPT Teams (paid to OpenAI)", price: "$50 / month" },
              { label: "Each additional user", price: "$100 / month" },
              { label: "Optional ongoing maintenance", price: "$200 / month" },
            ].map((row) => (
              <li key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#334155" }}>
                <span>{row.label}</span>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>{row.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #e2e8f0", paddingTop: 12, marginTop: 14 }}>
          <div>
            <p style={{ fontSize: 9.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "#64748b", margin: 0 }}>
              Request access
            </p>
            <p style={{ fontSize: 12, fontWeight: 600, marginTop: 5, color: "#0f172a", wordBreak: "break-all" }}>{data.referralUrl}</p>
            <p style={{ fontSize: 9.5, color: "#94a3b8", marginTop: 6, letterSpacing: "0.05em" }}>The Roundtable · Galavanteer</p>
          </div>
          {data.qrDataUrl && <img src={data.qrDataUrl} style={{ width: 76, height: 76 }} />}
        </div>
      </div>
    </FlyerFrame>
  );
};

export default SalesSheet;
