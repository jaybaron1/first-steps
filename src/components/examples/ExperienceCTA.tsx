import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CalendlyModal from '@/components/CalendlyModal';

const ExperienceCTA = () => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <div className="text-center pt-6 border-t border-galavanteer-gray/10">
      <p className="text-galavanteer-gray/80 mb-4">
        Ready to build your personalized AI system?
      </p>
      <Button 
        variant="default" 
        onClick={() => setIsCalendlyOpen(true)}
        className="hover-scale"
      >
        Book Discovery Call
      </Button>
      
      <CalendlyModal 
        isOpen={isCalendlyOpen} 
        onClose={() => setIsCalendlyOpen(false)} 
      />
    </div>
  );
};

export default ExperienceCTA;