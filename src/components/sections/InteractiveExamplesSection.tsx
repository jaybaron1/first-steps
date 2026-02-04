
import React, { useState } from 'react';
import AIBoardroomDemo from '@/components/examples/AIBoardroomDemo';
import CustomGPTDemo from '@/components/examples/CustomGPTDemo';
import ExperienceTabs from '@/components/examples/ExperienceTabs';
import ExperienceCTA from '@/components/examples/ExperienceCTA';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

const InteractiveExamplesSection = () => {
  const [activeTab, setActiveTab] = useState<'boardroom' | 'customgpt'>('boardroom');
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <section id="experience" className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="container max-w-5xl px-4 md:px-8">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="w-full group">
            <div className="flex items-center justify-center gap-2 mb-3">
              <h2 className="text-2xl md:text-4xl font-bold text-center">Experience Galavanteer</h2>
              {isOpen ? <ChevronUp size={24} className="text-galavanteer-purple" /> : <ChevronDown size={24} className="text-galavanteer-purple" />}
            </div>
            <p className="text-center text-galavanteer-gray/80 mb-8 md:mb-10 max-w-3xl mx-auto text-sm md:text-base px-3">
              See how our AI systems work in real-world scenarios
            </p>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-6">
            <ExperienceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl overflow-hidden">
              {activeTab === 'boardroom' ? <AIBoardroomDemo /> : <CustomGPTDemo />}
            </div>
            
            <ExperienceCTA />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
};

export default InteractiveExamplesSection;
