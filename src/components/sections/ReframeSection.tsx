import React from "react";

const ReframeSection = () => {
  return (
    <section className="relative overflow-hidden" style={{ background: "#1A1915" }}>
      {/* Full-bleed dramatic moment */}

      {/* The Golden Thread continues */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

      {/* Atmospheric gradient */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, #B8956C 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Label */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/40" />
            <span className="label text-gold tracking-[0.3em]">The Standard</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/40" />
          </div>

          {/* The statement */}
          <h2
            className="font-display leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#FDFBF7", lineHeight: 1.3 }}
          >
            Decisions should not move forward until they have been examined from more than one angle.
          </h2>
        </div>
      </div>
    </section>
  );
};

export default ReframeSection;
