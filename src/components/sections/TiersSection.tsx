import React from 'react';
import { ArrowRight } from 'lucide-react';

const TiersSection = () => {
  const tiers = [
    {
      level: "01",
      name: "The Roundtable",
      tagline: "Your thinking partner",
      description: "60+ expert personas debating your real decisions. Just provide your company, your name, and your website.",
      features: [
        "Full Roundtable access",
        "60+ expert archetypes",
        "Executive summaries & action plans",
      ],
      cta: "Start Here",
    },
    {
      level: "02",
      name: "Connected",
      tagline: "Your operations integrated",
      description: "Everything in Level 1, plus secure connectors to your business. Runs in a private Teams space.",
      features: [
        "Email & calendar integration",
        "Notion, docs & knowledge bases",
        "Sales materials & SOPs",
      ],
      featured: true,
      cta: "Most Popular",
    },
    {
      level: "03",
      name: "Replicated",
      tagline: "Your mind, captured",
      description: "Everything in Levels 1 & 2, plus deep voice profiling. A system that thinks and speaks like you.",
      features: [
        "Deep cognitive profiling",
        "Voice & reasoning capture",
        "Team deployment ready",
      ],
      cta: "Premium Access",
    },
  ];

  return (
    <section id="pricing" className="section relative overflow-hidden" style={{ background: '#F9F6F0' }}>
      {/* The Golden Thread continues */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="max-w-xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-gold to-gold-light" />
            <span className="label">The Path</span>
          </div>
          <h2 className="font-display text-ink mb-4">
            Three levels.
            <span className="italic text-warm-gray"> One destination.</span>
          </h2>
          <p className="text-sm text-warm-gray">
            Each level builds on the last. Start where it makes sense.
          </p>
        </div>

        {/* Tiers */}
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-0">
          {tiers.map((tier, i) => (
            <div
              key={tier.level}
              className={`relative ${tier.featured ? 'lg:-my-4 lg:z-10' : ''}`}
            >
              <div
                className={`h-full p-6 transition-all duration-300 ${
                  tier.featured
                    ? 'bg-ink text-cream shadow-elevated'
                    : 'bg-white hover:shadow-soft'
                }`}
                style={!tier.featured ? { border: '1px solid rgba(26, 25, 21, 0.05)' } : {}}
              >
                {tier.featured && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold text-ink text-[10px] font-medium px-3 py-0.5 uppercase tracking-wider">
                    Recommended
                  </div>
                )}

                <div className="flex items-start justify-between mb-6">
                  <span
                    className="font-display text-3xl"
                    style={{ color: tier.featured ? '#D4B896' : '#B8956C' }}
                  >
                    {tier.level}
                  </span>
                  {tier.featured && (
                    <div className="w-1.5 h-1.5 rotate-45 bg-gold" />
                  )}
                </div>

                <div className="mb-4">
                  <h3 className={`font-display text-xl ${
                    tier.featured ? 'text-cream' : 'text-ink'
                  }`}>
                    {tier.name}
                  </h3>
                  <p className={`text-xs mt-1 italic ${
                    tier.featured ? 'text-gold-light' : 'text-gold-dark'
                  }`}>
                    {tier.tagline}
                  </p>
                </div>

                <p
                  className="text-xs leading-relaxed mb-6"
                  style={{ color: tier.featured ? '#C9C3B8' : '#5C554A' }}
                >
                  {tier.description}
                </p>

                <div className={`w-8 h-px mb-5 ${
                  tier.featured ? 'bg-gold/40' : 'bg-gold/20'
                }`} />

                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-xs flex items-start gap-2"
                      style={{ color: tier.featured ? '#C9C3B8' : '#3D3830' }}
                    >
                      <span style={{ color: tier.featured ? '#D4B896' : '#B8956C' }}>·</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://calendly.com/jason-galavanteer/discovery_call"
                  data-track-cta={`Pricing - ${tier.name}`}
                  className={`flex items-center justify-center gap-2 w-full py-3 text-xs font-medium tracking-wide uppercase transition-all group ${
                    tier.featured
                      ? 'bg-cream text-ink hover:bg-gold hover:text-cream'
                      : 'bg-ink text-cream hover:bg-gold'
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-10 text-center">
          <p className="text-xs text-warm-gray">
            Pricing based on scope. Every engagement starts with a Clarity Call.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TiersSection;
