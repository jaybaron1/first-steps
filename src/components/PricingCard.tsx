
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Rocket } from 'lucide-react';
import Button from './Button';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  href: string;
  highlighted?: boolean;
  supportTiers?: boolean;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  buttonText,
  href,
  highlighted = false,
  supportTiers = false
}: PricingCardProps) => {
  // Determine if price contains "+" or if description contains pricing period info
  const hasPlusSuffix = price.includes("+");
  const isPricingPeriod = description.includes('/month') || description.includes('/one-time');
  
  return (
    <div className={cn(
      "rounded-lg p-6 transition-all hover:shadow-lg flex flex-col h-full",
      highlighted 
        ? "border-2 border-galavanteer-purple shadow-md relative" 
        : "border border-gray-200"
    )}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-galavanteer-purple text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 text-galavanteer-gray">{title}</h3>
        <div className="flex items-baseline mb-2">
          {price ? (
            <>
              <span className="text-3xl font-bold text-galavanteer-gray">
                ${hasPlusSuffix ? price.replace("+", "") : price}
                {hasPlusSuffix && <span className="text-xl">+</span>}
              </span>
              {isPricingPeriod && (
                <span className="text-sm text-galavanteer-gray/60 ml-1">{description}</span>
              )}
            </>
          ) : (
            <span className="text-xl text-galavanteer-gray font-medium">{description}</span>
          )}
        </div>
      </div>
      
      {supportTiers ? (
        <div className="space-y-6 mb-6">
          {/* Basic Support Tier */}
          <div className="border-b border-galavanteer-gray/10 pb-6">
            <div className="mb-3">
              <div>
                <h4 className="font-bold text-galavanteer-gray">Basic Support – $50/month</h4>
                <p className="text-sm text-galavanteer-gray/70 italic">For individuals using a personal GPT</p>
              </div>
            </div>
            
            <ul className="space-y-2 mt-4">
              {features.slice(0, 6).map((feature, index) => (
                <li key={`basic-${index}`} className="flex items-start gap-2">
                  <span className="text-green-600 flex-shrink-0">✅</span>
                  <span className="text-galavanteer-gray/80 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-4">
              <p className="italic text-sm text-galavanteer-purple-dark/80">
                "Stay current, stay supported – without lifting a finger."
              </p>
            </div>
          </div>
          
          {/* Pro Support Tier */}
          <div>
            <div className="mb-3">
              <div>
                <h4 className="font-bold text-galavanteer-gray">Pro Support – $150/month</h4>
                <p className="text-sm text-galavanteer-gray/70 italic">For businesses relying on strategic AI</p>
              </div>
            </div>
            
            <ul className="space-y-2 mt-4">
              <li className="flex items-start gap-2">
                <span className="text-galavanteer-purple flex-shrink-0">✓</span>
                <span className="text-galavanteer-gray/80 text-sm font-medium">Everything in Basic, plus:</span>
              </li>
              {features.slice(6).map((feature, index) => (
                <li key={`pro-${index}`} className="flex items-start gap-2">
                  <span className="text-galavanteer-purple flex-shrink-0">✦</span>
                  <span className="text-galavanteer-gray/80 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-4">
              <p className="italic text-sm text-galavanteer-purple-dark/80">
                "For when your GPT isn't just a tool – it's part of the team."
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 mb-8 flex-grow">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className={cn(
                "p-1 rounded-full mt-0.5",
                highlighted ? "bg-galavanteer-purple text-white" : "bg-galavanteer-purple-light text-galavanteer-purple"
              )}>
                <Check size={14} />
              </div>
              <span className="text-galavanteer-gray/80">{feature}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-auto">
        <Button 
          variant={highlighted ? "primary" : "secondary"} 
          href={href}
          className="w-full justify-center"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
