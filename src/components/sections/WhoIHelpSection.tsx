import React from 'react';
import { Rocket, Lightbulb, PersonStanding, Cpu, Zap, Building2 } from 'lucide-react';

const WhoIHelpSection = () => {
  return (
    <section id="who-i-help" className="py-20 bg-gradient-to-br from-galavanteer-purple-light/30 to-white">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title text-center">Who We Help</h2>
          <p className="section-subtitle text-center mx-auto max-w-4xl mb-8 md:mb-12">We create tools for people who think differently, lead with purpose, and need technology that works as thoughtfully as they do.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-galavanteer-purple text-white rounded-md mt-1">
                  <Rocket size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-galavanteer-gray">Solo Entrepreneurs & Founders</h3>
                  <p className="text-galavanteer-gray/80">Who need to scale their thinking without scaling their team—tools that let you lead, create, and build with confidence.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-galavanteer-purple text-white rounded-md mt-1">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-galavanteer-gray">Small Teams With Big Ambitions</h3>
                  <p className="text-galavanteer-gray/80">Who need enterprise-level tools without the enterprise price or complexity—systems that grow with you.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-galavanteer-purple text-white rounded-md mt-1">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-galavanteer-gray">Enterprise Teams & Family Offices</h3>
                  <p className="text-galavanteer-gray/80">Who need a boardroom-style AI partner to pre-vet ideas, refine strategies, and build consensus before presenting to broader audiences.</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-galavanteer-purple text-white rounded-md mt-1">
                  <PersonStanding size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-galavanteer-gray">Individuals Seeking Clarity</h3>
                  <p className="text-galavanteer-gray/80">Who need personalized tools to think through complex challenges, organize their ideas, and create pathways forward.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-galavanteer-purple text-white rounded-md mt-1">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-galavanteer-gray">Creators & Thought Leaders</h3>
                  <p className="text-galavanteer-gray/80">Who want AI that enhances their unique voice rather than replacing it—tools that amplify what makes you special.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-galavanteer-purple text-white rounded-md mt-1">
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-galavanteer-gray">Neurodivergent Thinkers</h3>
                  <p className="text-galavanteer-gray/80">Who see the world differently and need tools built for their unique ways of processing—systems designed for your strengths.</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="mt-12 text-lg text-galavanteer-gray text-center">Whether you're established or just starting, if you value thoughtful technology built with intention—We're here to help. <a href="/about" className="text-galavanteer-purple hover:underline font-medium">Learn about our voice-first AI method</a> or <a href="/pricing" className="text-galavanteer-purple hover:underline font-medium">explore custom AI assistant pricing</a>.</p>
        </div>
      </div>
    </section>
  );
};

export default WhoIHelpSection;