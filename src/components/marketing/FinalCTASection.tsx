import { ArrowRight } from 'lucide-react';
import { trackBookCallClick } from '@/lib/marketingTracking';

const FinalCTASection = () => {
  const handleBookCall = () => {
    trackBookCallClick('final_cta');
    window.open('https://calendly.com/galavanteer', '_blank');
  };

  const scrollToScorecard = () => {
    document.querySelector('#scorecard')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="mkt-section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[hsl(175_70%_45%/0.05)] blur-3xl" />
      </div>

      <div className="mkt-container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6">
            If customers are asking AI, you should be in the answers.
          </h2>
          
          <p className="text-[hsl(220_10%_50%)] text-lg mb-10 max-w-2xl mx-auto">
            The businesses that become easy for AI to understand get recommended more often. 
            Let me help you become one of them.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleBookCall} className="mkt-btn mkt-btn-primary">
              Book an AI Visibility Call
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={scrollToScorecard} className="mkt-btn mkt-btn-ghost">
              Run the Scorecard →
            </button>
          </div>

          <p className="text-sm text-[hsl(220_10%_50%)] mt-8">
            15–20 minutes. No pressure. If it is not a fit, I will tell you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
