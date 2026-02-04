
import React from 'react';
import PricingCard from '@/components/PricingCard';
import { ArrowRight, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const PricingSection = () => {
  // FAQ items
  const faqItems = [
    {
      question: "What's included in the Custom GPT Build?",
      answer: "Your Custom GPT Build includes one personalized GPT built to your specifications, voice matching to ensure it sounds like you, 30 days of refinement support, a private shareable link, usage guidance documentation, and a one-hour training session to get you started."
    },
    {
      question: "How does the AI Advisory Team differ from a Custom GPT?",
      answer: "The AI Advisory Team provides a more comprehensive solution with multiple AI personas that can interact dynamically, expertise on specific topics, knowledge base integration, brand alignment, structured executive takeaways, action plans, risk analysis, and 60 days of ongoing support."
    },
    {
      question: "Can I upgrade from a Custom GPT to an AI Advisory Team later?",
      answer: "Yes! Many clients start with a Custom GPT and upgrade to an AI Advisory Team as their needs grow. The transition is seamless, and we'll apply your existing knowledge and preferences to the expanded system."
    },
    {
      question: "Do I need technical knowledge to use these systems?",
      answer: "Not at all. Our systems are delivered through private links that require no technical setup. You'll receive comprehensive guidance on how to use your system effectively, regardless of your technical background."
    }
  ];

  return (
    <section className="py-20">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {/* Custom GPT Card */}
          <div className="animate-fade-in transform transition-all duration-300 hover:translate-y-[-4px]" style={{ animationDelay: '0.2s' }}>
            <PricingCard 
              title="Custom GPT Build" 
              price="999+" 
              description="Your personal AI assistant that thinks and communicates like you" 
              features={[
                "One custom GPT built just for you", 
                "Your personal voice matching", 
                "30 days of refinement support", 
                "Private, shareable link", 
                "Usage guidance document", 
                "1-hour training session"
              ]} 
              buttonText="Book a Clarity Call" 
              href="https://calendly.com/jason-galavanteer/discovery_call" 
            />
          </div>
          
          {/* AI Advisory Team Card */}
          <div className="animate-fade-in transform transition-all duration-300 hover:translate-y-[-4px]" style={{ animationDelay: '0.3s' }}>
            <PricingCard 
              title="AI Advisory Team" 
              price="3,499+" 
              description="A dynamic multi-persona AI system customized for your organization" 
              features={[
                "Dynamic multi-persona systems", 
                "Live persona dynamics", 
                "SME expertise spawning", 
                "Knowledge base integration readiness", 
                "Full brand-aligned deliverables", 
                "Structured Executive Takeaways", 
                "Action Plans and Risk Analysis", 
                "60 days of Ongoing Support included", 
                "Private, hosted, and branded"
              ]} 
              buttonText="Book a Clarity Call" 
              href="https://calendly.com/jason-galavanteer/discovery_call" 
              highlighted={true} 
            />
          </div>
        </div>
        
        {/* Support Plans */}
        <div className="mb-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="bg-white p-8 rounded-xl border border-galavanteer-purple/20 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-galavanteer-gray">Ongoing Support Plans</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Standard Support */}
              <div className="bg-galavanteer-gray-light/20 p-6 rounded-lg border border-galavanteer-gray/10">
                <div className="flex justify-between items-baseline mb-4">
                  <h4 className="font-bold text-galavanteer-gray">Standard Support</h4>
                  <span className="text-lg font-bold text-galavanteer-purple">$50<span className="text-sm font-normal text-galavanteer-gray/70">/month</span></span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {[
                    "Hosting + maintenance of your GPT",
                    "One 30-minute refinement session per month",
                    "Access to updates & improvements",
                    "Email support (2–3 day turnaround)",
                    "Regular performance checks"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-galavanteer-purple mt-1"><Check size={16} /></span>
                      <span className="text-galavanteer-gray/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Premium Support */}
              <div className="bg-galavanteer-purple-light/30 p-6 rounded-lg border border-galavanteer-purple/20">
                <div className="flex justify-between items-baseline mb-4">
                  <h4 className="font-bold text-galavanteer-gray">Premium Support</h4>
                  <span className="text-lg font-bold text-galavanteer-purple">$150<span className="text-sm font-normal text-galavanteer-gray/70">/month</span></span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {[
                    "Everything in Standard Support",
                    "Two refinement sessions per month (or 60 minutes total)",
                    "Priority response (24-hour turnaround)",
                    "Light voice/strategy tuning as business evolves",
                    "Further development at $100/hour"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-galavanteer-purple mt-1"><Check size={16} /></span>
                      <span className="text-galavanteer-gray/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <a 
                href="https://calendly.com/jason-galavanteer/discovery_call" 
                className="inline-flex items-center text-galavanteer-purple hover:text-galavanteer-purple-dark transition-colors"
              >
                Learn more about support options <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Value statement */}
        <div className="mb-16 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="p-8 bg-white rounded-lg border border-galavanteer-purple/20 shadow-sm text-center">
            <p className="text-xl text-galavanteer-gray/90 mb-4 font-medium">
              Every Galavanteer system is crafted for clarity, leadership, and momentum — 
              built <span className="text-galavanteer-purple font-semibold">with you</span>, not for you.
            </p>
            <a 
              href="https://calendly.com/jason-galavanteer/discovery_call"
              className="inline-flex items-center gap-2 text-galavanteer-purple hover:text-galavanteer-purple-dark transition-colors"
            >
              Book a Clarity Call <ArrowRight size={16} />
            </a>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
          
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-galavanteer-purple/10">
                <AccordionTrigger className="text-galavanteer-gray hover:text-galavanteer-purple hover:no-underline py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-galavanteer-gray/80 pb-4 pt-1">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
