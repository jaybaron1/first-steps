import React from 'react';

 const ReframeSection = () => {
   return (
     <section data-section="reframe" className="relative overflow-hidden" style={{ background: '#1A1915' }}>
      {/* Full-bleed dramatic moment */}

      {/* The Golden Thread continues */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

      {/* Atmospheric gradient */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, #B8956C 0%, transparent 70%)',
        }}
      />

      <div className="container relative z-10 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Label */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/40" />
            <span className="label text-gold tracking-[0.3em]">The Possibility</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/40" />
          </div>

          {/* The dramatic question — reframed for personal empowerment */}
          <h2 className="font-display leading-[1.1] mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#FDFBF7' }}>
            What if you never had to
          </h2>
          <p
            className="font-display italic leading-none"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              letterSpacing: '-0.03em',
              color: '#D4B896'
            }}
          >
            think alone again?
          </p>

          {/* Decorative element */}
          <div className="flex items-center justify-center my-12">
            <div className="w-1 h-1 rotate-45 bg-gold/50" />
            <div className="w-20 h-px mx-4 bg-gradient-to-r from-gold/10 via-gold/40 to-gold/10" />
            <div className="w-1 h-1 rotate-45 bg-gold/50" />
          </div>

          {/* Supporting text — better contrast */}
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: '#C9C3B8' }}>
            Not another chatbot that sounds like everyone else.
          </p>
          <p className="text-base font-display italic mt-3" style={{ color: '#FDFBF7' }}>
            A thinking partner that knows you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReframeSection;
