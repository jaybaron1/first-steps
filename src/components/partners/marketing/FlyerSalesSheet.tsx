import React from "react";
import FlyerFrame from "./FlyerFrame";
import type { FlyerData } from "./FlyerRoundtableIntro";

const STEPS = [
  { n: "01", title: "Call", body: "Confirm fit, goals, and how you actually work today." },
  { n: "02", title: "Blueprint", body: "Map personas, voice, decisions, and the integrations that matter." },
  { n: "03", title: "Implement", body: "Build the workspace and validate it against your real workflow." },
  { n: "04", title: "Track", body: "Confirm adoption and deliver a results snapshot you can act on." },
];

const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

const SalesSheet: React.FC<{ data: FlyerData; innerRef: React.Ref<HTMLDivElement> }> = ({ data, innerRef }) => {
  const setup = data.setupPrice ?? 6000;
  return (
    <FlyerFrame ref={innerRef}>
      <div style={{ padding: "48px 56px", height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 20, borderBottom: `2px solid ${data.accentColor}` }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#64748b", margin: 0, fontWeight: 600 }}>
              Presented by {data.partnerName}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, lineHeight: 1.1, fontWeight: 500, margin: "10px 0 0", color: "#0f172a" }}>
              {data.headline}
            </h1>
          </div>
          {data.photoUrl && (
            <img src={data.photoUrl} crossOrigin="anonymous" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${data.accentColor}` }} />
          )}
        </div>

        {/* What it is */}
        <div style={{ marginTop: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: data.accentColor, margin: 0, fontWeight: 700 }}>
            The Roundtable
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: "#1e293b", margin: "10px 0 0" }}>
            {data.tagline}
          </p>
        </div>

        {/* How it works */}
        <div style={{ marginTop: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: data.accentColor, margin: 0, fontWeight: 700 }}>
            How it works
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 28px", marginTop: 14 }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{ display: "flex", gap: 14 }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: data.accentColor, lineHeight: 1, fontWeight: 600, minWidth: 32 }}>
                  {s.n}
                </span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 }}>{s.title}</p>
                  <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "#475569", margin: "3px 0 0" }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment */}
        <div style={{ marginTop: 28, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "20px 22px", borderRadius: 6 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: data.accentColor, margin: 0, fontWeight: 700 }}>
            Investment
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 12, paddingBottom: 14, borderBottom: "1px solid #e2e8f0" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 }}>Workspace build</p>
              <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>One-time setup, fully built around you.</p>
            </div>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 600, color: "#0f172a", margin: 0 }}>
              {fmt(setup)}
            </p>
          </div>
          <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b", margin: "14px 0 8px", fontWeight: 600 }}>
            Not included — billed separately
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "ChatGPT Teams (paid to OpenAI)", price: "$50 / month" },
              { label: "Each additional user", price: "$100 / month" },
              { label: "Optional ongoing maintenance", price: "$200 / month" },
            ].map((row) => (
              <li key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#334155" }}>
                <span>{row.label}</span>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>{row.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #e2e8f0", paddingTop: 18, marginTop: 20 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#64748b", margin: 0 }}>
              Request access
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, marginTop: 6, color: "#0f172a", wordBreak: "break-all" }}>{data.referralUrl}</p>
            <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 10, letterSpacing: "0.05em" }}>The Roundtable · Galavanteer</p>
          </div>
          {data.qrDataUrl && <img src={data.qrDataUrl} style={{ width: 88, height: 88 }} />}
        </div>
      </div>
    </FlyerFrame>
  );
};

export default SalesSheet;
