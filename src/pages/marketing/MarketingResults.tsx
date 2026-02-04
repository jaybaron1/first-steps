import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Check, TrendingUp, BarChart3, Target } from 'lucide-react';
import '@/styles/marketing.css';
import { storeAttribution, trackPageView, trackBookCallClick, trackVideoPlay } from '@/lib/marketingTracking';
import MarketingHeader from '@/components/marketing/MarketingHeader';
import MarketingFooter from '@/components/marketing/MarketingFooter';

const MarketingResults = () => {
  useEffect(() => {
    storeAttribution();
    trackPageView('/results', 'Results & Case Studies | AI Visibility');

    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleBookCall = () => {
    trackBookCallClick('results_page');
    window.open('https://calendly.com/galavanteer', '_blank');
  };

  return (
    <div className="marketing-site min-h-screen">
      <Helmet>
        <title>Results & Case Studies | AI Visibility by Galavanteer</title>
        <meta name="description" content="Real results from AI visibility implementation. See how clients are getting found by AI and booking real customers." />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <MarketingHeader />

      <main className="pt-24">
        {/* Hero */}
        <section className="mkt-section">
          <div className="mkt-container text-center">
            <h1 className="mb-6">Results and Case Studies</h1>
            <p className="text-[hsl(220_10%_50%)] text-lg max-w-2xl mx-auto">
              Real implementation work. Real tracking. Real outcomes.
            </p>
          </div>
        </section>

        {/* Dr. Cris Case Study */}
        <section className="mkt-section mkt-section-light">
          <div className="mkt-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div onClick={() => trackVideoPlay('Dr. Cris Testimonial', 'results_page')}>
                <blockquote className="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DR6NX14jdad/" data-instgrm-version="14" style={{ background: '#FFF', border: 0, borderRadius: '12px', maxWidth: '540px', padding: 0, width: '100%' }}>
                  <div style={{ padding: '16px' }}>
                    <a href="https://www.instagram.com/reel/DR6NX14jdad/" target="_blank" rel="noopener noreferrer" style={{ color: '#3897f0' }}>View on Instagram</a>
                  </div>
                </blockquote>
              </div>

              <div>
                <span className="text-[hsl(175_70%_45%)] text-sm font-semibold uppercase tracking-wide">Featured Case Study</span>
                <h2 className="text-[hsl(220_20%_15%)] mt-2 mb-6">Dr. Cris — Manhattan Med Spa</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[hsl(0_70%_55%/0.1)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[hsl(0_70%_55%)] text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[hsl(220_20%_15%)]">Before</p>
                      <p className="text-[hsl(220_20%_15%/0.7)] text-sm">Paying for SEO, completely invisible online. No AI presence.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[hsl(175_70%_45%/0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[hsl(175_70%_45%)] text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[hsl(220_20%_15%)]">Implemented</p>
                      <p className="text-[hsl(220_20%_15%/0.7)] text-sm">llms.txt, AI-aware robots.txt, schema, tracking, Shopify SEO fixes.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[hsl(150_70%_45%/0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[hsl(150_70%_45%)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[hsl(220_20%_15%)]">Early Indicators</p>
                      <p className="text-[hsl(220_20%_15%/0.7)] text-sm">AI referrals appearing, GSC impressions up, and a $1,500 booked treatment from an AI-found patient within 3 weeks.</p>
                    </div>
                  </div>
                </div>

                <button onClick={handleBookCall} className="mkt-btn mkt-btn-primary">
                  Book a Call <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How We Measure */}
        <section className="mkt-section">
          <div className="mkt-container">
            <h2 className="text-center mb-12">How we measure results</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Target, title: 'Attribution Tracking', desc: 'UTM parameters and referrer analysis capture exactly where leads come from, including AI engines.' },
                { icon: BarChart3, title: 'GA4 Events', desc: 'Custom events track every meaningful action so you can see the full customer journey.' },
                { icon: TrendingUp, title: 'Monthly Reporting', desc: 'Clear snapshots showing AI referrals, search performance, and lead sources.' },
              ].map((item, i) => (
                <div key={i} className="mkt-card text-center">
                  <item.icon className="w-8 h-8 text-[hsl(175_70%_45%)] mx-auto mb-4" />
                  <h3 className="text-lg mb-2">{item.title}</h3>
                  <p className="text-[hsl(220_10%_50%)] text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button onClick={handleBookCall} className="mkt-btn mkt-btn-primary">
                Book a Call <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default MarketingResults;
