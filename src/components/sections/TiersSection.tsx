import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import FreeTrialModal from "@/components/FreeTrialModal";

const TiersSection = () => {
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const tiers = [
    {
      level: "01",
      name: "The Roundtable",
      tagline: "Start with clarity.",
      description: "Pose a question. It gets challenged from every angle that matters.",
      detail: "For when you need to think something through properly.",
      subdetail: "Use this when you're stuck, unclear, or need to make a decision you can stand behind.",
      trial: "3-day free trial",
      cta: "Start Free Trial",
    },
    {
      level: "02",
      name: "Operating Frame",
      tagline: "Your company context.",
      description: "How your organization thinks. What you optimize for. What you never compromise on.",
      detail: "Perspectives that understand your reality.",
      subdetail: "Use this when generic thinking isn't enough and your business context matters.",
    },
    {
      level: "03",
      name: "Present Persona",
      tagline: "Your decision style.",
      description: "Your biases. Your defaults. The tradeoffs you make.",
      detail: "This is where decisions start to feel like your own.",
      subdetail: "For operators making high-stakes decisions regularly.",
      recommended: true,
    },
    {
      level: "04",
      name: "Future Me",
      tagline: "Who you're becoming.",
      description: "Five years from now. The patterns you're growing into.",
      detail: "Accountability to your future self.",
      subdetail: "Use this when you're making decisions that shape where you're going.",
    },
  ];

  return (
    <section id="pricing" className="section relative overflow-hidden" style={{ background: "#F9F6F0" }}>
      {/* The Golden Thread continues */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-gold to-gold-light" />
            <span className="label">The Levels</span>
          </div>
          <h2 className="font-display text-ink mb-4" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
            Start simple.{" "}
            <span className="italic" style={{ color: "#B8956C" }}>
              Go deeper when ready.
            </span>
          </h2>
          <p className="text-sm" style={{ color: "#5C554A", lineHeight: 1.7 }}>
            As your decisions get more complex, your thinking needs to go deeper.
          </p>
        </div>

        {/* Tiers */}
        <div className="grid lg:grid-cols-4 gap-6">
          {tiers.map((tier, i) => (
            <div key={tier.level} className="relative flex">
              <div
                className="flex flex-col w-full p-6 bg-white transition-all duration-300 hover:shadow-soft hover:-translate-y-1"
                style={{ border: "1px solid rgba(26, 25, 21, 0.05)" }}
              >
                {/* Trial badge */}
                {tier.trial && (
                  <div className="absolute -top-3 left-6 bg-gold text-cream text-[10px] font-medium px-3 py-1 uppercase tracking-wider">
                    {tier.trial}
                  </div>
                )}

                {/* Recommended badge */}
                {tier.recommended && (
                  <div className="absolute -top-3 left-6 bg-ink text-cream text-[10px] font-medium px-3 py-1 uppercase tracking-wider">
                    Recommended
                  </div>
                )}

                {/* Level number */}
                <div className="mb-6">
                  <span
                    className="font-display"
                    style={{
                      fontSize: "3rem",
                      color: "#B8956C",
                      fontWeight: 300,
                      lineHeight: 1,
                    }}
                  >
                    {tier.level}
                  </span>
                </div>

                {/* Name and tagline */}
                <div className="mb-4">
                  <h3 className="font-display text-lg text-ink font-semibold mb-1">{tier.name}</h3>
                  <p className="text-xs uppercase tracking-wide" style={{ color: "#B8956C", letterSpacing: "0.05em" }}>
                    {tier.tagline}
                  </p>
                </div>

                <div className="w-8 h-px bg-gold/20 mb-4" />

                {/* Description - fixed height for alignment */}
                <div style={{ minHeight: "80px" }}>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "#3D3830", lineHeight: 1.7 }}>
                    {tier.description}
                  </p>
                </div>

                {/* Detail/highlight */}
                <div className="mb-3">
                  {tier.detail && (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#1A1915", lineHeight: 1.7, fontWeight: 500 }}
                    >
                      {tier.detail}
                    </p>
                  )}
                </div>

                {/* Subdetail */}
                {tier.subdetail && (
                  <p className="text-xs leading-relaxed" style={{ color: "#5C554A", lineHeight: 1.6 }}>
                    {tier.subdetail}
                  </p>
                )}


                {/* Spacer to push CTA to bottom */}
                <div className="flex-grow" />

                {/* CTA */}
                <div className="mt-6">
                  {tier.cta ? (
                    <button
                      onClick={() => setTrialModalOpen(true)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium tracking-wide uppercase transition-all group bg-ink text-cream hover:bg-gold"
                    >
                      {tier.cta}
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ) : (
                    <a
                      href="https://calendly.com/jason-galavanteer/discovery_call"
                      className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium tracking-wide uppercase transition-all group bg-ink text-cream hover:bg-gold"
                    >
                      See If This Fits
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-10 text-center space-y-2">
          <p className="text-xs text-warm-gray">
            Work connectors are enabled once you upgrade to a paid plan. All paid tiers require a ChatGPT Teams plan
            with one seat reserved for data security.
          </p>
          <p className="text-xs text-warm-gray">Pricing based on scope. Every engagement starts with a Clarity Call.</p>
        </div>
      </div>

      <FreeTrialModal open={trialModalOpen} onOpenChange={setTrialModalOpen} />
    </section>
  );
};

export default TiersSection;
