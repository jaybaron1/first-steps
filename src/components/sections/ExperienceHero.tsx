import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CalendlyModal from '@/components/CalendlyModal';
import { ArrowDown } from 'lucide-react';

const ExperienceHero = () => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const scrollToExperience = () => {
    const element = document.getElementById('interactive-demos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="py-16 md:py-24 bg-gradient-to-br from-white via-background to-galavanteer-purple-light/20 overflow-hidden">
        <div className="container max-w-4xl text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
              See Our AI Systems in Action
            </h1>
            
            <p className="text-xl md:text-2xl text-galavanteer-gray/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore finished AI systems we've built with clients. See how personalized GPTs and AI Boardroom sound with real voices and content.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={scrollToExperience}
                variant="outline"
                size="lg"
                className="group border-galavanteer-purple/30 hover:bg-galavanteer-purple hover:text-white"
              >
                View Examples
                <ArrowDown className="w-4 h-4 ml-2 group-hover:animate-bounce" />
              </Button>
              
              <Button 
                onClick={() => setIsCalendlyOpen(true)}
                size="lg"
                className="btn-primary"
              >
                Book Discovery Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CalendlyModal 
        isOpen={isCalendlyOpen} 
        onClose={() => setIsCalendlyOpen(false)} 
      />
    </>
  );
};

export default ExperienceHero;