import React from 'react';

 const ProblemSection = () => {
   return (
     <section data-section="the-problem" className="section relative overflow-hidden" style={{ background: '#F9F6F0' }}>
      {/* The Golden Thread continues */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

      <div className="container relative z-10">
        {/* Section intro */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-gold to-gold-light" />
            <span className="label">The Reality</span>
          </div>
          <h2 className="font-display text-ink max-w-xl">
            You're carrying it <span className="italic">alone</span>.
          </h2>
        </div>

        {/* Problems — reframed around personal struggle */}
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white p-6 relative group transition-all duration-500 hover:shadow-soft hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-10 h-px bg-gold/30 transition-all duration-500 group-hover:w-16 group-hover:bg-gold/60" />
            <p style={{ color: '#5C554A' }} className="text-sm mb-3">
              The decisions that keep you up at night. The questions with no clear answer.
            </p>
            <p className="font-display text-lg text-ink leading-snug">
              The weight that comes with being <span className="italic">the one</span>.
            </p>
          </div>

          <div className="bg-white p-6 relative group transition-all duration-500 hover:shadow-soft hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-10 h-px bg-gold/30 transition-all duration-500 group-hover:w-16 group-hover:bg-gold/60" />
            <p style={{ color: '#5C554A' }} className="text-sm mb-3">
              You've got advisors. Mentors. A network.
            </p>
            <p className="font-display text-lg text-ink leading-snug italic">
              But at 2am, it's just you.
            </p>
          </div>

          <div className="bg-ink p-6 relative group transition-all duration-500 hover:shadow-soft hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-10 h-px bg-gold/50 transition-all duration-500 group-hover:w-16 group-hover:bg-gold" />
            <p className="text-sm mb-3" style={{ color: '#C9C3B8' }}>
              No one knows your situation like you do.
            </p>
            <p className="font-display text-lg leading-snug" style={{ color: '#FDFBF7' }}>
              So you carry it. <span className="italic" style={{ color: '#D4B896' }}>Alone.</span>
            </p>
          </div>
        </div>

        {/* Bottom insight */}
        <div className="mt-12 max-w-xl mx-auto text-center">
          <p className="text-sm leading-relaxed" style={{ color: '#5C554A' }}>
            No one can think through it with <span className="font-medium" style={{ color: '#1A1915' }}>your context</span>,
            {' '}<span className="font-medium" style={{ color: '#1A1915' }}>your values</span>,
            {' '}<span className="font-medium" style={{ color: '#1A1915' }}>your constraints</span>.
            <span className="block mt-2 italic" style={{ color: '#7A7368' }}>
              Until now.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
