import React from 'react';
import { PlayCircle, CheckCircle2 } from 'lucide-react';

const ProofBar: React.FC = () => {
  return (
    <div className="w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-100">
      <div className="container py-2">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-sm text-galavanteer-gray animate-fade-in">
          <span className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" aria-hidden />
            <span>1 hr interview</span>
          </span>
          <span className="hidden md:inline text-galavanteer-gray/40">•</span>
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-galavanteer-purple" />
            3–3.5 hrs design
          </span>
          <span className="hidden md:inline text-galavanteer-gray/40">•</span>
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-galavanteer-purple" />
            0.5–1 hr training
          </span>
          <span className="hidden md:inline text-galavanteer-gray/40">•</span>
          <a
            href="https://www.instagram.com/reel/DMQ5zvEuKSx/?igsh=aXR5Ym5sNzF6dHZk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-galavanteer-purple hover:underline story-link"
          >
            <PlayCircle className="w-4 h-4" /> Watch 45s explainer
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProofBar;
