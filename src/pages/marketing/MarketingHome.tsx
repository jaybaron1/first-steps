import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import '@/styles/marketing.css';
import { storeAttribution, trackPageView, initCalendlyTracking } from '@/lib/marketingTracking';
import MarketingHeader from '@/components/marketing/MarketingHeader';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingHero from '@/components/marketing/MarketingHero';
import CredibilityStrip from '@/components/marketing/CredibilityStrip';
import WhySection from '@/components/marketing/WhySection';
import AIVisibilityScorecard from '@/components/marketing/AIVisibilityScorecard';
import DeliverablesSection from '@/components/marketing/DeliverablesSection';
import ProofSection from '@/components/marketing/ProofSection';
import HowItWorksSection from '@/components/marketing/HowItWorksSection';
import PricingSection from '@/components/marketing/PricingSection';
import FAQSection from '@/components/marketing/FAQSection';
import FinalCTASection from '@/components/marketing/FinalCTASection';

const MarketingHome = () => {
  useEffect(() => {
    storeAttribution();
    trackPageView('/', 'AI Visibility by Galavanteer');
    
    // Initialize Calendly conversion tracking
    const cleanupCalendly = initCalendlyTracking();
    
    return () => {
      if (cleanupCalendly) cleanupCalendly();
    };
  }, []);

  return (
    <div className="marketing-site min-h-screen">
      <Helmet>
        <title>AI Visibility by Galavanteer | Get Found When People Ask AI</title>
        <meta name="description" content="I implement the technical structure that helps AI engines understand your business and recommend you. llms.txt, schema, robots.txt, and tracking — all installed and measured." />
        {/* Google Search Console Verification - Replace YOUR_VERIFICATION_CODE with your actual code */}
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <MarketingHeader />
      
      <main>
        <MarketingHero />
        <CredibilityStrip />
        <WhySection />
        <AIVisibilityScorecard />
        <DeliverablesSection />
        <ProofSection />
        <HowItWorksSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>

      <MarketingFooter />
    </div>
  );
};

export default MarketingHome;
