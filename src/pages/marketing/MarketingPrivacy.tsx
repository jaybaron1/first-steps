import { Helmet } from 'react-helmet-async';
import '@/styles/marketing.css';
import MarketingHeader from '@/components/marketing/MarketingHeader';
import MarketingFooter from '@/components/marketing/MarketingFooter';

const MarketingPrivacy = () => {
  return (
    <div className="marketing-site min-h-screen">
      <Helmet>
        <title>Privacy Policy | AI Visibility by Galavanteer</title>
        <meta name="description" content="Privacy policy for AI Visibility by Galavanteer. How we collect, use, and protect your information." />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <MarketingHeader />

      <main className="pt-24 pb-16">
        <div className="mkt-container max-w-3xl">
          <h1 className="mb-8">Privacy Policy</h1>
          <p className="text-[hsl(220_10%_50%)] mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <div className="space-y-8 text-[hsl(40_20%_95%/0.85)]">
            <section>
              <h2 className="text-xl mb-4">Information We Collect</h2>
              <p className="mb-4">When you use our website or submit forms, we may collect:</p>
              <ul className="list-disc pl-6 space-y-2 text-[hsl(220_10%_50%)]">
                <li>Contact information (name, email, website URL)</li>
                <li>Business information (business type, platform, location)</li>
                <li>Form responses (scorecard answers)</li>
                <li>Analytics data (pages visited, time on site)</li>
                <li>Attribution data (referrer URL, UTM parameters, AI referral source)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-[hsl(220_10%_50%)]">
                <li>To respond to your inquiries and provide services</li>
                <li>To send your scorecard results</li>
                <li>To understand how visitors find and use our site</li>
                <li>To improve our services and marketing</li>
                <li>To track and measure the effectiveness of AI visibility implementations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl mb-4">Analytics and Tracking</h2>
              <p className="text-[hsl(220_10%_50%)]">
                We use Google Analytics 4 (GA4) to understand how visitors interact with our website. 
                We also capture UTM parameters and referrer information to understand how visitors 
                find us, including whether they were referred by AI engines like ChatGPT, Perplexity, 
                Claude, or Gemini. This helps us measure the effectiveness of AI visibility work.
              </p>
            </section>

            <section>
              <h2 className="text-xl mb-4">Data Sharing</h2>
              <p className="text-[hsl(220_10%_50%)]">
                We do not sell your personal information to third parties. We may share data with 
                service providers who help us operate our business (analytics, email, scheduling) 
                under appropriate confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl mb-4">Your Rights</h2>
              <p className="text-[hsl(220_10%_50%)]">
                You may request access to, correction of, or deletion of your personal information 
                by contacting us at hello@galavanteer.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl mb-4">Contact</h2>
              <p className="text-[hsl(220_10%_50%)]">
                Questions about this policy? Email us at{' '}
                <a href="mailto:hello@galavanteer.com" className="text-[hsl(175_70%_45%)] hover:underline">
                  hello@galavanteer.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default MarketingPrivacy;
