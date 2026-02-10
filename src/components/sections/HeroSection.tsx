import React from "react";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FDFBF7 0%, #F9F6F0 100%)" }}
    >
      {/* Grain overlay */}
      <div className="grain" />

      {/* The Golden Thread — starts here, animated */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px overflow-hidden">
        <div
          className="absolute top-0 w-full h-full origin-top"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(184, 149, 108, 0.4) 10%, rgba(184, 149, 108, 0.2) 50%, rgba(184, 149, 108, 0.4) 90%, transparent 100%)",
            animation: "threadReveal 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            transform: "scaleY(0)",
          }}
        />
      </div>

      {/* Add thread animation keyframes */}
      <style>{`
        @keyframes threadReveal {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>

      {/* Decorative corner accent */}
      <div className="absolute top-8 right-8 lg:top-16 lg:right-16">
        <div className="w-16 h-px bg-gradient-to-l from-gold/40 to-transparent" />
        <div className="w-px h-16 bg-gradient-to-b from-gold/40 to-transparent ml-auto" />
      </div>

      <div className="container relative z-10 py-20 lg:py-0">
        <div className="lg:pl-12">
          {/* Label — animated */}
          <div
            className="flex items-center gap-3 mb-8 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            <div
              className="w-8 h-px bg-gold/40 opacity-0 animate-draw-line"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            />
            <span className="label tracking-widest">Strategic Intelligence</span>
          </div>

          {/* The Statement — clean, direct */}
          <div className="mb-10">
            <h1
              className="font-display text-ink leading-tight opacity-0 animate-fade-up"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                animationDelay: "0.3s",
                animationFillMode: "forwards",
                maxWidth: "900px",
                lineHeight: 1.2,
              }}
            >
              You make decisions that carry <span style={{ color: "#B8956C", fontStyle: "italic" }}>consequences.</span>
            </h1>
          </div>

          {/* Subhead — the value prop */}
          <p
            className="leading-relaxed max-w-xl mb-10 opacity-0 animate-fade-up"
            style={{
              animationDelay: "0.5s",
              animationFillMode: "forwards",
              color: "#1A1915",
              fontSize: "1.125rem",
              lineHeight: 1.7,
              fontWeight: 500,
            }}
          >
            <i>The Roundtable</i>
            is your personal advisory board, on-demand.<br></br> 60+ expert personas debate your decisions and show you
            what you're not seeing.
          </p>

          {/* CTAs — animated */}
          <div
            className="flex flex-col sm:flex-row items-start gap-3 mb-10 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
          >
            <a
              href="https://calendly.com/jason-galavanteer/discovery_call"
              className="group inline-flex items-center gap-3 px-6 py-3 bg-ink text-cream text-xs font-medium tracking-wider uppercase transition-all duration-300 hover:bg-gold hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Bring a decision</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-medium tracking-wider uppercase text-ink-muted hover:text-gold transition-colors group"
            >
              <span>See how it works</span>
              <span className="w-0 group-hover:w-4 h-px bg-gold transition-all duration-300" />
            </a>
          </div>

          {/* Pull Quote — offset, elegant, animated */}
          <div
            className="max-w-sm lg:ml-8 relative opacity-0 animate-slide-left"
            style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}
          >
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-gold/30" />
            <blockquote className="font-display italic text-ink leading-relaxed pl-4" style={{ fontSize: "1.0625rem" }}>
              "He built a system that challenges my reasoning and makes me defend my choices."
            </blockquote>
            <div className="mt-3 pl-4 flex items-center gap-2">
              <span className="text-xs font-medium text-ink">Jason Ward</span>
              <span className="text-warm-gray">·</span>
              <span className="text-xs text-warm-gray">Founder, Jdub Inspires</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust Bar */}
      <div className="relative z-10 mt-auto pb-8">
        <div className="container">
          <div className="lg:pl-12">
            <div className="border-t border-ink/5 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <p className="text-xs text-warm-gray">
                  Trusted by Fortune 500 Leaders, Private Equity Partners, and Non-Profit Executives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
