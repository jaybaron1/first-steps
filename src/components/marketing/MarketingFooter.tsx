import { Link } from 'react-router-dom';
import { trackBookCallClick } from '@/lib/marketingTracking';

const MarketingFooter = () => {
  const handleBookCall = () => {
    trackBookCallClick('footer');
    window.open('https://calendly.com/galavanteer', '_blank');
  };

  return (
    <footer className="bg-[hsl(220_25%_6%)] border-t border-[hsl(220_15%_20%)]">
      <div className="mkt-container py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-[hsl(175_70%_45%)] font-semibold">AI Visibility</span>
              <span className="text-[hsl(40_20%_95%/0.6)] font-normal ml-2">by Galavanteer</span>
            </Link>
            <p className="text-[hsl(220_10%_50%)] text-sm leading-relaxed max-w-xs">
              Technical implementation that helps AI engines understand and recommend your business.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[hsl(40_20%_95%)] font-semibold text-sm mb-1">Pages</h4>
            <Link
              to="/"
              className="text-[hsl(220_10%_50%)] hover:text-[hsl(175_70%_45%)] text-sm transition-colors"
            >
              Home
            </Link>
            <Link
              to="/results"
              className="text-[hsl(220_10%_50%)] hover:text-[hsl(175_70%_45%)] text-sm transition-colors"
            >
              Results & Case Studies
            </Link>
            <Link
              to="/privacy"
              className="text-[hsl(220_10%_50%)] hover:text-[hsl(175_70%_45%)] text-sm transition-colors"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[hsl(40_20%_95%)] font-semibold text-sm mb-1">Get Started</h4>
            <button
              onClick={handleBookCall}
              className="text-left text-[hsl(175_70%_45%)] hover:text-[hsl(175_70%_38%)] text-sm transition-colors"
            >
              Book a Call →
            </button>
            <a
              href="mailto:hello@galavanteer.com"
              className="text-[hsl(220_10%_50%)] hover:text-[hsl(175_70%_45%)] text-sm transition-colors"
            >
              hello@galavanteer.com
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[hsl(220_15%_20%)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[hsl(220_10%_50%)] text-xs">
              © {new Date().getFullYear()} Galavanteer. All rights reserved.
            </p>
            <p className="text-[hsl(220_10%_50%/0.6)] text-xs text-center md:text-right max-w-md">
              Not affiliated with OpenAI, Anthropic, Google, or Perplexity. AI Visibility refers to 
              technical implementation strategies, not guaranteed outcomes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
