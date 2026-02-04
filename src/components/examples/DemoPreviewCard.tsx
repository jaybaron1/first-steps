import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users, MessageSquare, Zap, Target } from 'lucide-react';

interface DemoHighlight {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface DemoPreviewCardProps {
  type: 'boardroom' | 'customgpt';
  title: string;
  subtitle: string;
  highlights: DemoHighlight[];
  onExplore: () => void;
  isActive?: boolean;
}

const DemoPreviewCard = ({ 
  type, 
  title, 
  subtitle, 
  highlights, 
  onExplore, 
  isActive = false 
}: DemoPreviewCardProps) => {
  const bgGradient = type === 'boardroom' 
    ? 'bg-gradient-to-br from-galavanteer-purple-light/30 via-white to-galavanteer-purple-light/20'
    : 'bg-gradient-to-br from-galavanteer-gray-light/80 via-white to-galavanteer-gray-light/40';

  return (
    <Card className={`
      relative overflow-hidden transition-all duration-500 border-2
      ${isActive 
        ? 'border-galavanteer-purple shadow-lg scale-[1.02]' 
        : 'border-galavanteer-purple/10 hover:border-galavanteer-purple/30 hover:shadow-md'
      }
      ${bgGradient}
    `}>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge className="mb-2 bg-galavanteer-purple-light/50 text-galavanteer-purple border-galavanteer-purple/20">
              {type === 'boardroom' ? <Users className="w-3 h-3 mr-1" /> : <MessageSquare className="w-3 h-3 mr-1" />}
              {type === 'boardroom' ? 'AI Boardroom' : 'Custom GPT'}
            </Badge>
            <h3 className="text-lg md:text-xl font-bold text-galavanteer-gray mb-1">{title}</h3>
            <p className="text-sm text-galavanteer-gray/70">{subtitle}</p>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="space-y-3 mb-6">
          {highlights.map((highlight, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-galavanteer-purple/10"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-galavanteer-purple-light/50 rounded-lg flex items-center justify-center">
                {highlight.icon}
              </div>
              <div>
                <h4 className="font-medium text-galavanteer-gray text-sm mb-1">{highlight.title}</h4>
                <p className="text-xs text-galavanteer-gray/70">{highlight.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button 
          onClick={onExplore}
          variant={isActive ? "default" : "outline"}
          className={`
            w-full group transition-all duration-300
            ${isActive 
              ? 'bg-galavanteer-purple hover:bg-galavanteer-purple/90 text-white' 
              : 'border-galavanteer-purple/30 hover:bg-galavanteer-purple hover:text-white'
            }
          `}
        >
          {isActive ? 'View Full Transcript' : 'Explore This System'}
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-galavanteer-purple to-galavanteer-purple/70" />
      )}
    </Card>
  );
};

export default DemoPreviewCard;