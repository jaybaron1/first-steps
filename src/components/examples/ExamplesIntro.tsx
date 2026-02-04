
import React from "react";
import { Star } from "lucide-react";

const ExamplesIntro = () => (
  <>
    <h1 className="section-title mb-4 text-3xl md:text-4xl text-galavanteer-purple tracking-tight">
      Examples &amp; Archetypes
    </h1>
    <p className="mb-8 max-w-2xl text-lg text-galavanteer-gray/90 animate-fade-in">
      Over the last year, we've quietly built more than GPTs: <b>living intelligence systems</b> that help people recognize, scale, and speak their essence—consistently and with integrity.<br className="hidden md:block" /> Here's how.
    </p>
    <div className="mb-12 animate-fade-in">
      <div className="bg-white rounded-lg shadow border border-gray-100 p-7 mb-4 flex items-start gap-4">
        <Star className="w-10 h-10 text-yellow-400 mt-2 animate-pulse" />
        <div>
          <p className="mb-3 text-base md:text-lg">
            <b>This isn't just a portfolio.</b> <br />
            It's an ecosystem of real transformations—each archetype below has its own story, language, and outcomes, always in the client's real voice.<br />
            <span className="hidden md:inline"><b>This is how "AI" becomes a mirror for clarity, creativity, and scale.</b></span>
          </p>
          <p className="text-galavanteer-purple-dark/80 italic">
            Scroll to see some of the breakthroughs we've helped build.
          </p>
        </div>
      </div>
    </div>
  </>
);

export default ExamplesIntro;
