import { MessageSquare, Eye, Zap } from 'lucide-react';

const cards = [
  {
    icon: MessageSquare,
    title: 'People ask AI for recommendations',
    description: 'AI engines influence who gets shortlisted. When someone asks ChatGPT, Gemini, or Claude for a recommendation, your business could be the answer — or invisible.',
  },
  {
    icon: Eye,
    title: 'Most websites are not AI-readable',
    description: 'They look fine to humans, but machines cannot confidently summarize or cite them. Without the right structure, AI cannot understand what you offer or who you serve.',
  },
  {
    icon: Zap,
    title: 'Early movers win quietly',
    description: 'The businesses that become easy to understand get recommended more often. This is not about gaming the system — it is about being clear and well-organized.',
  },
];

const WhySection = () => {
  return (
    <section id="why" className="mkt-section mkt-section-light">
      <div className="mkt-container">
        <div className="text-center mb-12">
          <h2 className="mb-4">AI is becoming the front door to discovery.</h2>
          <p className="text-[hsl(220_20%_15%/0.7)] max-w-2xl mx-auto">
            The way people find businesses is changing. Are you set up to be found?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="mkt-card-light p-8 rounded-xl border border-[hsl(35_20%_85%)] hover:border-[hsl(175_70%_45%/0.3)] transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-[hsl(175_70%_45%/0.1)] flex items-center justify-center mb-5">
                <card.icon className="w-6 h-6 text-[hsl(175_70%_45%)]" />
              </div>
              <h3 className="text-xl mb-3 text-[hsl(220_20%_15%)]">{card.title}</h3>
              <p className="text-[hsl(220_20%_15%/0.7)] leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
