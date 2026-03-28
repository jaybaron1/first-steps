import React from "react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "I walk into meetings more prepared and steadier. I can see the next step instead of trying to hold the entire mountain in my head.",
      name: "Danielle Blanchard",
      title: "Founder, Diabetes Motivational Coaching",
    },
    {
      quote: "It surfaces the same questions I would ask sitting in the room. It identifies gaps the same way I do.",
      name: "Private Equity Partner",
      title: "",
    },
    {
      quote: "The clarity, speed, and insight it delivers has saved me hours and raised the quality of my work.",
      name: "Rocky Younger",
      title: "Fortune 100 Account Executive",
    },
  ];

  return (
    <section className="section relative overflow-hidden" style={{ background: "#1A1915" }}>
      {/* The Golden Thread continues */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gold/20" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="lg:pl-12 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-gold to-gold-light" />
            <span className="label text-gold-light">What people notice</span>
          </div>
          <h2 className="font-display" style={{ color: '#FDFBF7' }}>After using the Roundtable</h2>
        </div>

        {/* Testimonials grid — refined hover */}
        <div className="lg:pl-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#252219] p-6 relative group transition-all duration-500 hover:shadow-soft hover:-translate-y-1"
            >
              {/* Gold accent line that expands on hover */}
              <div className="absolute top-0 left-0 w-0 h-px bg-gold transition-all duration-500 group-hover:w-full" />

              <div className="absolute top-4 left-4 text-gold/15 text-2xl font-display transition-colors duration-300 group-hover:text-gold/30">
                "
              </div>

              <blockquote className="font-display text-base italic leading-relaxed mb-6 relative z-10 transition-colors duration-300 group-hover:text-gold" style={{ color: '#FDFBF7' }}>
                "{t.quote}"
              </blockquote>

              <div className="pt-3 border-t border-white/10">
                <p className="text-xs font-medium" style={{ color: '#FDFBF7' }}>{t.name}</p>
                {t.title && <p className="text-[10px] text-warm-gray">{t.title}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <p className="text-xs italic" style={{ color: '#FDFBF7', opacity: 0.7 }}>Real words from real clients. Shared with permission.</p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
