import React from "react";

const RevealSection = () => {
  return (
    <section id="how-it-works" className="relative overflow-hidden" style={{ background: "#FDFBF7" }}>
      {/* The Golden Thread continues */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

      <div className="container relative z-10 py-20 lg:py-28">
        {/* Centered layout */}
        <div className="max-w-4xl ml-12 lg:ml-24 text-left">
          {/* Introducing label */}
          <div className="flex items-center justify-start gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-ink/20" />
            <span className="text-[10px] font-medium tracking-[0.4em] uppercase" style={{ color: "#1A1915" }}>
              Introducing
            </span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-ink/20" />
          </div>

          {/* THE NAME — gold with depth */}
          <h2 className="mb-2">
            <span
              className="font-display text-ink"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", letterSpacing: "0.02em" }}
            >
              The
            </span>
          </h2>
          <h2 className="mb-6 relative">
            <span
              className="font-display italic relative"
              style={{
                fontSize: "clamp(3.5rem, 12vw, 7rem)",
                color: "#996B3D",
                letterSpacing: "-0.03em",
                lineHeight: 0.85,
                textShadow: "2px 2px 0px rgba(26, 25, 21, 0.08)",
              }}
            >
              Roundtable
            </span>
          </h2>

          {/* Thin ink line as anchor */}
          <div className="flex justify-center mb-10">
            <div className="w-32 h-px bg-ink/20" />
          </div>

          {/* Two-column layout: Text left, Graphic right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Left: Text content */}
            <div className="text-left relative">
              {/* Large 60+ in background */}
              <div
                className="absolute -left-4 lg:-left-12 -top-8 font-display pointer-events-none select-none"
                style={{
                  fontSize: "clamp(10rem, 20vw, 16rem)",
                  color: "#B8956C",
                  opacity: 0.15,
                  fontWeight: 300,
                  lineHeight: 0.8,
                  zIndex: 0,
                }}
              >
                60+
              </div>

              {/* Foreground text */}
              <div className="relative z-10 pt-12">
                <h3
                  className="font-display mb-4"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#1A1915", lineHeight: 1.3 }}
                >
                  One decision.
                  <br />
                  <span style={{ color: "#B8956C", fontStyle: "italic" }}>Multiple perspectives.</span>
                </h3>
                <p style={{ fontSize: "1rem", color: "#5C554A", lineHeight: 1.7 }}>
                  You stay at the center.<br />The thinking doesn't.
                </p>
              </div>
            </div>

            {/* Right: Original sophisticated graphic with stronger lines */}
            <div className="relative">
              <svg
                viewBox="0 0 800 500"
                className="w-full h-auto"
                style={{ filter: "drop-shadow(0 4px 20px rgba(26, 25, 21, 0.08))" }}
              >
                {/* Background subtle grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A1915" strokeWidth="0.5" opacity="0.03" />
                  </pattern>

                  {/* Glow effects */}
                  <radialGradient id="centerGlow" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#B8956C" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#B8956C" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="nodeGlow" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#996B3D" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#996B3D" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <rect width="800" height="500" fill="url(#grid)" />

                {/* Center node glow */}
                <circle cx="400" cy="250" r="80" fill="url(#centerGlow)" />

                {/* Connection lines - MORE VISIBLE NOW */}
                {[
                  { x: 280, y: 120, label: "CFO" },
                  { x: 520, y: 120, label: "CMO" },
                  { x: 640, y: 250, label: "Legal" },
                  { x: 520, y: 380, label: "Strategy" },
                  { x: 280, y: 380, label: "Operations" },
                  { x: 160, y: 250, label: "Product" },
                  { x: 350, y: 80, label: "Finance" },
                  { x: 450, y: 80, label: "Growth" },
                ].map((node, i) => (
                  <g key={i}>
                    {/* Connection line - STRONGER */}
                    <line
                      x1="400"
                      y1="250"
                      x2={node.x}
                      y2={node.y}
                      stroke="#996B3D"
                      strokeWidth="1.5"
                      opacity="0.4"
                      strokeDasharray="4 4"
                    />

                    {/* Node glow */}
                    <circle cx={node.x} cy={node.y} r="30" fill="url(#nodeGlow)" />

                    {/* Node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="16"
                      fill="none"
                      stroke="#996B3D"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="12"
                      fill="#FDFBF7"
                      stroke="#B8956C"
                      strokeWidth="1"
                      opacity="0.9"
                    />

                    {/* Label */}
                    <text
                      x={node.x}
                      y={node.y + 35}
                      textAnchor="middle"
                      fontSize="13"
                      fontFamily="DM Sans, sans-serif"
                      fontWeight="600"
                      fill="#1A1915"
                      letterSpacing="0.5"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}

                {/* Center node - YOU */}
                <circle cx="400" cy="250" r="40" fill="none" stroke="#996B3D" strokeWidth="2" opacity="0.4" />
                <circle cx="400" cy="250" r="32" fill="#FDFBF7" stroke="#B8956C" strokeWidth="2" />
                <circle cx="400" cy="250" r="24" fill="#996B3D" opacity="0.1" />

                <text
                  x="400"
                  y="258"
                  textAnchor="middle"
                  fontSize="18"
                  fontFamily="Playfair Display, serif"
                  fontWeight="600"
                  fill="#1A1915"
                  letterSpacing="2"
                >
                  YOU
                </text>
              </svg>

              {/* Caption */}
              <p className="text-center text-xs mt-4 italic" style={{ color: "#5C554A" }}>
                You stay at the center. The thinking doesn't.
              </p>
            </div>
          </div>

          {/* How the room works */}
          <div className="max-w-3xl mb-12">
            <p
              className="font-display mb-8 text-left"
              style={{
                fontSize: "1.25rem",
                color: "#1A1915",
                fontWeight: 500,
              }}
            >
              How the room works
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-10">
              {[
                "Perspectives challenge your thinking",
                "Assumptions surface early",
                "Tradeoffs become clear",
              ].map((item, i) => (
                <div key={i} className="text-left">
                  <div className="w-2 h-2 rounded-full mb-3" style={{ background: "#B8956C" }} />
                  <p style={{ fontSize: "0.9375rem", color: "#3D3830", lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>

            <div className="w-12 h-px bg-gold/20 mb-6" />

            <div className="space-y-2" style={{ fontSize: "1rem", color: "#5C554A" }}>
              <p>The goal is not consensus.</p>
              <p className="font-display" style={{ color: "#1A1915", fontWeight: 500 }}>
                The goal is a decision you understand fully.
              </p>
            </div>
          </div>

          {/* The process */}
          <div className="pt-10 border-t border-ink/10">
            <p
              className="font-display text-left mb-8"
              style={{
                fontSize: "1.125rem",
                color: "#1A1915",
                fontWeight: 500,
              }}
            >
              The process
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
              {[
                { num: "01", label: "You bring a challenge" },
                { num: "02", label: "Perspectives respond" },
                { num: "03", label: "The challenge is examined" },
                { num: "04", label: "You move forward deliberately" },
              ].map((step) => (
                <div key={step.num} className="text-left">
                  <span className="font-display text-gold text-sm">{step.num}</span>
                  <p className="text-xs mt-1 text-ink-muted">{step.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevealSection;
