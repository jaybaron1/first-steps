import React from "react";
import FlyerFrame from "./FlyerFrame";
import { FLYER_THEME as T, FLYER_FONTS as F } from "./flyerTheme";
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
  const personaPrice = data.personaAddOnPrice ?? 500;
  const lp = data.levelPrices ?? {};
  const accent = data.accentColor || T.accent;

  const labelStyle: React.CSSProperties = {
    fontSize: 9,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    fontWeight: 600,
    color: accent,
    margin: 0,
    fontFamily: F.body,
  };

  const sectionLabel = (text: string) => (
    <div style={{ marginBottom: 14 }}>
      <p style={labelStyle}>{text}</p>
      <div style={{ width: 36, height: 1, background: accent, marginTop: 6 }} />
    </div>
  );

  return (
    <FlyerFrame ref={innerRef} size="letter">
      <div style={{ background: T.paper, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Top gold rule */}
        <div style={{ height: 6, background: accent }} />

        <div style={{ padding: "32px 56px 0", flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 9.5, letterSpacing: "0.32em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 600, fontFamily: F.body }}>
              Presented by {data.partnerName}
            </p>
            <p style={{ fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: T.bodyMuted, margin: 0, fontWeight: 500, fontFamily: F.body }}>
              From Galavanteer
            </p>
          </div>

          {/* === Section: What it is === */}
          <div style={{ marginTop: 22 }}>
            {sectionLabel("What it is")}
            <h1
              style={{
                fontFamily: F.display,
                fontSize: 40,
                lineHeight: 1.02,
                fontWeight: 600,
                margin: 0,
                color: T.ink,
                letterSpacing: "-0.01em",
              }}
            >
              The Roundtable.{" "}
              <span style={{ fontStyle: "italic", color: accent, fontWeight: 500 }}>
                A private executive boardroom.
              </span>
            </h1>
            <p
              style={{
                fontFamily: F.display,
                fontStyle: "italic",
                fontSize: 14,
                lineHeight: 1.5,
                color: T.inkSoft,
                margin: "12px 0 0",
                maxWidth: 640,
                fontWeight: 400,
              }}
            >
              {data.tagline}
            </p>
          </div>

          {/* Hairline */}
          <div style={{ height: 1, background: T.hairline, margin: "22px 0" }} />

          {/* === Section: What you actually get === */}
          <div>
            {sectionLabel("What you actually get")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 36px" }}>
              {PILLARS.map((p, i) => (
                <div key={p.title}>
                  <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                    <span
                      style={{
                        fontFamily: F.display,
                        fontSize: 14,
                        fontWeight: 500,
                        color: accent,
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                    >
                      0{i + 1}
                    </span>
                    <p style={{ fontFamily: F.display, fontSize: 14, fontWeight: 600, color: T.ink, margin: 0, lineHeight: 1.2 }}>
                      {p.title}
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: F.body,
                      fontStyle: "italic",
                      fontSize: 11,
                      lineHeight: 1.55,
                      color: T.body,
                      margin: "5px 0 0 24px",
                    }}
                  >
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: T.hairline, margin: "22px 0" }} />

          {/* === Section: How deep you go === */}
          <div>
            {sectionLabel("How deep you go")}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {LEVELS.map((lvl, i) => {
                const isBase = lvl.priceKey === null;
                const price = isBase ? "Included" : priceLabel(lp[lvl.priceKey!]);
                return (
                  <div key={lvl.n}>
                    {i > 0 && <div style={{ height: 1, background: T.hairlineSoft }} />}
                    <div style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 14, alignItems: "center", padding: "10px 0" }}>
                      <span
                        style={{
                          fontFamily: F.display,
                          fontSize: 22,
                          fontWeight: 500,
                          color: accent,
                          lineHeight: 1,
                        }}
                      >
                        0{lvl.n}
                      </span>
                      <div>
                        <p style={{ fontFamily: F.display, fontSize: 15, fontWeight: 600, color: T.ink, margin: 0, lineHeight: 1.1 }}>
                          {lvl.name}
                        </p>
                        <p
                          style={{
                            fontFamily: F.body,
                            fontStyle: "italic",
                            fontSize: 11,
                            lineHeight: 1.5,
                            color: T.body,
                            margin: "3px 0 0",
                          }}
                        >
                          {lvl.body}
                        </p>
                      </div>
                      <span
                        style={{
                          fontFamily: F.display,
                          fontSize: isBase ? 12 : 14,
                          fontWeight: isBase ? 500 : 600,
                          fontStyle: isBase ? "italic" : "normal",
                          color: isBase ? T.bodyMuted : T.ink,
                          whiteSpace: "nowrap",
                          letterSpacing: isBase ? "0.04em" : "0",
                        }}
                      >
                        {price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p
              style={{
                fontFamily: F.body,
                fontStyle: "italic",
                fontSize: 10.5,
                color: T.bodyMuted,
                margin: "10px 0 0",
              }}
            >
              Which level is right for you is a conversation.
            </p>
          </div>

          <div style={{ height: 1, background: T.hairline, margin: "22px 0" }} />

          {/* === Section: Investment === */}
          <div>
            {sectionLabel("Investment")}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 10 }}>
              <div>
                <p style={{ fontFamily: F.display, fontSize: 15, color: T.ink, margin: 0, fontWeight: 600 }}>
                  Workspace build <span style={{ color: T.bodyMuted, fontWeight: 400, fontStyle: "italic", fontSize: 13 }}>· Level 1</span>
                </p>
                <p style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 10.5, color: T.bodyMuted, margin: "3px 0 0" }}>
                  One-time setup. Editable per partner.
                </p>
              </div>
              <p style={{ fontFamily: F.display, fontSize: 32, fontWeight: 600, color: T.ink, margin: 0, letterSpacing: "-0.01em", lineHeight: 1 }}>
                {fmt(setup)}
              </p>
            </div>
            <div style={{ height: 1, background: T.hairlineSoft }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0" }}>
              <p style={{ fontFamily: F.display, fontSize: 13, color: T.ink, margin: 0, fontWeight: 500 }}>
                Each additional persona
              </p>
              <p style={{ fontFamily: F.display, fontSize: 16, fontWeight: 600, color: T.ink, margin: 0 }}>
                {fmt(personaPrice)}{" "}
                <span style={{ fontSize: 11, color: T.bodyMuted, fontStyle: "italic", fontWeight: 400 }}>/ build</span>
              </p>
            </div>

            <p style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: T.bodyMuted, margin: "12px 0 8px", fontFamily: F.body, fontWeight: 600 }}>
              Not included — billed separately
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                { label: "ChatGPT Teams (paid to OpenAI)", price: "$50 / month" },
                { label: "Each additional user", price: "$100 / month" },
                { label: "Optional ongoing maintenance", price: "$200 / month" },
              ].map((row) => (
                <li key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.body, fontFamily: F.body }}>
                  <span style={{ fontStyle: "italic" }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: T.ink, fontFamily: F.display }}>{row.price}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* === Optional: Introducer block === */}
          {data.showIntroducerBlock && (
            <>
              <div style={{ height: 1, background: T.hairline, margin: "22px 0" }} />
              <div>
                <p style={labelStyle}>You get the system. And you get {data.partnerName}.</p>
                <p
                  style={{
                    fontFamily: F.display,
                    fontStyle: "italic",
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    color: T.body,
                    margin: "10px 0 0",
                    maxWidth: 660,
                  }}
                >
                  {data.introducerCustomLine ||
                    `${data.partnerName} introduces you personally. If you want them at the table, they can sit in your Roundtable sessions as a coaching voice — drawing on the experience that brought this to you in the first place.`}
                </p>
              </div>
            </>
          )}

          <div style={{ flex: 1 }} />
        </div>

        {/* Footer band */}
        <div
          style={{
            background: T.paperEdge,
            borderTop: `1px solid ${T.hairline}`,
            padding: "16px 56px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: F.body,
            gap: 24,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: accent, margin: 0, fontWeight: 600 }}>
              Request access
            </p>
            <p
              style={{
                fontFamily: F.display,
                fontSize: 14,
                color: T.ink,
                margin: "5px 0 0",
                wordBreak: "break-all",
                fontWeight: 500,
              }}
            >
              {data.referralUrl}
            </p>
            <p style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: T.bodyMuted, margin: "6px 0 0", fontWeight: 500 }}>
              {data.partnerName} · In partnership with Galavanteer
            </p>
          </div>
          {data.qrDataUrl && (
            <div style={{ background: "#fff", padding: 5, border: `1px solid ${T.hairline}` }}>
              <img src={data.qrDataUrl} style={{ width: 70, height: 70, display: "block" }} />
            </div>
          )}
        </div>
      </div>
    </FlyerFrame>
  );
};

export default SalesSheet;
