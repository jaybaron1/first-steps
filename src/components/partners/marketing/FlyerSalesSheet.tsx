import React from "react";
import FlyerFrame from "./FlyerFrame";
import FlyerBrandImage from "./FlyerBrandImage";
import type { FlyerData } from "./FlyerRoundtableIntro";

const PILLARS = [
  {
    title: "A real boardroom, on demand",
    body: "Three to five executive personas, dynamically assembled around your decision — each with the depth, dissent, and credibility of a senior operator.",
  },
  {
    title: "Built around your business",
    body: "The room knows your company, your customers, and how you actually make decisions. Context loaded once, applied every session.",
  },
  {
    title: "Structured to reach an answer",
    body: "Every session moves through alignment, exploration, your steering, convergence, and a written deliverable. No meandering. No empty conclusions.",
  },
  {
    title: "Private, controlled, yours",
    body: "Lives inside your own ChatGPT workspace. No new tools, no shared logins, no data leaving your account.",
  },
];

const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

const SalesSheet: React.FC<{ data: FlyerData; innerRef: React.Ref<HTMLDivElement> }> = ({ data, innerRef }) => {
  const setup = data.setupPrice ?? 6000;
  return (
    <FlyerFrame ref={innerRef}>
      <div style={{ padding: "44px 52px", height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 18, borderBottom: `2px solid ${data.accentColor}` }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#64748b", margin: 0, fontWeight: 600 }}>
              Presented by {data.partnerName}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, lineHeight: 1.1, fontWeight: 500, margin: "8px 0 0", color: "#0f172a" }}>
              {data.headline}
            </h1>
          </div>
          {data.photoUrl && (
            <FlyerBrandImage src={data.photoUrl} imageStyle={data.imageStyle} size={64} borderColor={data.accentColor} />
          )}
        </div>

        {/* What it is */}
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: data.accentColor, margin: 0, fontWeight: 700 }}>
            What it is
          </p>
          <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "#1e293b", margin: "10px 0 0" }}>
            {data.tagline}
          </p>
        </div>

        {/* Pillars */}
        <div style={{ marginTop: 22 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: data.accentColor, margin: 0, fontWeight: 700 }}>
            What you actually get
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginTop: 12 }}>
            {PILLARS.map((p, i) => (
              <div key={p.title} style={{ display: "flex", gap: 12 }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: data.accentColor, lineHeight: 1, fontWeight: 600, minWidth: 26 }}>
                  0{i + 1}
                </span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0 }}>{p.title}</p>
                  <p style={{ fontSize: 11.5, lineHeight: 1.5, color: "#475569", margin: "3px 0 0" }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment */}
        <div style={{ marginTop: 22, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "18px 20px", borderRadius: 6 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: data.accentColor, margin: 0, fontWeight: 700 }}>
            Investment
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 10, paddingBottom: 12, borderBottom: "1px solid #e2e8f0" }}>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a", margin: 0 }}>Workspace build</p>
              <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>One-time setup, fully built around you.</p>
            </div>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 600, color: "#0f172a", margin: 0 }}>
              {fmt(setup)}
            </p>
          </div>
          <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b", margin: "12px 0 6px", fontWeight: 600 }}>
            Not included — billed separately
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { label: "ChatGPT Teams (paid to OpenAI)", price: "$50 / month" },
              { label: "Each additional user", price: "$100 / month" },
              { label: "Optional ongoing maintenance", price: "$200 / month" },
            ].map((row) => (
              <li key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#334155" }}>
                <span>{row.label}</span>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>{row.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #e2e8f0", paddingTop: 16, marginTop: 18 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#64748b", margin: 0 }}>
              Request access
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, marginTop: 6, color: "#0f172a", wordBreak: "break-all" }}>{data.referralUrl}</p>
            <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 8, letterSpacing: "0.05em" }}>The Roundtable · Galavanteer</p>
          </div>
          {data.qrDataUrl && <img src={data.qrDataUrl} style={{ width: 84, height: 84 }} />}
        </div>
      </div>
    </FlyerFrame>
  );
};

export default SalesSheet;
