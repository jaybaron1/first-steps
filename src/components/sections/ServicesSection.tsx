
import React from 'react';
import ServiceCard from '@/components/ServiceCard';
import { Brain, MessageSquare, Zap, Users } from 'lucide-react';

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title">Human Operating Systems That Work For You</h2>
          <p className="section-subtitle mx-auto">
            I design systems that feel human and adapt to your unique way of thinking. These aren't generic tools – they're extensions of you and your brand.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard 
            title="Personal Operating Systems" 
            description="Custom systems built in your voice that handle your specific workflows, answer in your style, and think the way you do."
            icon={Brain}
          />
          <ServiceCard 
            title="Brand Voice Systems" 
            description="Co-creation tools that embody your brand voice, values, and knowledge – ready to engage with your audience or support your team."
            icon={MessageSquare}
          />
          <ServiceCard 
            title="Workflow Intelligence" 
            description="Custom systems to handle repetitive tasks, organize information, and bring clarity to your business processes."
            icon={Zap}
          />
          <ServiceCard 
            title="Advisory Boards" 
            description="A virtual board of advisors trained on your business, industry, and challenges – so you never have to lead alone."
            icon={Users}
          />
        </div>
        
        <div className="mt-16">
          <div className="mb-8 max-w-3xl mx-auto p-6 bg-galavanteer-gray-light rounded-lg border border-galavanteer-purple/10">
            <p className="text-lg italic text-galavanteer-gray/90 mb-3 text-center">
              "It empowers our team to scale the human side of leadership — something notoriously hard to replicate."
            </p>
            <p className="text-sm text-galavanteer-gray/80 text-center">— Client, Professional GPT Build</p>
          </div>
          
          <p className="text-lg mb-8 text-galavanteer-gray/90 max-w-2xl mx-auto text-center">
            Every system is built with intention, thoughtfulness, and a focus on practical results – no hype, just tools that actually help.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
