
import React from 'react';
import { Card } from '@/components/ui/card';

interface ArchetypeCardProps {
  title: string;
  description: string;
  results: string[];
}

const ArchetypeCard = ({ title, description, results }: ArchetypeCardProps) => {
  return (
    <Card className="p-6 border border-galavanteer-gray/10 bg-white hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold mb-2 text-galavanteer-purple">{title}</h3>
      <p className="text-galavanteer-gray/80 mb-4">{description}</p>
      <div>
        <p className="font-medium text-galavanteer-gray mb-2">Results:</p>
        <p className="text-galavanteer-gray/70 italic">{results.join(", ")}</p>
      </div>
    </Card>
  );
};

const archetypes = [
  {
    title: "Operators and Executives",
    description: "Modular, proof-driven GPTs to generate applications, cover letters, and professional messaging — in your real voice.",
    results: ["Clarity protocols", "standout materials", "voice-aligned decision engines"]
  },
  {
    title: "Founders and Creatives",
    description: "Storytelling amplifiers for launches, content creation, and brand visibility — crafted to feel more like you, not less.",
    results: ["Sustainable marketing", "joyful launches", "authentic messaging"]
  },
  {
    title: "Coaches and Soul-Led Builders",
    description: "Sacred, nuanced systems for client communication, journaling, reflections, and launch messaging — honoring energy and integrity.",
    results: ["Sacred communication flows", "deeper client alignment", "less burnout"]
  },
  {
    title: "Strategists and Thinkers",
    description: "Insight distillation tools to structure big ideas into publishable, powerful content.",
    results: ["Sharper articulation", "faster content shipping", "streamlined thought leadership"]
  },
  {
    title: "Developers and Tech Teams",
    description: "Function-first GPTs to automate documentation, debugging, and sprint cycles — without losing nuance.",
    results: ["5x faster onboarding", "cleaner specs", "better product-team translation"]
  },
  {
    title: "Jason's Own Operating System",
    description: "Systems tested and lived inside Galavanteer itself — creative planning bots, metaphor generators, and weekly reflection engines.",
    results: ["More clarity", "more creativity", "scaled inner leadership"]
  }
];

const ArchetypesSection = () => {
  return (
    <div className="pb-16">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6">
          {archetypes.map((archetype, index) => (
            <ArchetypeCard 
              key={index}
              title={archetype.title}
              description={archetype.description}
              results={archetype.results}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchetypesSection;
