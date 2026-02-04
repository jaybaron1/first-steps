import { ArrowRight, ChevronDown } from 'lucide-react';
import { trackBookCallClick } from '@/lib/marketingTracking';

const MarketingHero = () => {
  const handleBookCall = () => {
    trackBookCallClick('hero');
    window.open('https://calendly.com/galavanteer', '_blank');
  };

  const scrollToScorecard = () => {
    document.querySelector('#scorecard')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center pt-20 pb-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-[hsl(175_70%_45%/0.05)] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(175_70%_45%/0.03)] blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(175 70% 45% / 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(175 70% 45% / 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="mkt-container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="max-w-xl">
            <h1 className="mb-6 mkt-animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Get found when people ask AI who to hire.
            </h1>
            
            <p 
              className="text-lg text-[hsl(220_10%_50%)] mb-8 leading-relaxed mkt-animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              I implement the technical structure that helps AI engines understand your business 
              and recommend you — and we track it so you can see what is working.
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-4 mb-6 mkt-animate-fade-up"
              style={{ animationDelay: '0.3s' }}
            >
              <button onClick={handleBookCall} className="mkt-btn mkt-btn-primary" data-track-cta="Book AI Visibility Call">
                Book an AI Visibility Call
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={scrollToScorecard} className="mkt-btn mkt-btn-secondary" data-track-cta="Run Scorecard">
                Run the Scorecard
              </button>
            </div>

            <p 
              className="text-sm text-[hsl(220_10%_50%)] mkt-animate-fade-up"
              style={{ animationDelay: '0.4s' }}
            >
              15–20 minutes. No pressure. If it is not a fit, I will tell you.
            </p>
          </div>

          {/* Right: Abstract Illustration */}
          <div 
            className="relative mkt-animate-fade-up hidden lg:block"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="aspect-square max-w-md mx-auto relative">
              {/* Structured signals visualization */}
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full"
                fill="none"
              >
                {/* Central node */}
                <circle
                  cx="200"
                  cy="200"
                  r="60"
                  stroke="hsl(175 70% 45%)"
                  strokeWidth="2"
                  fill="hsl(175 70% 45% / 0.1)"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="40"
                  fill="hsl(175 70% 45% / 0.2)"
                />
                
                {/* Orbital rings */}
                <circle
                  cx="200"
                  cy="200"
                  r="120"
                  stroke="hsl(175 70% 45% / 0.2)"
                  strokeWidth="1"
                  strokeDasharray="8 8"
                  fill="none"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="160"
                  stroke="hsl(175 70% 45% / 0.1)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  fill="none"
                />

                {/* Connection lines */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                  const x1 = 200 + 60 * Math.cos((angle * Math.PI) / 180);
                  const y1 = 200 + 60 * Math.sin((angle * Math.PI) / 180);
                  const x2 = 200 + 120 * Math.cos((angle * Math.PI) / 180);
                  const y2 = 200 + 120 * Math.sin((angle * Math.PI) / 180);
                  return (
                    <g key={angle}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="hsl(175 70% 45% / 0.3)"
                        strokeWidth="1"
                      />
                      <circle
                        cx={x2}
                        cy={y2}
                        r="8"
                        fill="hsl(175 70% 45% / 0.4)"
                        stroke="hsl(175 70% 45%)"
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}

                {/* Data flow indicators */}
                {[30, 90, 150, 210, 270, 330].map((angle) => {
                  const x = 200 + 160 * Math.cos((angle * Math.PI) / 180);
                  const y = 200 + 160 * Math.sin((angle * Math.PI) / 180);
                  return (
                    <circle
                      key={angle}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="hsl(175 70% 45% / 0.3)"
                    />
                  );
                })}

                {/* Labels */}
                <text x="200" y="205" textAnchor="middle" fill="hsl(175 70% 45%)" fontSize="12" fontWeight="600">
                  Your
                </text>
                <text x="200" y="220" textAnchor="middle" fill="hsl(175 70% 45%)" fontSize="12" fontWeight="600">
                  Business
                </text>

                {/* Schema indicators */}
                <text x="320" y="140" fill="hsl(175 70% 45% / 0.6)" fontSize="10">schema</text>
                <text x="80" y="260" fill="hsl(175 70% 45% / 0.6)" fontSize="10">llms.txt</text>
                <text x="280" y="320" fill="hsl(175 70% 45% / 0.6)" fontSize="10">robots.txt</text>
              </svg>

              {/* Floating badges */}
              <div className="absolute top-8 right-0 bg-[hsl(220_25%_6%)] border border-[hsl(220_15%_20%)] rounded-lg px-3 py-2 text-xs">
                <span className="text-[hsl(175_70%_45%)]">✓</span> AI-readable
              </div>
              <div className="absolute bottom-8 left-0 bg-[hsl(220_25%_6%)] border border-[hsl(220_15%_20%)] rounded-lg px-3 py-2 text-xs">
                <span className="text-[hsl(175_70%_45%)]">✓</span> Trackable
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center hidden md:block">
          <ChevronDown className="w-6 h-6 text-[hsl(220_10%_50%)] animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default MarketingHero;
