import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="relative overflow-hidden" style={{ background: '#1A1915' }}>
      {/* The Golden Thread — ends here with a fade */}
      <div className="absolute left-8 lg:left-16 top-0 h-32 w-px bg-gradient-to-b from-gold/10 to-transparent" />

      {/* Subtle gradient */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle at center, #B8956C 0%, transparent 60%)',
        }}
      />

      <div className="container relative z-10 py-16 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Headline — reframed for personal empowerment */}
          <h2 className="font-display mb-4" style={{ color: '#FDFBF7' }}>
            Ready to stop
            <span className="italic" style={{ color: '#D4B896' }}> thinking alone?</span>
          </h2>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-gold/40" />
            <div className="w-1 h-1 rotate-45 border border-gold/50" />
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-gold/40" />
          </div>

          <p className="text-sm leading-relaxed mb-8" style={{ color: '#C9C3B8' }}>
            A 30-minute Clarity Call is where it starts.
            <span style={{ color: '#FDFBF7' }}> No pitch. No pressure.</span>
          </p>

          {/* CTA Button */}
          <a
            href="https://calendly.com/jason-galavanteer/discovery_call"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cream text-ink font-medium text-xs tracking-wide uppercase transition-all group hover:bg-gold hover:text-cream hover:shadow-lg"
          >
            <span>Book Your Clarity Call</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          {/* What happens — improved contrast */}
          <div className="mt-12 pt-10 border-t border-cream/10">
            <div className="grid md:grid-cols-3 gap-6 text-left max-w-lg mx-auto">
              {[
                { step: "01", text: "Tell me what you're working through and where you're stuck" },
                { step: "02", text: "I'll share whether The Roundtable can help" },
                { step: "03", text: "If it's a fit, I'll outline next steps" },
              ].map((item) => (
                <div key={item.step}>
                  <span className="font-display text-lg" style={{ color: '#D4B896' }}>
                    {item.step}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: '#C9C3B8' }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust signal — improved contrast */}
          <p className="mt-10 text-[10px] tracking-wide uppercase" style={{ color: '#7A7368' }}>
            Limited engagements · Response within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
