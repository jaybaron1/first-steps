
import React from 'react';
import Button from '@/components/Button';
import { ArrowRight } from 'lucide-react';

const FinalCtaSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-galavanteer-purple-light/40 to-white">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title mb-4">Ready to Build Smarter?</h2>
          <p className="text-lg text-galavanteer-gray/80 mb-8 max-w-xl mx-auto">
            <a href="/examples" className="text-galavanteer-purple hover:underline font-medium">See real client results and case studies</a> or <a href="/about" className="text-galavanteer-purple hover:underline font-medium">learn about our voice-first AI development process</a>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              href="/pricing"
              className="flex items-center justify-center gap-2"
            >
              Build My Custom GPT <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
