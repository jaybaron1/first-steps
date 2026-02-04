import React, { useState } from 'react';
import EnhancedDemoSection from '@/components/examples/EnhancedDemoSection';
import { useIsMobile } from '@/hooks/use-mobile';

const EnhancedInteractiveExamplesSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section id="interactive-demos" className="py-12 md:py-20 bg-white">
      <div className="container max-w-6xl px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-galavanteer-gray mb-4">
            Real AI Systems in Action
          </h2>
          <p className="text-galavanteer-gray/80 mb-8 max-w-3xl mx-auto text-lg">
            These are actual transcripts from finished systems we've built with clients. Each one is hyper-personalized to match their unique voice and needs.
          </p>
        </div>
        
        <EnhancedDemoSection />
      </div>
    </section>
  );
};

export default EnhancedInteractiveExamplesSection;