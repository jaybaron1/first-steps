import React from 'react';
import { Brain, Users, Clock } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
const OffersSection = () => {
  return <section id="what-we-build" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title">Your AI in Action.</h2>
        </div>
        
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-animate>
          <ServiceCard title="Your Personal AI Writer" description="An AI assistant that writes emails, content, and responses exactly like you would – saving you hours every week." icon={Brain} className="relative">
            <ul className="mt-4 list-disc ml-5 text-sm text-galavanteer-gray/90 space-y-1">
              <li>Writes in your voice</li>
              <li>Handles routine communications</li>
              <li>Never sounds robotic or generic</li>
            </ul>
          </ServiceCard>
          
          <ServiceCard title="Strategic Planning Partner" description="A thinking partner that knows your decision-making style and helps you plan, strategize, and solve problems faster." icon={Users} className="relative">
            <ul className="mt-4 list-disc ml-5 text-sm text-galavanteer-gray/90 space-y-1">
              <li>Helps you make better decisions</li>
              <li>Plans projects based on your style</li>
              <li>Catches things you might miss</li>
            </ul>
          </ServiceCard>
          
          <ServiceCard title="Always Getting Better" description="Monthly check-ins to refine your AI, plus ongoing support to keep everything running smoothly." icon={Clock} className="relative">
            <ul className="mt-4 list-disc ml-5 text-sm text-galavanteer-gray/90 space-y-1">
              <li>Monthly improvements</li>
              <li>Quick support when needed</li>
              <li>Your AI gets smarter over time</li>
            </ul>
          </ServiceCard>
        </div>
      </div>
    </section>;
};
export default OffersSection;