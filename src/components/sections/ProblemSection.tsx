import React from "react";

const ProblemSection = () => {
  return (
    <section className="section relative overflow-hidden" style={{ background: "#1A1915" }}>
      {/* The Golden Thread continues */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

      <div className="container relative z-10">
        {/* Section intro */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-gold to-gold-light" />
            <span className="label text-gold">The Problem</span>
          </div>
          <h2
            className="font-display max-w-2xl"
            style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", lineHeight: 1.2, color: "#FDFBF7" }}
          >
            Decisions rarely get examined{" "}
            <span className="italic" style={{ color: "#D4B896" }}>
              properly.
            </span>
          </h2>
        </div>

        {/* Three-column cards with flow */}
        <div className="flex flex-col lg:flex-row gap-8 items-center max-w-5xl">
          {/* Card 1 */}
          <div className="bg-white p-8 relative group transition-all duration-500 hover:shadow-lg hover:-translate-y-1 flex-1 w-full">
            <div className="absolute top-0 left-0 w-10 h-px bg-gold/30 transition-all duration-500 group-hover:w-16 group-hover:bg-gold/60" />
            <p className="font-display text-lg text-ink leading-snug mb-3">You think alone.</p>
            <p className="text-sm" style={{ color: "#5C554A" }}>
              The decision sits with you. No one else carries the weight.
            </p>
          </div>

          {/* Arrow 1 */}
          <div className="hidden lg:flex flex-shrink-0 -mx-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M19 12L13 6M19 12L13 18"
                stroke="#B8956C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 relative group transition-all duration-500 hover:shadow-lg hover:-translate-y-1 flex-1 w-full">
            <div className="absolute top-0 left-0 w-10 h-px bg-gold/30 transition-all duration-500 group-hover:w-16 group-hover:bg-gold/60" />
            <p className="font-display text-lg text-ink leading-snug mb-3">Input is fragmented.</p>
            <p className="text-sm" style={{ color: "#5C554A" }}>
              Scattered opinions. No full context. No accountability.
            </p>
          </div>

          {/* Arrow 2 */}
          <div className="hidden lg:flex flex-shrink-0 -mx-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M19 12L13 6M19 12L13 18"
                stroke="#B8956C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 relative group transition-all duration-500 hover:shadow-lg hover:-translate-y-1 border-2 border-gold/20 flex-1 w-full">
            <div className="absolute top-0 left-0 w-16 h-px bg-gold transition-all duration-500 group-hover:w-24" />
            <p className="font-display text-lg text-ink leading-snug mb-3">
              The decision moves forward under-tested.
            </p>
            <p className="text-sm" style={{ color: "#5C554A" }}>
              And reasonable choices become avoidable problems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
