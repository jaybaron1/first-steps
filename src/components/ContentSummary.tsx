import React from 'react';

interface ContentSummaryProps {
  title: string;
  summary: string;
  topics: string[];
  lastUpdated?: string;
}

const ContentSummary = ({ title, summary, topics, lastUpdated }: ContentSummaryProps) => {
  return (
    <div className="sr-only" aria-hidden="true">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-galavanteer-gray mb-2">
            Page Summary
          </h2>
          <p className="text-galavanteer-gray/80 leading-relaxed">
            {summary}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-galavanteer-gray mb-2">
            Key Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-galavanteer-purple/10 text-galavanteer-purple text-sm rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        
        {lastUpdated && (
          <div className="text-xs text-galavanteer-gray/60">
            Last updated: {lastUpdated}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentSummary;