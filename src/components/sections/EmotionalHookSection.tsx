
import React from 'react';
import frustratedCoffeeImage from '@/assets/frustrated-coffee-yelling.png';

const EmotionalHookSection = () => {
  return (
    <section className="py-12 bg-galavanteer-gray-light">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8">
            <div className="flex-shrink-0">
              <img 
                src={frustratedCoffeeImage} 
                alt="Frustrated professional yelling 'I've already explained this!' while holding coffee" 
                className="w-48 h-48 lg:w-56 lg:h-56 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1 text-center lg:text-left flex items-center">
              <p className="text-xl md:text-2xl font-medium italic text-galavanteer-gray">
                If you've ever yelled "<span className="font-bold">I already explained this!</span>" into your coffee, congrats - you're ready for a GPT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalHookSection;
