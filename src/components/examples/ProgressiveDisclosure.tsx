import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgressiveDisclosureProps {
  children: React.ReactNode;
  previewHeight?: string;
  expandText?: string;
  collapseText?: string;
  className?: string;
}

const ProgressiveDisclosure = ({ 
  children, 
  previewHeight = "300px",
  expandText = "View Full Transcript",
  collapseText = "Show Less",
  className = ""
}: ProgressiveDisclosureProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`
          overflow-hidden transition-all duration-700 ease-in-out
          ${isExpanded ? 'max-h-none' : `max-h-[${previewHeight}]`}
        `}
        style={{ maxHeight: isExpanded ? 'none' : previewHeight }}
      >
        {children}
      </div>
      
      {/* Gradient fade overlay when collapsed */}
      {!isExpanded && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"
        />
      )}
      
      {/* Expand/Collapse button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          size="sm"
          className="group border-galavanteer-purple/30 hover:bg-galavanteer-purple hover:text-white transition-all duration-300"
        >
          {isExpanded ? collapseText : expandText}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 ml-2 group-hover:-translate-y-0.5 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProgressiveDisclosure;