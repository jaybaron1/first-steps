
import React from 'react';
import { Search, Wrench, RefreshCw } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Understand your voice, needs, and goals. (1–2 hours)'
  },
  {
    icon: Wrench,
    title: 'Build',
    description: 'Craft and train your custom operating systems. (3–10 days)'
  },
  {
    icon: RefreshCw,
    title: 'Refine',
    description: 'Tune your system post-launch for real-world use and clarity. (30 days included)'
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title mb-10 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-galavanteer-purple-light rounded-full flex items-center justify-center mb-4">
                    <Icon size={24} className="text-galavanteer-purple" />
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-galavanteer-gray">{step.title}</h3>
                  <p className="text-galavanteer-gray/80">{step.description}</p>
                </div>
              );
            })}
          </div>
          
          <p className="mt-10 text-center text-galavanteer-gray">
            Want to explore your options before committing? <a href="/clarity" className="text-galavanteer-purple hover:underline font-medium">Book a 1:1 clarity session</a> or <a href="/examples" className="text-galavanteer-purple hover:underline font-medium">see how other clients have benefited from custom AI assistants</a>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
