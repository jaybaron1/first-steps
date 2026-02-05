import React from 'react';

const TestimonialsSection = () => {
  // Featured testimonial — the most powerful, emotional quote
  const featuredQuote = {
    quote: "My daughters will one day be able to talk to it and hear their dad's heart.",
    subtext: "This is not just for content or coaching. This is legacy technology.",
    name: "Chris Michael Rushing",
    title: "Founder, Rush Wellness",
  };

  const testimonials = [
    {
      quote: "I was genuinely afraid we might lose one of our camps this summer. My brain felt like it was buzzing nonstop. Now I can see the next step instead of trying to hold the entire mountain in my head.",
      highlight: "It makes me feel less alone in it.",
      name: "Danielle Blanchard",
      title: "Board Member, Barton Center",
    },
    {
      quote: "The first response it gave made me stop and laugh, because it was something I would have said word for word. The tone, the pacing, the clarity.",
      highlight: "It was something I would have said.",
      name: "Samantha McGinley",
      title: "Brand Strategist, Polaris Creatives",
    },
    {
      quote: "He didn't just build a tool. He built a system that thinks with me, challenges me, and keeps me honest.",
      highlight: "A system that thinks with me.",
      name: "Jason Ward",
      title: "Founder, Jdub Inspires",
    },
    {
      quote: "I use it when sorting through complex decisions, prioritizing what matters, and thinking about what's next. It helps me slow down and stay aligned with my mission.",
      highlight: "It helps me slow down and clarify.",
      name: "Dr. Julie Siemers, DNP",
      title: "Founder, Lifebeat Solutions",
    },
    {
      quote: "What Jason built is a working model of how I actually think. It captures how I break things down, how I test assumptions, how I reverse engineer outcomes.",
      highlight: "This is about scaling judgment.",
      name: "Private Equity Partner",
      title: "Growth Equity Fund",
    },
    {
      quote: "Now, when I use this, I feel acompañada. It helps me stay in my voice on the days I am tired. It reminds me of my frameworks when I am planning something new.",
      highlight: "I feel acompañada.",
      name: "Luz Karime Cuéllar",
      title: "Executive Coach & Speaker",
    },
  ];

   return (
     <section data-section="testimonials" className="section relative overflow-hidden" style={{ background: '#FDFBF7' }}>
      {/* The Golden Thread continues */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/10" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="lg:pl-12 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-gold to-gold-light" />
            <span className="label">What They're Saying</span>
          </div>
          <h2 className="font-display text-ink">
            Not testimonials.
            <span className="italic text-warm-gray"> Verdicts.</span>
          </h2>
        </div>

        {/* Featured dramatic quote */}
        <div className="lg:pl-12 mb-16">
          <div className="relative max-w-2xl">
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-gold/40" />
            <blockquote
              className="font-display italic text-ink leading-tight pl-6"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
            >
              "{featuredQuote.quote}"
            </blockquote>
            <p className="text-sm text-ink-muted mt-4 pl-6">
              {featuredQuote.subtext}
            </p>
            <div className="flex items-center gap-3 mt-6 pl-6">
              <div className="w-8 h-px bg-gold/40" />
              <span className="text-xs font-medium text-ink">{featuredQuote.name}</span>
              <span className="text-warm-gray">·</span>
              <span className="text-xs text-warm-gray">{featuredQuote.title}</span>
            </div>
          </div>
        </div>

        {/* Testimonials grid — refined hover */}
        <div className="lg:pl-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`bg-white p-5 relative group transition-all duration-500 hover:shadow-soft hover:-translate-y-1 ${
                i === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Gold accent line that expands on hover */}
              <div className="absolute top-0 left-0 w-0 h-px bg-gold transition-all duration-500 group-hover:w-full" />

              <div className="absolute top-4 left-4 text-gold/15 text-2xl font-display transition-colors duration-300 group-hover:text-gold/30">"</div>

              <p className="font-display text-base text-ink italic mb-3 relative z-10 transition-colors duration-300 group-hover:text-gold-dark">
                "{t.highlight}"
              </p>

              <p className="text-xs text-ink-muted leading-relaxed mb-4">
                {t.quote}
              </p>

              <div className="pt-3 border-t border-ink/5">
                <p className="text-xs font-medium text-ink">{t.name}</p>
                <p className="text-[10px] text-warm-gray">{t.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <p className="text-xs text-warm-gray italic">
            Real words from real clients. Shared with permission.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
