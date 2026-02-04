import React from 'react';
import Button from '@/components/Button';

const MobileStickyCTA: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 p-3">
      <div className="container flex items-center justify-between gap-3">
        <div className="text-sm">
          <div className="font-semibold text-galavanteer-gray">Build My Custom GPT</div>
          <div className="text-galavanteer-gray/70">From $999 • 30-day tuning included</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" href="/pricing" className="px-3 py-2">See Pricing</Button>
          <Button variant="primary" href="https://calendly.com/jason-galavanteer/discovery_call" className="px-3 py-2">Book a Call</Button>
        </div>
      </div>
    </div>
  );
};

export default MobileStickyCTA;
