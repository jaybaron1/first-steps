
import React from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ExperienceTabsProps {
  activeTab: 'boardroom' | 'customgpt';
  setActiveTab: (tab: 'boardroom' | 'customgpt') => void;
}

const ExperienceTabs = ({ activeTab, setActiveTab }: ExperienceTabsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-center mb-6 md:mb-8 px-4 md:px-0">
      <div className="inline-flex p-1.5 bg-galavanteer-gray-light rounded-lg max-w-full">
        <button 
          onClick={() => setActiveTab('boardroom')}
          className={`px-5 md:px-6 py-2.5 md:py-3 rounded-md flex items-center gap-1.5 md:gap-2 transition-all text-sm md:text-base ${
            activeTab === 'boardroom' 
              ? 'bg-white shadow-sm text-galavanteer-purple font-medium' 
              : 'text-galavanteer-gray/70 hover:text-galavanteer-gray'
          }`}
        >
          <Users size={isMobile ? 16 : 18} />
          AI Boardroom
        </button>
        <button 
          onClick={() => setActiveTab('customgpt')}
          className={`px-5 md:px-6 py-2.5 md:py-3 rounded-md flex items-center gap-1.5 md:gap-2 transition-all text-sm md:text-base ${
            activeTab === 'customgpt' 
              ? 'bg-white shadow-sm text-galavanteer-purple font-medium' 
              : 'text-galavanteer-gray/70 hover:text-galavanteer-gray'
          }`}
        >
          <MessageSquare size={isMobile ? 16 : 18} />
          Custom GPT
        </button>
      </div>
    </div>
  );
};

export default ExperienceTabs;
