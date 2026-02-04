
import React from 'react';
import { Check } from 'lucide-react';
import Button from './Button';
import { cn } from '@/lib/utils';

interface HorizontalPricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  href: string;
}

const HorizontalPricingCard = ({
  title,
  price,
  description,
  features,
  buttonText,
  href,
}: HorizontalPricingCardProps) => {
  return (
    <div className={cn(
      "flex flex-col md:flex-row items-stretch bg-white border border-galavanteer-purple/20 rounded-xl shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md"
    )}>
      <div className="p-8 flex-1 flex flex-col justify-center">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h3 className="text-xl font-bold text-galavanteer-gray">{title}</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-galavanteer-purple">${price}</span>
            <span className="text-sm text-galavanteer-gray/80 ml-1">/session</span>
          </div>
        </div>
        <p className="text-galavanteer-gray/90 mb-5 text-base">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="bg-galavanteer-purple/10 text-galavanteer-purple rounded-full p-1 flex-shrink-0 mt-0.5">
                <Check size={13} />
              </span>
              <span className="text-galavanteer-gray/80 text-sm">{feature}</span>
            </div>
          ))}
        </div>
        <Button 
          variant="primary" 
          href={href}
          className="w-full md:w-auto mt-2"
        >
          {buttonText}
        </Button>
      </div>
      <div className="hidden md:flex bg-gradient-to-br from-galavanteer-purple to-galavanteer-purple-dark w-32 lg:w-48 items-center justify-center px-4">
        <span className="text-base text-white font-medium text-center">
          Expert<br />Guidance<br />Session
        </span>
      </div>
    </div>
  );
};

export default HorizontalPricingCard;
