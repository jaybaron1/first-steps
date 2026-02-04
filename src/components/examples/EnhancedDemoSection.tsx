import React, { useState } from 'react';
import DemoPreviewCard from './DemoPreviewCard';
import AIBoardroomDemo from './AIBoardroomDemo';
import CustomGPTDemo from './CustomGPTDemo';
import { Users, MessageSquare, Zap, Target, Brain, Lightbulb } from 'lucide-react';

const EnhancedDemoSection = () => {
  const [selectedDemo, setSelectedDemo] = useState<'boardroom' | 'customgpt' | null>(null);

  const boardroomHighlights = [
    {
      icon: <Users className="w-4 h-4 text-galavanteer-purple" />,
      title: "Multi-Expert Simulation",
      description: "CEO, CMO, CRO, and specialists collaborate in real-time"
    },
    {
      icon: <Target className="w-4 h-4 text-galavanteer-purple" />,
      title: "Strategy to Execution",
      description: "From 'Subway Series' rebrand to complete campaign plan"
    },
    {
      icon: <Zap className="w-4 h-4 text-galavanteer-purple" />,
      title: "Instant Deliverables",
      description: "Social calendar, automation stack, and competitive analysis"
    }
  ];

  const customGPTHighlights = [
    {
      icon: <Brain className="w-4 h-4 text-galavanteer-purple" />,
      title: "Your Voice, Amplified",
      description: "Reflects your unique thinking patterns and vocabulary"
    },
    {
      icon: <Lightbulb className="w-4 h-4 text-galavanteer-purple" />,
      title: "Personalized Frameworks",
      description: "Creates solutions tailored to your specific challenges"
    },
    {
      icon: <MessageSquare className="w-4 h-4 text-galavanteer-purple" />,
      title: "Structured Guidance",
      description: "Moves from problem to options to actionable next steps"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Preview Cards */}
      {!selectedDemo && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <DemoPreviewCard
            type="boardroom"
            title="AI Boardroom"
            subtitle="Multi-expert strategy sessions"
            highlights={boardroomHighlights}
            onExplore={() => setSelectedDemo('boardroom')}
          />
          <DemoPreviewCard
            type="customgpt"
            title="Custom GPT"
            subtitle="Personalized reflection partner"
            highlights={customGPTHighlights}
            onExplore={() => setSelectedDemo('customgpt')}
          />
        </div>
      )}

      {/* Full Demo Display */}
      {selectedDemo && (
        <div className="space-y-6">
          {/* Back to Overview */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedDemo(null)}
              className="text-galavanteer-purple hover:underline text-sm font-medium"
            >
              ← Back to System Overview
            </button>
            
            {/* Switch Demo */}
            <button
              onClick={() => setSelectedDemo(selectedDemo === 'boardroom' ? 'customgpt' : 'boardroom')}
              className="text-galavanteer-gray/70 hover:text-galavanteer-purple text-sm font-medium"
            >
              View {selectedDemo === 'boardroom' ? 'Custom GPT' : 'AI Boardroom'} →
            </button>
          </div>

          {/* Progressive Disclosure Demo */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl border border-galavanteer-purple/10 shadow-sm">
            {selectedDemo === 'boardroom' ? <AIBoardroomDemo /> : <CustomGPTDemo />}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDemoSection;